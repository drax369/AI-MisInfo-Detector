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
  origin: true,
  credentials: false
}));
app.options('*', cors({
  origin: true,
  credentials: false
}));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/analyze', analyzeRoute);
app.use('/api/analyze-url', analyzeUrlRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/history', historyRoute);

app.get('/', (req, res) => {
  res.json({ message: 'AI Misinfo Detector API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});