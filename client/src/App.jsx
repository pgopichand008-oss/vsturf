import { useEffect, useState } from 'react';
import './App.css';
import SlotCard from './components/SlotCard';

const API_URL = 'http://localhost:5000';

function App() {
  const [showSlots, setShowSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [bookingDate, setBookingDate] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formError, setFormError] = useState('');

  const [turf, setTurf] = useState(null);
  const [turfLoading, setTurfLoading] = useState(true);
  const [turfError, setTurfError] = useState('');

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState('');

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // ==========================================
  // Fetch Turf
  // ==========================================

  useEffect(() => {
    async function fetchTurf() {
      try {
        setTurfLoading(true);
        setTurfError('');

        const response = await fetch(
          `${API_URL}/api/turfs`
        );

        if (!response.ok) {
          throw new Error(
            'Failed to fetch turf information.'
          );
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error(
            'No turf information found.'
          );
        }

        setTurf(data[0]);
      } catch (error) {
        console.error(
          'Error fetching turf:',
          error
        );

        setTurfError(
          'Unable to load turf information. Please try again.'
        );
      } finally {
        setTurfLoading(false);
      }
    }

    fetchTurf();
  }, []);

  // ==========================================
  // Fetch Slots For Selected Date
  // ==========================================

  useEffect(() => {
    if (!bookingDate) {
      setSlots([]);
      return;
    }

    async function fetchSlots() {
      try {
        setSlotsLoading(true);
        setSlotsError('');
        setSelectedSlot(null);

        const response = await fetch(
          `${API_URL}/api/slots?date=${bookingDate}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Failed to fetch slots.'
          );
        }

        /*
          Our new API returns:

          {
            success: true,
            date: "...",
            count: 4,
            slots: [...]
          }
        */

        setSlots(data.slots || []);
      } catch (error) {
        console.error(
          'Error fetching slots:',
          error
        );

        setSlotsError(
          error.message ||
            'Unable to load slots.'
        );

        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    }

    fetchSlots();
  }, [bookingDate]);

  // ==========================================
  // Open Booking Form
  // ==========================================

  function handleReserve(slot) {
    if (slot.status === 'Booked') {
      return;
    }

    setSelectedSlot(slot);
    setShowConfirmation(false);
    setFormError('');
    setBookingError('');
    setBookingSuccess(false);
  }

  // ==========================================
  // Close Booking
  // ==========================================

  function handleCloseBooking() {
    setSelectedSlot(null);
    setShowConfirmation(false);
    setFormError('');
    setBookingError('');
    setBookingSuccess(false);
  }

  // ==========================================
  // Continue To Confirmation
  // ==========================================

  function handleContinue() {
    setFormError('');

    if (!bookingDate) {
      setFormError(
        'Please select a booking date.'
      );
      return;
    }

    if (!selectedSlot) {
      setFormError(
        'Please select a time slot.'
      );
      return;
    }

    if (!playerName.trim()) {
      setFormError(
        'Please enter your player or team name.'
      );
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setFormError(
        'Please enter a valid 10-digit phone number.'
      );
      return;
    }

    setShowConfirmation(true);
  }

  // ==========================================
  // Edit Booking
  // ==========================================

  function handleEditBooking() {
    setShowConfirmation(false);
    setBookingError('');
  }

  // ==========================================
  // Confirm Booking
  // ==========================================

  async function handleConfirmBooking() {
    if (!selectedSlot || !turf) {
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError('');

      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            turf: turf._id,
            slot: selectedSlot._id,
            bookingDate,
            playerName: playerName.trim(),
            phoneNumber,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to create booking.'
        );
      }

      console.log(
        'Booking created successfully:',
        data.booking
      );

      setBookingSuccess(true);

      // Update current slot immediately
      setSlots((currentSlots) =>
        currentSlots.map((slot) =>
          slot._id === selectedSlot._id
            ? {
                ...slot,
                status: 'Booked',
              }
            : slot
        )
      );

      setSelectedSlot((currentSlot) =>
        currentSlot
          ? {
              ...currentSlot,
              status: 'Booked',
            }
          : null
      );
    } catch (error) {
      console.error(
        'Booking error:',
        error
      );

      setBookingError(
        error.message ||
          'Something went wrong while creating the booking.'
      );
    } finally {
      setBookingLoading(false);
    }
  }

  // ==========================================
  // Loading Screen
  // ==========================================

  if (turfLoading) {
    return (
      <div className="app-container">
        <div className="loading-message">
          Loading PGC Turf...
        </div>
      </div>
    );
  }

  // ==========================================
  // Turf Error
  // ==========================================

  if (turfError) {
    return (
      <div className="app-container">
        <div className="error-message">
          {turfError}
        </div>
      </div>
    );
  }

  // ==========================================
  // Main Application
  // ==========================================

  return (
    <div className="app-container">

      {/* ======================================
          Navigation
      ====================================== */}

      <header className="navbar">

        <div className="logo">
          <h2>
            🏏 <span>PGC</span>TURF🏏
          </h2>
        </div>

        <nav className="nav-links">

          <a href="#home">
            Home
          </a>

          <a
            href="#slots"
            onClick={() => {
              setShowSlots(true);
            }}
          >
            Book a Turf
          </a>

          <a href="#info">
            Info
          </a>

        </nav>

      </header>


      <main>

        {/* ======================================
            Hero Section
        ====================================== */}

        <section
          className="hero-section"
          id="home"
        >

          <span className="tagline-badge">
            PREMIUM CRICKET ARENA
          </span>

          <h1>
            Play. Book. Enjoy.
          </h1>

          <p>
            {turf.description}
          </p>

          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              setShowSlots(!showSlots);
            }}
          >
            {showSlots
              ? 'Close Booking'
              : 'Check Available Slots'}
          </button>

        </section>


        {/* ======================================
            Turf Information
        ====================================== */}

        <section
          className="info-grid"
          id="info"
        >

          <div className="info-card">

            <span className="icon">
              📍
            </span>

            <div>
              <h4>
                Location
              </h4>

              <p>
                {turf.location}
              </p>
            </div>

          </div>


          <div className="info-card">

            <span className="icon">
              ⏰
            </span>

            <div>
              <h4>
                Operating Hours
              </h4>

              <p>
                {turf.openingTime} –{' '}
                {turf.closingTime}
              </p>
            </div>

          </div>


          <div className="info-card">

            <span className="icon">
              💰
            </span>

            <div>
              <h4>
                Pricing
              </h4>

              <p>
                Starting at ₹
                {turf.basePrice} / hour
              </p>
            </div>

          </div>


          <div className="info-card">

            <span className="icon">
              🏏
            </span>

            <div>
              <h4>
                Turf
              </h4>

              <p>
                {turf.name}
              </p>
            </div>

          </div>

        </section>


        {/* ======================================
            Booking Section
        ====================================== */}

        {showSlots && (

          <section
            className="slots-section"
            id="slots"
          >

            <div className="section-heading">

              <span className="section-label">
                BOOK YOUR SESSION
              </span>

              <h3>
                Choose Your Date
              </h3>

              <p>
                Select a date to see the available
                time slots.
              </p>

            </div>


            {/* ==================================
                Date Selector
            ================================== */}

            <div className="booking-form">

              <div className="form-group">

                <label htmlFor="booking-date">
                  Select Date
                </label>

                <input
                  id="booking-date"
                  type="date"
                  value={bookingDate}
                  min={
                    new Date()
                      .toISOString()
                      .split('T')[0]
                  }
                  onChange={(event) => {
                    setBookingDate(
                      event.target.value
                    );

                    setSelectedSlot(null);
                    setShowConfirmation(false);
                    setFormError('');
                    setBookingError('');
                  }}
                />

              </div>

            </div>


            {/* ==================================
                Loading Slots
            ================================== */}

            {bookingDate &&
              slotsLoading && (

                <div className="loading-message">
                  Loading available slots...
                </div>

              )}


            {/* ==================================
                Slot Error
            ================================== */}

            {bookingDate &&
              slotsError && (

                <div className="error-message">
                  {slotsError}
                </div>

              )}


            {/* ==================================
                No Slots
            ================================== */}

            {bookingDate &&
              !slotsLoading &&
              !slotsError &&
              slots.length === 0 && (

                <div className="error-message">

                  No slots are available for this
                  date yet.

                </div>

              )}


            {/* ==================================
                Slot List
            ================================== */}

            {bookingDate &&
              !slotsLoading &&
              !slotsError &&
              slots.length > 0 && (

                <>

                  <div className="section-heading">

                    <span className="section-label">
                      AVAILABLE SESSIONS
                    </span>

                    <h3>
                      Choose Your Time
                    </h3>

                  </div>


                  <div className="slots-grid">

                    {slots.map((slot) => (

                      <SlotCard
                        key={slot._id}
                        time={`${slot.startTime} - ${slot.endTime}`}
                        status={slot.status}
                        price={`₹${slot.price}`}
                        onReserve={() =>
                          handleReserve(slot)
                        }
                      />

                    ))}

                  </div>

                </>

              )}


            {/* ==================================
                STEP 1 — Booking Form
            ================================== */}

            {selectedSlot &&
              !showConfirmation && (

                <section className="booking-panel">

                  <div className="booking-header">

                    <div>

                      <span className="booking-label">
                        STEP 1 OF 2
                      </span>

                      <h3>
                        Complete Your Booking
                      </h3>

                    </div>

                    <button
                      type="button"
                      className="close-booking-btn"
                      onClick={
                        handleCloseBooking
                      }
                      aria-label="Close booking panel"
                    >
                      ×
                    </button>

                  </div>


                  {/* Booking Summary */}

                  <div className="booking-summary">

                    <div className="booking-detail">

                      <span>
                        📅
                      </span>

                      <div>

                        <small>
                          Date
                        </small>

                        <strong>
                          {bookingDate}
                        </strong>

                      </div>

                    </div>


                    <div className="booking-detail">

                      <span>
                        ⏰
                      </span>

                      <div>

                        <small>
                          Time
                        </small>

                        <strong>
                          {selectedSlot.startTime}
                          {' - '}
                          {selectedSlot.endTime}
                        </strong>

                      </div>

                    </div>


                    <div className="booking-detail">

                      <span>
                        💰
                      </span>

                      <div>

                        <small>
                          Price
                        </small>

                        <strong>
                          ₹{selectedSlot.price}
                          {' / hour'}
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* Customer Information */}

                  <div className="booking-form">

                    <div className="form-group">

                      <label htmlFor="player-name">
                        Player / Team Name
                      </label>

                      <input
                        id="player-name"
                        type="text"
                        value={playerName}
                        placeholder="Enter your name or team"
                        onChange={(event) => {

                          setPlayerName(
                            event.target.value
                          );

                          setFormError('');
                        }}
                      />

                    </div>


                    <div className="form-group">

                      <label htmlFor="phone-number">
                        Contact Number
                      </label>

                      <input
                        id="phone-number"
                        type="tel"
                        value={phoneNumber}
                        placeholder="10-digit mobile number"
                        maxLength="10"
                        onChange={(event) => {

                          const value =
                            event.target.value.replace(
                              /\D/g,
                              ''
                            );

                          setPhoneNumber(value);

                          setFormError('');
                        }}
                      />

                    </div>

                  </div>


                  {/* Validation Error */}

                  {formError && (

                    <p className="form-error">
                      ⚠ {formError}
                    </p>

                  )}


                  {/* Footer */}

                  <div className="booking-footer">

                    <div className="total-price">

                      <span>
                        Total
                      </span>

                      <strong>
                        ₹{selectedSlot.price}
                      </strong>

                    </div>


                    <button
                      type="button"
                      className="confirm-booking-btn"
                      onClick={handleContinue}
                    >
                      Continue to Confirmation
                    </button>

                  </div>

                </section>

              )}


            {/* ==================================
                STEP 2 — Confirmation
            ================================== */}

            {selectedSlot &&
              showConfirmation && (

                <section
                  className="booking-panel confirmation-panel"
                >

                  <div className="booking-header">

                    <div>

                      <span className="booking-label">
                        STEP 2 OF 2
                      </span>

                      <h3>
                        Review Your Booking
                      </h3>

                    </div>

                    <button
                      type="button"
                      className="close-booking-btn"
                      onClick={
                        handleCloseBooking
                      }
                      aria-label="Close booking panel"
                    >
                      ×
                    </button>

                  </div>


                  {/* Successful Booking */}

                  {bookingSuccess ? (

                    <>

                      <div className="confirmation-success">

                        <div className="success-icon">
                          ✓
                        </div>

                        <div>

                          <h4>
                            Booking Confirmed!
                          </h4>

                          <p>
                            Your turf session has
                            been successfully booked.
                          </p>

                        </div>

                      </div>


                      <div className="confirmation-details">

                        <div>

                          <span>
                            Booking Date
                          </span>

                          <strong>
                            {bookingDate}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Time Slot
                          </span>

                          <strong>
                            {selectedSlot.startTime}
                            {' - '}
                            {selectedSlot.endTime}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Player / Team
                          </span>

                          <strong>
                            {playerName}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Contact Number
                          </span>

                          <strong>
                            {phoneNumber}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Total Amount
                          </span>

                          <strong>
                            ₹{selectedSlot.price}
                          </strong>

                        </div>

                      </div>


                      <div className="booking-footer">

                        <button
                          type="button"
                          className="confirm-booking-btn"
                          onClick={
                            handleCloseBooking
                          }
                        >
                          Done
                        </button>

                      </div>

                    </>

                  ) : (

                    <>

                      <div className="confirmation-success">

                        <div className="success-icon">
                          ✓
                        </div>

                        <div>

                          <h4>
                            Everything looks good!
                          </h4>

                          <p>
                            Review your booking
                            details before
                            confirming.
                          </p>

                        </div>

                      </div>


                      <div className="confirmation-details">

                        <div>

                          <span>
                            Booking Date
                          </span>

                          <strong>
                            {bookingDate}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Time Slot
                          </span>

                          <strong>
                            {selectedSlot.startTime}
                            {' - '}
                            {selectedSlot.endTime}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Player / Team
                          </span>

                          <strong>
                            {playerName}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Contact Number
                          </span>

                          <strong>
                            {phoneNumber}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Total Amount
                          </span>

                          <strong>
                            ₹{selectedSlot.price}
                          </strong>

                        </div>

                      </div>


                      {/* Booking Error */}

                      {bookingError && (

                        <p className="form-error">
                          ⚠ {bookingError}
                        </p>

                      )}


                      {/* Confirmation Buttons */}

                      <div className="booking-footer">

                        <button
                          type="button"
                          className="edit-booking-btn"
                          onClick={
                            handleEditBooking
                          }
                          disabled={bookingLoading}
                        >
                          ← Edit Booking
                        </button>


                        <button
                          type="button"
                          className="confirm-booking-btn"
                          onClick={
                            handleConfirmBooking
                          }
                          disabled={bookingLoading}
                        >
                          {bookingLoading
                            ? 'Confirming...'
                            : 'Confirm Booking'}
                        </button>

                      </div>

                    </>

                  )}

                </section>

              )}

          </section>

        )}

      </main>


      {/* ======================================
          Footer
      ====================================== */}

      <footer className="footer">

        <p>
          © 2026 PGC Turf Arena. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default App;