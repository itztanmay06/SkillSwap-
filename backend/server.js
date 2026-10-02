const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswap';

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/wallet', require('./routes/walletRoutes'));

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

connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`SkillSwap Server is running on http://localhost:${PORT}`);
  });
});
