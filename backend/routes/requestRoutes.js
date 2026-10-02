const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { isMongoConnected, getFileDB, saveFileDB } = require('../db');

router.get('/', async (req, res) => {
  try {
    const { userName } = req.query;
    if (isMongoConnected()) {
      const query = userName ? { $or: [{ requesterName: userName }, { toUserName: userName }] } : {};
      const requests = await Request.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: requests.length, requests });
    }
    const db = getFileDB();
    let requests = db.requests || [];
    if (userName) {
      requests = requests.filter((r) => r.requesterName === userName || r.toUserName === userName);
    }
    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { skillTitle, requesterName, toUserName, avatar, hours, points, note, userEmail } = req.body;
    const reqData = {
      id: 'req-' + Date.now(),
      skillTitle,
      requesterName,
      toUserName,
      avatar,
      hours,
      points,
      note,
      status: 'pending',
      date: 'Just now'
    };

    if (isMongoConnected()) {
      if (userEmail) {
        const user = await User.findOne({ email: userEmail });
        if (user && user.points < points) return res.status(400).json({ success: false, message: 'Insufficient points!' });
        if (user) {
          user.points -= points;
          await user.save();
          await Transaction.create({ userEmail, type: 'debit', title: `Escrow Hold: ${skillTitle}`, points });
        }
      }
      const request = await Request.create(reqData);
      return res.status(201).json({ success: true, message: 'Request sent successfully!', request });
    }

    const db = getFileDB();
    db.requests = [reqData, ...(db.requests || [])];
    saveFileDB(db);
    res.status(201).json({ success: true, message: 'Request sent successfully!', request: reqData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id/accept', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const request = await Request.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
      if (req.body.receiverEmail) {
        await User.findOneAndUpdate({ email: req.body.receiverEmail }, { $inc: { points: request?.points || 0, completed: 1 } });
      }
      return res.json({ success: true, message: 'Request accepted!', request });
    }

    const db = getFileDB();
    const reqItem = (db.requests || []).find((r) => r.id === req.params.id);
    if (reqItem) reqItem.status = 'accepted';
    saveFileDB(db);
    res.json({ success: true, message: 'Request accepted!', request: reqItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id/reject', async (req, res) => {
  try {
    if (isMongoConnected()) {
      const request = await Request.findByIdAndUpdate(req.params.id, { status: 'declined' }, { new: true });
      if (req.body.requesterEmail) {
        await User.findOneAndUpdate({ email: req.body.requesterEmail }, { $inc: { points: request?.points || 0 } });
      }
      return res.json({ success: true, message: 'Request declined and points refunded.', request });
    }

    const db = getFileDB();
    const reqItem = (db.requests || []).find((r) => r.id === req.params.id);
    if (reqItem) reqItem.status = 'declined';
    saveFileDB(db);
    res.json({ success: true, message: 'Request declined and points refunded.', request: reqItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
