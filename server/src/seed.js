const mongoose = require('mongoose');
require('dotenv').config();

const Turf = require('./models/Turf');
const Slot = require('./models/Slot');

const turfData = {
  name: 'PGC Turf',
  location: 'Guntur',
  openingTime: '06:00 AM',
  closingTime: '10:00 PM',
  basePrice: 800,
  description:
    'Professional cricket turf with LED floodlights and quality playing surface.',
};

const slotData = [
  {
    startTime: '06:00 AM',
    endTime: '07:00 AM',
    price: 800,
    status: 'Available',
  },
  {
    startTime: '07:00 AM',
    endTime: '08:00 AM',
    price: 800,
    status: 'Booked',
  },
  {
    startTime: '05:00 PM',
    endTime: '06:00 PM',
    price: 1200,
    status: 'Available',
  },
  {
    startTime: '07:00 PM',
    endTime: '08:00 PM',
    price: 1200,
    status: 'Available',
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected');

    // Find existing turf
    let turf = await Turf.findOne({
      name: turfData.name,
    });

    // Create turf if it doesn't exist
    if (turf) {
      console.log('Turf already exists');
    } else {
      turf = await Turf.create(turfData);

      console.log('Turf created successfully');
    }

    // Check whether slots already exist
    const existingSlots = await Slot.countDocuments({
      turf: turf._id,
    });

    if (existingSlots > 0) {
      console.log('Slots already exist');
    } else {
      const slots = slotData.map((slot) => ({
        ...slot,
        turf: turf._id,
        date: new Date(),
      }));

      await Slot.insertMany(slots);

      console.log('Slots created successfully');
      console.log(`${slots.length} slots added`);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

seedDatabase();