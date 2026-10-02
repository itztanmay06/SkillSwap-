const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
