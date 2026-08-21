const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const turfRoutes = require('./routes/turfRoutes');
const slotRoutes = require('./routes/slotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

const PORT = 5000;

// ==========================================
// Middleware
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// Health Check
// ==========================================

app.get('/', (req, res) => {
  res.json({
    message: 'VSTurf backend is running',
  });
});


// ==========================================
// API Routes
// ==========================================

app.use('/api/turfs', turfRoutes);

app.use('/api/slots', slotRoutes);

app.use('/api/bookings', bookingRoutes);

app.use('/api/auth', authRoutes);


// ==========================================
// Start Server
// ==========================================

async function startServer() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      'MongoDB connected successfully'
    );

    app.listen(PORT, () => {
      console.log(
        `VSTurf server running on http://localhost:${PORT}`
      );
    });

  } catch (error) {
    console.error(
      'MongoDB connection failed:',
      error.message
    );

    process.exit(1);
  }
}

startServer();