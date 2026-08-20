const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    turf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Turf',
      required: true,
    },

    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    playerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    phoneNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        'Pending',
        'Confirmed',
        'Cancelled',
      ],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'Booking',
  bookingSchema
);