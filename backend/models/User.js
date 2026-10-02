const mongoose = require('mongoose');

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
    default: ''
  },
  location: {
    type: String,
    default: 'India'
  },
  points: {
    type: Number,
    default: 200 
  },
  rating: {
    type: Number,
    default: 0.0
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
  },
  joinedDate: {
    type: String,
    default: 'Sept 2026'
  }
});

module.exports = mongoose.model('User', userSchema);
