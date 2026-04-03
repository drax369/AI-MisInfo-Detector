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

const corsOptions = {
  origin: function(origin, callback) {
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT, DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

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