import { useEffect, useState } from 'react';
import './App.css';
import SlotCard from './components/SlotCard';

function App() {
  const [showSlots, setShowSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [bookingDate, setBookingDate] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formError, setFormError] = useState('');

  // MongoDB / API state
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  // Fetch turf information from our backend
  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/turfs'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch turf information');
        }

        const data = await response.json();

        if (!data.length) {
          throw new Error('No turf information found');
        }

        setTurf(data[0]);
      } catch (error) {
        console.error('Error fetching turf:', error);
        setApiError(
          'Unable to load turf information. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTurf();
  }, []);

  // Temporary slots
  // We will move these into MongoDB later.
  const sampleSlots = [
    {
      time: '06:00 AM - 07:00 AM',
      status: 'Available',
      price: '₹800',
    },
    {
      time: '07:00 AM - 08:00 AM',
      status: 'Booked',
      price: '₹800',
    },
    {
      time: '05:00 PM - 06:00 PM',
      status: 'Available',
      price: '₹1,200',
    },
    {
      time: '07:00 PM - 08:00 PM',
      status: 'Available',
      price: '₹1,200',
    },
  ];

  function handleReserve(slot) {
    setSelectedSlot(slot);
    setShowConfirmation(false);
    setFormError('');
  }

  function handleCloseBooking() {
    setSelectedSlot(null);
    setShowConfirmation(false);
    setFormError('');
  }

  function handleContinue() {
    setFormError('');

    if (!bookingDate) {
      setFormError('Please select a booking date.');
      return;
    }

    if (!playerName.trim()) {
      setFormError('Please enter your player or team name.');
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setFormError('Please enter a valid 10-digit phone number.');
      return;
    }

    setShowConfirmation(true);
  }

  function handleEditBooking() {
    setShowConfirmation(false);
  }

  function handleConfirmBooking() {
    alert('Booking confirmed successfully!');
  }

  return (
    <div className="app-container">

      {/* Navigation */}
      <header className="navbar">
        <div className="logo">
          <h2>
            🏏 <span>PGC</span>TURF🏏
          </h2>
        </div>

        <nav className="nav-links">
          <a href="#home">Home</a>

          <a
            href="#slots"
            onClick={() => setShowSlots(true)}
          >
            Book a Turf
          </a>

          <a href="#info">Info</a>
        </nav>
      </header>

      <main>

        {/* API Loading State */}
        {loading && (
          <div className="loading-message">
            Loading turf information...
          </div>
        )}

        {/* API Error State */}
        {apiError && (
          <div className="error-message">
            {apiError}
          </div>
        )}

        {/* Main content appears after API data loads */}
        {turf && (
          <>

            {/* Hero Section */}
            <section className="hero-section" id="home">

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
                onClick={() => setShowSlots(!showSlots)}
              >
                {showSlots
                  ? 'Close Slot List'
                  : 'Check Available Slots'}
              </button>

            </section>

            {/* Information Cards */}
            <section className="info-grid" id="info">

              <div className="info-card">
                <span className="icon">📍</span>

                <div>
                  <h4>Location</h4>
                  <p>{turf.location}</p>
                </div>
              </div>

              <div className="info-card">
                <span className="icon">⏰</span>

                <div>
                  <h4>Operating Hours</h4>

                  <p>
                    {turf.openingTime} – {turf.closingTime}
                  </p>
                </div>
              </div>

              <div className="info-card">
                <span className="icon">💰</span>

                <div>
                  <h4>Pricing</h4>

                  <p>
                    Starting at ₹{turf.basePrice} / hour
                  </p>
                </div>
              </div>

              <div className="info-card">
                <span className="icon">🏏</span>

                <div>
                  <h4>Turf</h4>

                  <p>{turf.name}</p>
                </div>
              </div>

            </section>

            {/* Slot Booking */}
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
                    Available Time Slots
                  </h3>

                  <p>
                    Choose your preferred time and reserve
                    your cricket session.
                  </p>

                </div>

                <div className="slots-grid">

                  {sampleSlots.map((slot) => (
                    <SlotCard
                      key={slot.time}
                      time={slot.time}
                      status={slot.status}
                      price={slot.price}
                      onReserve={handleReserve}
                    />
                  ))}

                </div>

                {/* Booking Form */}
                {selectedSlot && !showConfirmation && (
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
                        onClick={handleCloseBooking}
                        aria-label="Close booking panel"
                      >
                        ×
                      </button>

                    </div>

                    {/* Booking Summary */}
                    <div className="booking-summary">

                      <div className="booking-detail">

                        <span>📅</span>

                        <div>
                          <small>Date</small>

                          <strong>
                            {bookingDate || 'Choose date'}
                          </strong>
                        </div>

                      </div>

                      <div className="booking-detail">

                        <span>⏰</span>

                        <div>
                          <small>Time</small>

                          <strong>
                            {selectedSlot.time}
                          </strong>
                        </div>

                      </div>

                      <div className="booking-detail">

                        <span>💰</span>

                        <div>
                          <small>Price</small>

                          <strong>
                            {selectedSlot.price} / hour
                          </strong>
                        </div>

                      </div>

                    </div>

                    {/* Booking Form */}
                    <div className="booking-form">

                      <div className="form-group">

                        <label htmlFor="booking-date">
                          Select Date
                        </label>

                        <input
                          id="booking-date"
                          type="date"
                          value={bookingDate}
                          onChange={(event) => {
                            setBookingDate(event.target.value);
                            setFormError('');
                          }}
                        />

                      </div>

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
                            setPlayerName(event.target.value);
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

                    {/* Error */}
                    {formError && (
                      <p className="form-error">
                        ⚠ {formError}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="booking-footer">

                      <div className="total-price">

                        <span>Total</span>

                        <strong>
                          {selectedSlot.price}
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

                {/* Confirmation */}
                {selectedSlot && showConfirmation && (
                  <section className="booking-panel confirmation-panel">

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
                        onClick={handleCloseBooking}
                        aria-label="Close booking panel"
                      >
                        ×
                      </button>

                    </div>

                    <div className="confirmation-success">

                      <div className="success-icon">
                        ✓
                      </div>

                      <div>
                        <h4>
                          Everything looks good!
                        </h4>

                        <p>
                          Review your booking details before
                          confirming your session.
                        </p>
                      </div>

                    </div>

                    <div className="confirmation-details">

                      <div>
                        <span>Booking Date</span>
                        <strong>{bookingDate}</strong>
                      </div>

                      <div>
                        <span>Time Slot</span>
                        <strong>{selectedSlot.time}</strong>
                      </div>

                      <div>
                        <span>Player / Team</span>
                        <strong>{playerName}</strong>
                      </div>

                      <div>
                        <span>Contact Number</span>
                        <strong>{phoneNumber}</strong>
                      </div>

                      <div>
                        <span>Total Amount</span>
                        <strong>{selectedSlot.price}</strong>
                      </div>

                    </div>

                    <div className="booking-footer">

                      <button
                        type="button"
                        className="edit-booking-btn"
                        onClick={handleEditBooking}
                      >
                        ← Edit Booking
                      </button>

                      <button
                        type="button"
                        className="confirm-booking-btn"
                        onClick={handleConfirmBooking}
                      >
                        Confirm Booking
                      </button>

                    </div>

                  </section>
                )}

              </section>
            )}

          </>
        )}

      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          © 2026 PGC Turf Arena. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default App;