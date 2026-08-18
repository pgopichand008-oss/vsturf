function SlotCard({ time, status, price, onReserve }) {
  const isBooked = status === 'Booked';

  const handleReserve = () => {
    if (!isBooked) {
      onReserve({
        time,
        price,
      });
    }
  };

  return (
    <article
      className={`slot-card ${isBooked ? 'booked' : 'available'}`}
      aria-label={`${time} - ${isBooked ? 'Booked' : 'Available'}`}
    >
      <div className="slot-details">
        <span className="slot-time">{time}</span>
        <span className="slot-price">{price} / hour</span>
      </div>

      <button
        type="button"
        className="book-btn"
        disabled={isBooked}
        onClick={handleReserve}
      >
        {isBooked ? 'Occupied' : 'Reserve'}
      </button>
    </article>
  );
}

export default SlotCard;