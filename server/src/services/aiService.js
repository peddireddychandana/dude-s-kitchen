const fetch = require('node-fetch');
const crypto = require('crypto');
const DEFAULT_MODEL = process.env.AI_MODEL || 'llama3.2:3b';
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const REQUEST_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 120000);

function generateHash(str) {
  return crypto.createHash('sha1').update(str || '').digest('hex');
}

function buildPrompt(dishData) {
  const schema = {
    dishName: dishData.name || '',
    overview: 'A short customer-friendly explanation of what this dish is.',
    ingredients: [{ name: 'Ingredient name', status: 'typical | confirmed | needs_confirmation' }],
    tasteProfile: ['Savory', 'Spicy', 'Creamy', 'Tangy', 'Sweet', 'Smoky', 'Crispy'],
    texture: 'Short description of the expected texture.',
    spiceLevel: { label: 'Mild | Medium | Hot | Very Hot', isEstimate: true },
    dietaryType: 'Vegetarian | Vegan | Non-vegetarian | Unknown',
    dietaryConfidence: 'confirmed | needs_confirmation | unknown',
    allergens: {
      potential: ['Dairy', 'Nuts', 'Gluten', 'Soy', 'Eggs', 'Shellfish', 'Sesame'],
      confirmed: [],
      warning: 'Confirm all ingredients and cross-contamination risks with the restaurant.',
    },
    bestFor: ['People who enjoy rich curries'],
    servingSuggestions: ['Raita'],
    recommendation: 'A short engaging reason someone might enjoy this dish.',
  };

  return [
    'You are a helpful restaurant assistant that explains dishes to customers.',
    'Return ONLY a single valid JSON object. No markdown, no code fences, no extra text.',
    'Match EXACTLY this JSON shape:',
    JSON.stringify(schema),
    '',
    'Menu item details provided by the restaurant:',
    `- Name: ${dishData.name || 'Unknown'}`,
    `- Description: ${dishData.description || 'Not provided'}`,
    `- Category: ${dishData.category || 'Not provided'}`,
    `- Vegetarian flag: ${dishData.veg === true ? 'vegetarian' : dishData.veg === false ? 'non-vegetarian' : 'not provided'}`,
    '',
    'RULES:',
    '- Never invent the exact recipe, ingredient quantities, nutrition, calories, or preparation methods.',
    '- Mark ingredients confirmed by the restaurant as "confirmed"; otherwise use "typical" or "needs_confirmation".',
    '- Only give a confident spice level when it is supported by the data above; otherwise set isEstimate to true.',
    '- If the dietary type is unclear, set dietaryType to "Unknown" and dietaryConfidence to "unknown".',
    '- Never claim a dish is allergen-free. Always include the allergen warning.',
    '- Keep every field concise and customer friendly.',
    'Return only the JSON object.',
  ].join('\n');
}

function extractJSON(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('AI returned an empty response');
  }
  let cleaned = text.trim();
  const fence = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) cleaned = fence[1].trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON object found in AI response');
  }
  const slice = cleaned.slice(start, end + 1);
  return JSON.parse(slice);
}

function validateAnalysis(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new Error('AI response is not a JSON object');
  }
  const asString = (v) => (typeof v === 'string' ? v : '');
  const asArray = (v) =>
    Array.isArray(v) ? v.filter((x) => x != null).map((x) => String(x)) : [];

  const spiceLabels = ['Mild', 'Medium', 'Hot', 'Very Hot'];
  const spice = obj.spiceLevel && typeof obj.spiceLevel === 'object' ? obj.spiceLevel : {};
  const allergens = obj.allergens && typeof obj.allergens === 'object' ? obj.allergens : {};

  const ingredients = Array.isArray(obj.ingredients)
    ? obj.ingredients
        .filter((i) => i && typeof i === 'object' && i.name)
        .map((i) => ({
          name: String(i.name),
          status: ['typical', 'confirmed', 'needs_confirmation'].includes(i.status)
            ? i.status
            : 'typical',
        }))
    : [];

  return {
    dishName: asString(obj.dishName),
    overview: asString(obj.overview),
    ingredients,
    tasteProfile: asArray(obj.tasteProfile),
    texture: asString(obj.texture),
    spiceLevel: {
      label: spiceLabels.includes(spice.label) ? spice.label : 'Mild',
      isEstimate: spice.isEstimate !== false,
    },
    dietaryType: asString(obj.dietaryType) || 'Unknown',
    dietaryConfidence: ['confirmed', 'needs_confirmation', 'unknown'].includes(
      obj.dietaryConfidence
    )
      ? obj.dietaryConfidence
      : 'unknown',
    allergens: {
      potential: asArray(allergens.potential),
      confirmed: asArray(allergens.confirmed),
      warning:
        asString(allergens.warning) ||
        'Confirm all ingredients and cross-contamination risks with the restaurant.',
    },
    bestFor: asArray(obj.bestFor),
    servingSuggestions: asArray(obj.servingSuggestions),
    recommendation: asString(obj.recommendation),
  };
}

async function callOllama(prompt) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        prompt,
        stream: false,
        format: 'json',
        options: { temperature: 0.2, top_p: 0.9 },
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      const err = new Error(`AI provider responded with ${res.status}${body ? ': ' + body.slice(0, 200) : ''}`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } catch (e) {
    if (e.name === 'AbortError') {
      const err = new Error('AI provider request timed out');
      err.status = 504;
      throw err;
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

async function analyzeDishWithAI(dishData) {
  const provider = (process.env.AI_PROVIDER || 'ollama').toLowerCase();

  if (provider !== 'ollama') {
    const err = new Error(`Unsupported AI provider: ${provider}`);
    err.status = 500;
    throw err;
  }

  const prompt = buildPrompt(dishData);
  const data = await callOllama(prompt);
  const raw = data.response || '';
  const parsed = extractJSON(raw);
  const analysis = validateAnalysis(parsed);
  return { provider: 'ollama', model: DEFAULT_MODEL, analysis };
}

module.exports = { analyzeDishWithAI, generateHash, buildPrompt, extractJSON, validateAnalysis };
