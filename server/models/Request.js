const mongoose = require('mongoose');

// ==========================================
// 📋 EXCHANGE REQUEST SCHEMA (Mongoose Model)
// ==========================================
// Jab koi user kisi dusre user se skill seekhne ki request bhejta hai,
// toh ye model us request ko store karta hai.

const requestSchema = new mongoose.Schema({
  skillTitle: {
    type: String,
    required: true
  },
  requesterName: {
    type: String,
    required: true
  },
  toUserName: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  },
  hours: {
    type: Number,
    default: 1
  },
  points: {
    type: Number,
    required: true
  },
  note: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Request', requestSchema);
