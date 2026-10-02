const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Skill = require('../models/Skill');
const { isMongoConnected, getFileDB, saveFileDB } = require('../db');

// 1. REGISTER NEW USER (POST /api/auth/register)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, skillTitle, category } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    // Check if user already exists
    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) return res.status(400).json({ success: false, message: 'User already exists with this email!' });
    } else {
      const db = getFileDB();
      if (db.users.some((u) => u.email === cleanEmail)) {
        return res.status(400).json({ success: false, message: 'User already exists with this email!' });
      }
    }

    // User profile object
    const skillsOffered = skillTitle ? [skillTitle.trim()] : ['Web Development'];
    const userData = {
      name: name.trim(),
      email: cleanEmail,
      password,
      points: 200,
      skillsOffered,
      skillsWanted: [],
      title: `${name.trim()} • Skill Explorer`,
      location: 'India',
      rating: 0.0,
      reviewCount: 0,
      joinedDate: 'Sept 2026'
    };

    let savedUser = userData;
    if (isMongoConnected()) {
      const newUser = new User(userData);
      savedUser = await newUser.save();
    }

    // Auto-create Skill Card for Explore Skills Tab
    const offerTitle = skillTitle ? skillTitle.trim() : 'Web Development & Problem Solving';
    const skillCategory = category || 'Programming';
    const skillCard = {
      id: 's-' + Date.now(),
      title: offerTitle,
      category: skillCategory,
      description: `Learn ${offerTitle} with ${name.trim()}. One-on-one peer learning session.`,
      pointsPerHour: 40,
      rating: 5.0,
      reviewsCount: 1,
      user: {
        name: name.trim(),
        title: `${name.trim()} • Skill Explorer`,
        location: 'India',
        rating: 5.0
      }
    };

    if (isMongoConnected()) {
      try {
        const newSkill = new Skill(skillCard);
        await newSkill.save();
      } catch (err) {}
    }

    // Always record to db.js / db.json
    const db = getFileDB();
    db.users = [userData, ...db.users.filter((u) => u.email !== cleanEmail)];
    db.skills = [skillCard, ...db.skills];
    saveFileDB(db);

    res.status(201).json({
      success: true,
      message: 'Account created! Skill card recorded in database.',
      user: savedUser,
      skill: skillCard
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. LOGIN USER (POST /api/auth/login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    let user = null;
    if (isMongoConnected()) {
      user = await User.findOne({ email: cleanEmail });
    }
    if (!user) {
      const db = getFileDB();
      user = db.users.find((u) => u.email === cleanEmail);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Please register first!' });
    }
    if (user.password !== password) {
      return res.status(400).json({ success: false, message: 'Invalid password!' });
    }

    res.status(200).json({ success: true, message: 'Login successful!', user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. GET USER PROFILE (GET /api/auth/user/:email)
router.get('/user/:email', async (req, res) => {
  try {
    const cleanEmail = req.params.email.toLowerCase();
    let user = null;
    if (isMongoConnected()) user = await User.findOne({ email: cleanEmail });
    if (!user) user = getFileDB().users.find((u) => u.email === cleanEmail);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. UPDATE USER PROFILE (PUT /api/auth/user/:email)
router.put('/user/:email', async (req, res) => {
  try {
    const cleanEmail = req.params.email.toLowerCase();
    let updatedUser = null;
    if (isMongoConnected()) {
      updatedUser = await User.findOneAndUpdate({ email: cleanEmail }, req.body, { new: true });
    }
    const db = getFileDB();
    const idx = db.users.findIndex((u) => u.email === cleanEmail);
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...req.body };
      saveFileDB(db);
      if (!updatedUser) updatedUser = db.users[idx];
    }
    res.status(200).json({ success: true, user: updatedUser || req.body });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
