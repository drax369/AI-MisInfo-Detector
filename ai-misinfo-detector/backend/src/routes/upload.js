const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { extractTextFromFile } = require('../services/extractService');
const { analyzeContent, analyzeImage } = require('../services/geminiService');
const Analysis = require('../models/Analysis');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'text/markdown',
    ];
    const allowedExts = ['.pdf', '.doc', '.docx', '.xlsx', '.xls', '.pptx', '.txt', '.csv', '.md', '.rtf', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowed.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${ext}`));
    }
  },
});

// Single file upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const originalName = req.file.originalname;

    const extracted = await extractTextFromFile(filePath, mimeType, originalName);

    let result;
    let extractedText = '';

    if (extracted.isImage) {
      result = await analyzeImage(extracted.base64, extracted.mimeType);
      extractedText = '[Image analyzed visually]';
    } else {
      if (!extracted.text || extracted.text.trim().length < 10) {
        return res.status(400).json({ error: 'Could not extract text from file' });
      }
      extractedText = extracted.text.slice(0, 500);
      result = await analyzeContent(extracted.text);
    }

    // Clean up
    fs.unlinkSync(filePath);

    // Save to DB
    Analysis.create({
      content: `[${extracted.type?.toUpperCase()}] ${originalName} — ${extractedText}`.slice(0, 500),
      credibilityScore: result.credibilityScore,
      verdict: result.verdict,
      redFlags: result.redFlags,
      explanation: result.explanation,
      explanationLocal: result.explanationLocal || '',
      educationalTip: result.educationalTip,
      educationalTipLocal: result.educationalTipLocal || '',
      detectedLanguage: result.detectedLanguage || 'English',
      sources: result.sources || [],
      inputType: extracted.type || 'file',
    }).catch(err => console.error('MongoDB save failed:', err.message));

    res.json({
      ...result,
      extractedText: extractedText,
      fileName: originalName,
      fileType: extracted.type,
    });

  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Multiple images upload
router.post('/multiple', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const results = [];

    for (const file of req.files) {
      try {
        const extracted = await extractTextFromFile(file.path, file.mimetype, file.originalname);
        let result;

        if (extracted.isImage) {
          result = await analyzeImage(extracted.base64, extracted.mimeType);
        } else {
          result = await analyzeContent(extracted.text);
        }

        results.push({
          fileName: file.originalname,
          fileType: extracted.type,
          ...result,
        });

        fs.unlinkSync(file.path);
      } catch (err) {
        results.push({
          fileName: file.originalname,
          error: err.message,
        });
      }
    }

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;