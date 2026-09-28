const mongoose = require('mongoose');

/**
 * Skill Schema
 * Represents skill offerings listed by platform users.
 */

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Programming', 'Design', 'Music', 'Marketing', 'Languages', 'Other'],
    default: 'Other'
  },
  description: {
    type: String,
    required: true
  },
  pointsPerHour: {
    type: Number,
    required: true,
    default: 50
  },
  availability: {
    type: String,
    default: ''
  },
  user: {
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    rating: { type: Number, default: 5.0 },
    location: { type: String, default: 'India' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Skill', skillSchema);
