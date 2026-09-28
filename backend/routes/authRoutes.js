const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 1. REGISTER NEW USER (POST /api/auth/register)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email!' });
    }

    // Create new user with 200 welcome points
    const newUser = new User({
      name,
      email,
      password,
      points: 200
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Account created successfully! 200 points credited.',
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. LOGIN USER (POST /api/auth/login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Please register first!' });
    }

    // Verify credentials
    if (user.password !== password) {
      return res.status(400).json({ success: false, message: 'Invalid password!' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: user
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 3. GET USER PROFILE BY EMAIL (GET /api/auth/user/:email)
// ==========================================
router.get('/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 4. UPDATE USER PROFILE (PUT /api/auth/user/:email)
// ==========================================
router.put('/user/:email', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true } // Return the updated document
    );
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
