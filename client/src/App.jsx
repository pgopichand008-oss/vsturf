import { useState } from 'react';
import './App.css';
import SlotCard from './components/SlotCard';

function App() {
  const [showSlots, setShowSlots] = useState(false);

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

        {/* Hero Section */}
        <section className="hero-section" id="home">

          <span className="tagline-badge">
            PREMIUM CRICKET ARENA
          </span>

          <h1>Play. Book. Enjoy.</h1>

          <p>
            Professional pitch quality, LED floodlights,
            and seamless online booking.
          </p>

          <button
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
              <p>Downtown Sports Hub, Field #2</p>
            </div>
          </div>

          <div className="info-card">
            <span className="icon">⏰</span>

            <div>
              <h4>Operating Hours</h4>
              <p>6:00 AM – 10:00 PM</p>
            </div>
          </div>

          <div className="info-card">
            <span className="icon">💰</span>

            <div>
              <h4>Pricing</h4>
              <p>Starting at ₹800 / hour</p>
            </div>
          </div>

          <div className="info-card">
            <span className="icon">🏏</span>

            <div>
              <h4>Turf Specification</h4>
              <p>FIFA-Grade Box Cricket Turf</p>
            </div>
          </div>

        </section>

        {/* Slot Booking Section */}
        {showSlots && (
          <section className="slots-section" id="slots">

            <h3>Available Time Slots</h3>

            <div className="slots-grid">

              {sampleSlots.map((slot) => (
                <SlotCard
                  key={slot.time}
                  time={slot.time}
                  status={slot.status}
                  price={slot.price}
                />
              ))}

            </div>

          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          © 2026 VSTurf Arena. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default App;