const mongoose = require('mongoose');

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
    default: ''
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
