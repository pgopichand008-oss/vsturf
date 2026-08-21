const express = require('express');
const Slot = require('../models/Slot');
const Turf = require('../models/Turf');

const { generateSlots } = require('../utils/slotGenerator');

const router = express.Router();


// ==========================================
// GET SLOTS FOR A DATE
// GET /api/slots?date=2026-08-21
// ==========================================

router.get('/', async (req, res) => {
  try {
    const { date } = req.query;

    console.log(
      'Slots requested for date:',
      date
    );


    // ========================================
    // Validate date
    // ========================================

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required.',
      });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid date format. Use YYYY-MM-DD.',
      });
    }


    // ========================================
    // Prevent past dates
    // ========================================

    const requestedDate = new Date(
      `${date}T00:00:00.000Z`
    );

    const today = new Date();

    today.setUTCHours(
      0,
      0,
      0,
      0
    );

    if (requestedDate < today) {
      return res.status(400).json({
        success: false,
        message:
          'You cannot book a date in the past.',
      });
    }


    // ========================================
    // Find Turf
    // ========================================

    const turf = await Turf.findOne({
      name: 'PGC Turf',
    });

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found.',
      });
    }


    // ========================================
    // Date Range
    // ========================================

    const startOfDay = new Date(
      `${date}T00:00:00.000Z`
    );

    const endOfDay = new Date(
      `${date}T23:59:59.999Z`
    );


    // ========================================
    // Check Existing Slots
    // ========================================

    let slots = await Slot.find({
      turf: turf._id,

      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate(
        'turf',
        'name location'
      )
      .sort({
        startTime: 1,
      });


    // ========================================
    // Generate Slots If Needed
    // ========================================

    if (slots.length === 0) {

      console.log(
        `No slots found for ${date}.`
      );

      console.log(
        'Generating slots from turf settings...'
      );


      // Generate slots using
      // MongoDB turf settings

      const generatedSlots =
        generateSlots(
          turf.openingTime,
          turf.closingTime,
          turf.basePrice
        );


      // Add database-specific fields

      const slotsToCreate =
        generatedSlots.map(
          (slot) => ({
            turf: turf._id,

            date: requestedDate,

            startTime:
              slot.startTime,

            endTime:
              slot.endTime,

            price:
              slot.price,

            status:
              slot.status,
          })
        );


      // Save all slots

      await Slot.insertMany(
        slotsToCreate
      );


      console.log(
        `Created ${slotsToCreate.length} slots for ${date}`
      );


      // Fetch newly created slots

      slots = await Slot.find({
        turf: turf._id,

        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
        .populate(
          'turf',
          'name location'
        )
        .sort({
          startTime: 1,
        });
    }


    // ========================================
    // Response
    // ========================================

    return res.status(200).json({
      success: true,

      date,

      count:
        slots.length,

      slots,
    });

  } catch (error) {

    console.error(
      'Error fetching/generating slots:',
      error
    );

    return res.status(500).json({
      success: false,

      message:
        'Failed to fetch or generate slots.',

      error:
        error.message,
    });
  }
});


module.exports = router;