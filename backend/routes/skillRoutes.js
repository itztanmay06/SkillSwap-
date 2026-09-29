const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const { isMongoConnected, getFileDB, saveFileDB } = require('../db');

// 1. GET ALL SKILLS (GET /api/skills)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    let skills = [];
    if (isMongoConnected()) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      skills = await Skill.find(query).sort({ createdAt: -1 });
    }

    // Fallback or read from db.json
    if (!skills || skills.length === 0) {
      skills = getFileDB().skills || [];
      if (category && category !== 'All') {
        skills = skills.filter((s) => s.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        skills = skills.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            (s.user && s.user.name.toLowerCase().includes(q))
        );
      }
    }

    res.status(200).json({ success: true, count: skills.length, skills });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. ADD NEW SKILL (POST /api/skills)
router.post('/', async (req, res) => {
  try {
    const { title, category, description, pointsPerHour, availability, user } = req.body;

    const skillData = {
      id: 's-' + Date.now(),
      title,
      category: category || 'Programming',
      description: description || `Learn ${title} with ${user?.name || 'Peer'}.`,
      pointsPerHour: pointsPerHour || 40,
      availability: availability || '',
      rating: 5.0,
      reviewsCount: 1,
      user: {
        name: user?.name || 'Anonymous',
        title: user?.title || 'Skill Explorer',
        avatar: user?.avatar || '',
        rating: 5.0,
        location: user?.location || 'India'
      }
    };

    if (isMongoConnected()) {
      try {
        const newSkill = new Skill(skillData);
        await newSkill.save();
      } catch (e) {}
    }

    // Always record to db.js / db.json
    const db = getFileDB();
    db.skills = [skillData, ...db.skills];
    saveFileDB(db);

    res.status(201).json({ success: true, message: 'Skill published successfully!', skill: skillData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. GET SINGLE SKILL (GET /api/skills/:id)
router.get('/:id', async (req, res) => {
  try {
    let skill = null;
    if (isMongoConnected()) skill = await Skill.findById(req.params.id);
    if (!skill) skill = getFileDB().skills.find((s) => s.id === req.params.id || s._id === req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
    res.status(200).json({ success: true, skill });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
