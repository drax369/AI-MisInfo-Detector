const express = require('express');
const router = express.Router();
const { analyzeContent } = require('../services/geminiService');
const Analysis = require('../models/Analysis');

router.post('/', async (req, res) => {
  try {
    const { content, inputType } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content is required' });
    }

    const result = await analyzeContent(content);

    // Save to DB and include _id in response
    try {
      const analysis = await Analysis.create({
        content: content.slice(0, 500),
        credibilityScore: result.credibilityScore,
        verdict: result.verdict,
        redFlags: result.redFlags,
        explanation: result.explanation,
        explanationLocal: result.explanationLocal || '',
        educationalTip: result.educationalTip,
        educationalTipLocal: result.educationalTipLocal || '',
        detectedLanguage: result.detectedLanguage || 'English',
        sources: result.sources || [],
        inputType: inputType || 'text',
      });
      console.log('Saved to MongoDB with id:', analysis._id);
      // Include _id in response so frontend can use it for sharing
      res.json({ ...result, _id: analysis._id });
    } catch (dbErr) {
      console.error('MongoDB save failed (non-critical):', dbErr.message);
      // Still return result even if DB save fails
      res.json(result);
    }

  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
