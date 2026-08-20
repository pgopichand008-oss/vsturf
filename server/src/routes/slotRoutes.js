const express = require('express');
const Slot = require('../models/Slot');

const router = express.Router();

// Get all slots
router.get('/', async (req, res) => {
  try {
    const slots = await Slot.find()
      .populate('turf', 'name location')
      .sort({ date: 1 });

    res.json(slots);
  } catch (error) {
    console.error('Error fetching slots:', error.message);

    res.status(500).json({
      message: 'Failed to fetch slots',
    });
  }
});

module.exports = router;