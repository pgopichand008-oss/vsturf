const mongoose = require('mongoose');
require('dotenv').config();

const Turf = require('./models/Turf');

const turfData = {
  name: 'PGC Turf',
  location: 'Guntur',
  openingTime: '06:00 AM',
  closingTime: '10:00 PM',
  basePrice: 800,
  description:
    'Professional cricket turf with LED floodlights and quality playing surface.',
};

async function seedTurf() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected');

    const existingTurf = await Turf.findOne({
      name: turfData.name,
    });

    if (existingTurf) {
      console.log('Turf already exists');
    } else {
      const turf = await Turf.create(turfData);

      console.log('Turf created successfully');
      console.log(turf);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedTurf();