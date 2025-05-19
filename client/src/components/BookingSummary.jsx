import React from 'react';

const BookingSummary = ({ booking }) => {
  if (!booking || !booking.bookedRooms || booking.bookedRooms.length === 0) {
    return null;
  }

  return (
    <div className="booking-summary">
      <h2>Booking Summary</h2>
      <div className="summary-content">
        <p><strong>Booked Rooms:</strong> {booking.bookedRooms.join(', ')}</p>
        <p><strong>Total Travel Time:</strong> {booking.totalTravelTime} minutes</p>
        
        {booking.travelDetails && (
          <div className="travel-details">
            <h3>Travel Details:</h3>
            <ul>
              {booking.travelDetails.map((detail, index) => (
                <li key={index}>
                  {detail.from} → {detail.to}: {detail.time} min 
                  ({detail.type === 'vertical' ? 'Floor travel' : 'Room travel'})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSummary;