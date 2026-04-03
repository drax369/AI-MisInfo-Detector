const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const analyzeRoute = require('./routes/analyze');
const uploadRoute = require('./routes/upload');
const historyRoute = require('./routes/history');
const analyzeUrlRoute = require('./routes/analyzeUrl');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://ai-misinfo-detector.vercel.app'
  ]
}));
app.use(express.json());

app.use('https://ai-misinfo-detector.onrender.com/api/analyze', analyzeRoute);
app.use('https://ai-misinfo-detector.onrender.com/api/analyze-url', analyzeUrlRoute);
app.use('https://ai-misinfo-detector.onrender.com/api/upload', uploadRoute);
app.use('https://ai-misinfo-detector.onrender.com/api/history', historyRoute);

app.get('/', (req, res) => {
  res.json({ message: 'AI Misinfo Detector API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});