const express = require('express');
const Turf = require('../models/Turf');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const turfs = await Turf.find();

    res.json(turfs);
  } catch (error) {
    console.error('Error fetching turfs:', error.message);

    res.status(500).json({
      message: 'Failed to fetch turfs',
    });
  }
});

module.exports = router;