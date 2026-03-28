const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
};

module.exports = connectDB;