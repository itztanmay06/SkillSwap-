const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswap';

// Middleware configuration
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));

// Health check root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SkillSwap MERN Stack API is running successfully!',
    endpoints: {
      auth: '/api/auth',
      skills: '/api/skills',
      requests: '/api/requests',
      wallet: '/api/wallet'
    }
  });
});

const { connectDB } = require('./db');

// Connect Database & Start Server
connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`SkillSwap Server is running on http://localhost:${PORT}`);
  });
});
