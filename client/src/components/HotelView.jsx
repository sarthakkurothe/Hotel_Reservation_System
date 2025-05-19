import React from 'react';
import FloorView from './FloorView';

const HotelView = ({ floors, roomStatus, bookingResult }) => {
  // Display floors in reverse order (top floor first)
  const sortedFloors = [...floors].sort((a, b) => b.floorNumber - a.floorNumber);
  
  return (
    <div className="hotel-view">
      <h2>Hotel Layout</h2>
      <div className="hotel-building">
        {sortedFloors.map(floor => (
          <FloorView 
            key={floor.floorNumber}
            floor={floor}
            roomStatus={roomStatus}
            highlightedRooms={bookingResult?.bookedRooms || []}
          />
        ))}
      </div>
      <div className="legend">
        <div className="legend-item">
          <div className="room-sample available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="room-sample occupied"></div>
          <span>Occupied</span>
        </div>
        <div className="legend-item">
          <div className="room-sample highlighted"></div>
          <span>Your Booking</span>
        </div>
      </div>
    </div>
  );
};

export default HotelView;