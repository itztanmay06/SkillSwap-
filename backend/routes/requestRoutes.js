const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// 1. GET ALL REQUESTS (GET /api/requests)
router.get('/', async (req, res) => {
  try {
    const { userName } = req.query;
    const query = userName ? { $or: [{ requesterName: userName }, { toUserName: userName }] } : {};
    const requests = await Request.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. CREATE NEW REQUEST (POST /api/requests)
router.post('/', async (req, res) => {
  try {
    const { skillTitle, requesterName, toUserName, avatar, hours, points, note, userEmail } = req.body;
    if (userEmail) {
      const user = await User.findOne({ email: userEmail });
      if (user && user.points < points) return res.status(400).json({ success: false, message: 'Insufficient points!' });
      if (user) {
        user.points -= points;
        await user.save();
        await Transaction.create({ userEmail, type: 'debit', title: `Escrow Hold: ${skillTitle}`, points });
      }
    }
    const request = await Request.create({ skillTitle, requesterName, toUserName, avatar, hours, points, note, status: 'pending' });
    res.status(201).json({ success: true, message: 'Request sent successfully!', request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. ACCEPT REQUEST (PUT /api/requests/:id/accept)
router.put('/:id/accept', async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (req.body.receiverEmail) {
      await User.findOneAndUpdate({ email: req.body.receiverEmail }, { $inc: { points: request.points, completed: 1 } });
      await Transaction.create({ userEmail: req.body.receiverEmail, type: 'credit', title: `Points Earned: ${request.skillTitle}`, points: request.points });
    }
    res.json({ success: true, message: 'Request accepted!', request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. REJECT REQUEST (PUT /api/requests/:id/reject)
router.put('/:id/reject', async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(req.params.id, { status: 'declined' }, { new: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (req.body.requesterEmail) {
      await User.findOneAndUpdate({ email: req.body.requesterEmail }, { $inc: { points: request.points } });
      await Transaction.create({ userEmail: req.body.requesterEmail, type: 'credit', title: `Refund: ${request.skillTitle}`, points: request.points });
    }
    res.json({ success: true, message: 'Request declined and points refunded.', request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
