const express = require('express');
const router = express.Router();
const { scrapeURL } = require('../services/scraperService');
const { analyzeContent } = require('../services/geminiService');
const Analysis = require('../models/Analysis');

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || url.trim() === '') {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format. Make sure it starts with http:// or https://' });
    }

    console.log('Scraping URL:', url);
    const scraped = await scrapeURL(url);
    console.log('Scraped title:', scraped.title);
    console.log('Scraped content length:', scraped.content.length);

    // Analyze the scraped content
    const analysisInput = `Article Title: ${scraped.title}\n\nArticle Content: ${scraped.content}\n\nSource URL: ${scraped.url}`;
    const result = await analyzeContent(analysisInput);

    // Save to DB non-blocking
    Analysis.create({
      content: `[URL] ${url} — ${scraped.title}`.slice(0, 500),
      credibilityScore: result.credibilityScore,
      verdict: result.verdict,
      redFlags: result.redFlags,
      explanation: result.explanation,
      explanationLocal: result.explanationLocal || '',
      educationalTip: result.educationalTip,
      educationalTipLocal: result.educationalTipLocal || '',
      detectedLanguage: result.detectedLanguage || 'English',
      sources: result.sources || [],
      inputType: 'url',
    }).then(analysis => {
      console.log('URL analysis saved to MongoDB');
    }).catch(err => {
      console.error('MongoDB save failed:', err.message);
    });

    res.json({ ...result, scrapedTitle: scraped.title, scrapedUrl: url });

  } catch (error) {
    console.error('URL analysis error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;