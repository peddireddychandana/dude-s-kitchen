const express = require('express');
const Food = require('../models/Food');
const DishAnalysis = require('../models/DishAnalysis');
const { analyzeDishWithAI, generateHash } = require('../services/aiService');

const router = express.Router();

const RATE_LIMIT_WINDOW_MS = Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 60 * 1000);
const RATE_LIMIT_MAX = Number(process.env.AI_RATE_LIMIT_MAX || 5);
const rateBuckets = new Map();

function rateLimit(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now();
  let entry = rateBuckets.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) {
    entry = { count: 0, start: now };
  }
  entry.count += 1;
  rateBuckets.set(ip, entry);

  if (entry.count > RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.start + RATE_LIMIT_WINDOW_MS - now) / 1000);
    res.setHeader('Retry-After', String(Math.max(retryAfter, 1)));
    return res.status(429).json({
      message: 'Free AI limit reached. Please wait a moment and try again.',
      retryAfter: Math.max(retryAfter, 1),
    });
  }
  next();
}

function hashFood(food) {
  return generateHash(
    JSON.stringify({
      name: food.name || '',
      description: food.description || '',
      category: food.category || '',
      veg: food.veg,
      ingredients: food.ingredients || [],
      allergens: food.allergens || [],
      spiceLevel: food.spiceLevel || '',
    })
  );
}

router.post('/analyze-dish', rateLimit, async (req, res) => {
  try {
    const { menuItemId } = req.body || {};
    if (!menuItemId || typeof menuItemId !== 'string') {
      return res.status(400).json({ message: 'A valid menuItemId is required.' });
    }

    let food;
    try {
      food = await Food.findById(menuItemId).lean();
    } catch {
      return res.status(400).json({ message: 'Invalid menu item id.' });
    }
    if (!food) {
      return res.status(404).json({ message: 'Dish not found.' });
    }

    const foodHash = hashFood(food);

    const existing = await DishAnalysis.findOne({ foodId: food._id }).lean();
    if (existing && existing.foodHash === foodHash) {
      return res.json({ cached: true, analysis: existing.analysis });
    }

    const dishData = {
      name: food.name,
      description: food.description,
      category: food.category,
      veg: food.veg,
      ingredients: food.ingredients,
      allergens: food.allergens,
      spiceLevel: food.spiceLevel,
    };

    let result;
    try {
      result = await analyzeDishWithAI(dishData);
    } catch (aiErr) {
      const status = aiErr.status || 502;
      const message =
        status === 429
          ? 'Free AI limit reached. Please try again later.'
          : status === 504
          ? 'The AI took too long to respond. Please retry.'
          : 'AI analysis is temporarily unavailable. Please try again.';
      if (process.env.NODE_ENV !== 'production') {
        console.error('AI analysis error:', aiErr.message);
      }
      return res.status(status).json({ message });
    }

    const analysis = {
      ...result.analysis,
      provider: result.provider,
      model: result.model,
      generatedAt: new Date().toISOString(),
    };

    await DishAnalysis.findOneAndUpdate(
      { foodId: food._id },
      { foodId: food._id, analysis, foodHash },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ cached: false, analysis });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('AI route error:', err);
    }
    return res.status(500).json({ message: 'Something went wrong while analyzing this dish.' });
  }
});

module.exports = router;
