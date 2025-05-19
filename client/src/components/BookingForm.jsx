import React, { useState } from 'react';

const BookingForm = ({ onBookRooms, onRandomizeOccupancy, onResetBookings, loading }) => {
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [randomizeLoading, setRandomizeLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onBookRooms(numberOfRooms);
  };

  const handleRandomize = () => {
    setRandomizeLoading(true);
    
    // Call the existing randomize function
    onRandomizeOccupancy()
      .then(() => {
        // Hide loading state when complete
        setRandomizeLoading(false);
      })
      .catch(error => {
        console.error("Randomization failed:", error);
        setRandomizeLoading(false);
      });
  };

  return (
    <div className="booking-form">
      <h2>Book Rooms</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="numberOfRooms">Number of Rooms (1-5):</label>
          <input
            type="number"
            id="numberOfRooms"
            min="1"
            max="5"
            value={numberOfRooms}
            onChange={(e) => setNumberOfRooms(parseInt(e.target.value))}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit" className="btn primary" disabled={loading || randomizeLoading}>
            {loading ? 'Processing...' : 'Book Rooms'}
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={handleRandomize}
            disabled={loading || randomizeLoading}
          >
            {randomizeLoading ? 'Randomizing...' : 'Randomize Occupancy'}
          </button>
          <button
            type="button"
            className="btn danger"
            onClick={onResetBookings}
            disabled={loading || randomizeLoading}
          >
            Reset All Bookings
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;