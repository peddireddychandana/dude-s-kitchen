const express = require('express');
const Offer = require('../models/Offer');
const { authenticate } = require('./auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find().select('title discount type expiry image').sort({ createdAt: -1 }).lean();
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    req.io.emit('offers:update');
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    req.io.emit('offers:update');
    res.json(offer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    req.io.emit('offers:update');
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
