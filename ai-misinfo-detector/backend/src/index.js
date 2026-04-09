const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');

const analyzeRoute = require('./routes/analyze');
const uploadRoute = require('./routes/upload');
const historyRoute = require('./routes/history');
const analyzeUrlRoute = require('./routes/analyzeUrl');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/analyze', analyzeRoute);
app.use('/api/analyze-url', analyzeUrlRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/history', historyRoute);

app.use(express.static(path.join(__dirname, '../../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Static path:', path.join(__dirname, '../../frontend/build'));
});