const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');

// ==========================================
// 1. GET ALL SKILLS (GET /api/skills)
// ==========================================
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Filter by category agar provide kiya gaya ho
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search query match
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skills = await Skill.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: skills.length, skills });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 2. ADD NEW SKILL (POST /api/skills)
// ==========================================
router.post('/', async (req, res) => {
  try {
    const { title, category, description, pointsPerHour, user } = req.body;

    const newSkill = new Skill({
      title,
      category,
      description,
      pointsPerHour,
      user
    });

    const savedSkill = await newSkill.save();
    res.status(201).json({ success: true, message: 'Skill published successfully!', skill: savedSkill });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// 3. GET SINGLE SKILL (GET /api/skills/:id)
// ==========================================
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    res.status(200).json({ success: true, skill });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
