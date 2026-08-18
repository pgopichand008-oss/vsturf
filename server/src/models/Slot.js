const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    turf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Turf',
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['Available', 'Booked'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;