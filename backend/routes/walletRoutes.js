const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');

router.get('/transactions/:email', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/add-points', async (req, res) => {
  try {
    const { email, points, title } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.points += Number(points);
    await user.save();

    const transaction = await Transaction.create({
      userEmail: email,
      type: 'credit',
      title: title || 'Points Added to Wallet',
      points: Number(points)
    });

    res.status(200).json({
      success: true,
      message: `${points} points added successfully!`,
      currentPoints: user.points,
      transaction
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
