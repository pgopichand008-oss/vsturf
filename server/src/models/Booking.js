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
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
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
      default: 'Confirmed',
    },
  },

  {
    timestamps: true,
  }
);


// ==========================================
// Prevent duplicate active bookings
// for the same slot
// ==========================================

bookingSchema.index(
  {
    slot: 1,
    status: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: {
        $in: [
          'Pending',
          'Confirmed',
        ],
      },
    },
  }
);


module.exports =
  mongoose.model(
    'Booking',
    bookingSchema
  );