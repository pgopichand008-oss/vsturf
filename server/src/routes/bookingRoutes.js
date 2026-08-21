
const express = require('express');
const mongoose = require('mongoose');

const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

const router = express.Router();


// ==========================================
// CREATE BOOKING
// ==========================================

router.post('/', async (req, res) => {
  try {
    console.log('POST /api/bookings received');

    const {
      turf,
      slot,
      bookingDate,
      playerName,
      phoneNumber,
    } = req.body;


    // ------------------------------
    // Validate required fields
    // ------------------------------

    if (
      !turf ||
      !slot ||
      !bookingDate ||
      !playerName ||
      !phoneNumber
    ) {
      return res.status(400).json({
        success: false,
        message: 'All booking fields are required.',
      });
    }


    // ------------------------------
    // Validate MongoDB IDs
    // ------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(turf) ||
      !mongoose.Types.ObjectId.isValid(slot)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid turf or slot ID.',
      });
    }


    // ------------------------------
    // Validate phone number
    // ------------------------------

    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 10-digit phone number.',
      });
    }


    // ------------------------------
    // Find slot
    // ------------------------------

    const selectedSlot = await Slot.findById(slot);

    if (!selectedSlot) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found.',
      });
    }


    // ------------------------------
    // Check slot status
    // ------------------------------

    if (selectedSlot.status === 'Booked') {
      return res.status(409).json({
        success: false,
        message: 'This slot is already booked.',
      });
    }


    // ------------------------------
    // Check turf
    // ------------------------------

    if (selectedSlot.turf.toString() !== turf) {
      return res.status(400).json({
        success: false,
        message: 'Selected slot does not belong to this turf.',
      });
    }


    // ------------------------------
    // Create booking
    // ------------------------------

    const booking = await Booking.create({
      turf,
      slot,
      bookingDate,
      playerName: playerName.trim(),
      phoneNumber,
      amount: selectedSlot.price,
      status: 'Confirmed',
    });


    // ------------------------------
    // Mark slot as booked
    // ------------------------------

    selectedSlot.status = 'Booked';

    await selectedSlot.save();


    // ------------------------------
    // Return complete booking
    // ------------------------------

    const populatedBooking =
      await Booking.findById(booking._id)
        .populate('turf', 'name location')
        .populate(
          'slot',
          'startTime endTime price status'
        );


    console.log(
      'Booking created:',
      booking._id.toString()
    );


    return res.status(201).json({
      success: true,
      message: 'Booking created successfully.',
      booking: populatedBooking,
    });


  } catch (error) {

    console.error(
      'Booking creation error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to create booking.',
    });
  }
});


// ==========================================
// GET ALL BOOKINGS
// ==========================================

router.get('/', async (req, res) => {
  try {

    console.log('GET /api/bookings received');


    const bookings = await Booking.find()
      .populate(
        'turf',
        'name location'
      )
      .populate(
        'slot',
        'startTime endTime price status'
      )
      .sort({
        createdAt: -1,
      });


    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });


  } catch (error) {

    console.error(
      'Fetch bookings error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings.',
    });
  }
});


module.exports = router;

