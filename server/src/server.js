const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const turfRoutes = require('./routes/turfRoutes');

const app = express();

const PORT = 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'VSTurf backend is running',
  });
});

app.use('/api/turfs', turfRoutes);

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(
        `VSTurf server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
}

startServer();