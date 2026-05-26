const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
  },
  banner: {
    type: String,
    default: '',
  },
  discount: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ['default', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'yearly'],
    default: 'default',
  },
  expiryDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Offer', offerSchema);
