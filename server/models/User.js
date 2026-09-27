const mongoose = require('mongoose');

// ==========================================
// 👤 USER SCHEMA (Mongoose Model)
// ==========================================
// Yeh schema SkillSwap ke users ki details store karta hai:
// Name, Email, Password, Points Wallet, and Ratings.

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Student & Skill Explorer'
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  },
  location: {
    type: String,
    default: 'India'
  },
  points: {
    type: Number,
    default: 200 // Har naye user ko 200 free signup points milte hain
  },
  rating: {
    type: Number,
    default: 5.0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  skillsOffered: {
    type: [String],
    default: []
  },
  skillsWanted: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
