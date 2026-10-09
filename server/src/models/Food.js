const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
  },
  veg: {
    type: Boolean,
    default: false,
  },
  dietaryType: {
    type: String,
    enum: ['', 'Vegetarian', 'Vegan', 'Non-vegetarian', 'Unknown'],
    default: '',
  },
  ingredients: {
    type: [String],
    default: [],
  },
  allergens: {
    type: [String],
    default: [],
  },
  spiceLevel: {
    type: String,
    enum: ['', 'Mild', 'Medium', 'Hot', 'Very Hot'],
    default: '',
  },
  preparationNotes: {
    type: String,
    default: '',
  },
  popular: {
    type: Boolean,
    default: false,
  },
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Food', foodSchema);
