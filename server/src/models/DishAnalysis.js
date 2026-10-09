const mongoose = require('mongoose');

const dishAnalysisSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true, unique: true },
  analysis: { type: mongoose.Schema.Types.Mixed, required: true },
  foodHash: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('DishAnalysis', dishAnalysisSchema);