const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// 1. GET ALL REQUESTS (GET /api/requests)
router.get('/', async (req, res) => {
  try {
    const { userName } = req.query;
    let query = {};

    // If userName is provided, fetch both sent and received requests
    if (userName) {
      query.$or = [
        { requesterName: userName },
        { toUserName: userName }
      ];
    }

    const requests = await Request.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. CREATE NEW REQUEST (POST /api/requests)
router.post('/', async (req, res) => {
  try {
    const { skillTitle, requesterName, toUserName, avatar, hours, points, note, userEmail } = req.body;

    // Check user points balance if userEmail provided
    if (userEmail) {
      const user = await User.findOne({ email: userEmail });
      if (user && user.points < points) {
        return res.status(400).json({ success: false, message: 'Insufficient Skill Points balance!' });
      }

      // Deduct points from requester
      if (user) {
        user.points -= points;
        await user.save();

        // Record debit transaction
        await Transaction.create({
          userEmail,
          type: 'debit',
          title: `Escrow Hold: Request for ${skillTitle}`,
          points: points
        });
      }
    }

    const newRequest = new Request({
      skillTitle,
      requesterName,
      toUserName,
      avatar,
      hours,
      points,
      note,
      status: 'pending'
    });

    const savedRequest = await newRequest.save();
    res.status(201).json({ success: true, message: 'Request sent successfully!', request: savedRequest });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. ACCEPT REQUEST (PUT /api/requests/:id/accept)
router.put('/:id/accept', async (req, res) => {
  try {
    const { receiverEmail } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.status = 'accepted';
    await request.save();

    // Credit points to provider if email available
    if (receiverEmail) {
      const receiver = await User.findOne({ email: receiverEmail });
      if (receiver) {
        receiver.points += request.points;
        receiver.completed = (receiver.completed || 0) + 1;
        await receiver.save();

        // Record credit transaction
        await Transaction.create({
          userEmail: receiverEmail,
          type: 'credit',
          title: `Points Earned: Completed session for ${request.skillTitle}`,
          points: request.points
        });
      }
    }

    res.status(200).json({ success: true, message: 'Request accepted!', request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. REJECT REQUEST (PUT /api/requests/:id/reject)
router.put('/:id/reject', async (req, res) => {
  try {
    const { requesterEmail } = req.body;

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.status = 'declined';
    await request.save();

    // Refund points back to requester
    if (requesterEmail) {
      const requester = await User.findOne({ email: requesterEmail });
      if (requester) {
        requester.points += request.points;
        await requester.save();

        await Transaction.create({
          userEmail: requesterEmail,
          type: 'credit',
          title: `Refund: Declined request for ${request.skillTitle}`,
          points: request.points
        });
      }
    }

    res.status(200).json({ success: true, message: 'Request declined and points refunded.', request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
