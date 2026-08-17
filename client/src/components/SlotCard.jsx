function SlotCard({ time, status, price }) {
  const isBooked = status === 'Booked';

  return (
    <div className={`slot-card ${isBooked ? 'booked' : 'available'}`}>
      <div>
        <span className="slot-time">{time}</span>
        <span className="slot-price">{price}</span>
      </div>

      <button
        className="book-btn"
        disabled={isBooked}
      >
        {isBooked ? 'Occupied' : 'Reserve'}
      </button>
    </div>
  );
}

export default SlotCard;