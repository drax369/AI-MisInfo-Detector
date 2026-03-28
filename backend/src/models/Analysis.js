const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  content: { type: String, required: true },
  credibilityScore: { type: Number, required: true },
  verdict: { type: String, required: true },
  redFlags: [String],
  explanation: { type: String },
  educationalTip: { type: String },
  sources: [{ title: String, url: String }],
  inputType: { type: String, default: 'text' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analysis', AnalysisSchema);