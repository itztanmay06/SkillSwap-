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

// ==========================================
// 🛠️ MIDDLEWARES
// ==========================================
// Allow Cross-Origin Requests from React frontend (http://localhost:5173)
app.use(cors());
// Parse incoming JSON request bodies
app.use(express.json());

// ==========================================
// 🛣️ API ROUTES
// ==========================================
// 1. Auth routes (Register, Login, Profile)
app.use('/api/auth', require('./routes/authRoutes'));

// 2. Skill routes (Explore, Search, Add Skills)
app.use('/api/skills', require('./routes/skillRoutes'));

// 3. Request routes (Send exchange request, Accept, Decline)
app.use('/api/requests', require('./routes/requestRoutes'));

// 4. Wallet routes (Transactions, Balance, Point top-up)
app.use('/api/wallet', require('./routes/walletRoutes'));

// Test Root Route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 SkillSwap MERN Stack API is running successfully!',
    endpoints: {
      auth: '/api/auth',
      skills: '/api/skills',
      requests: '/api/requests',
      wallet: '/api/wallet'
    }
  });
});

// ==========================================
// 💾 DATABASE CONNECTION & SERVER START
// ==========================================
console.log('Connecting to database...');

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2500 })
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 SkillSwap Server is listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection warning:', err.message);
    console.warn('👉 To connect MongoDB Atlas: Add your MONGO_URI string inside server/.env');
    app.listen(PORT, () => {
      console.log(`🚀 SkillSwap Server is listening on http://localhost:${PORT}`);
    });
  });
