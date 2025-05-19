import React from 'react';
import Room from './Room';

const FloorView = ({ floor, roomStatus, highlightedRooms }) => {
  return (
    <div className="floor">
      <div className="floor-info">
        <span className="floor-number">Floor {floor.floorNumber}</span>
        <div className="elevator">
          <span>Elevator</span>
        </div>
      </div>
      <div className="floor-rooms">
        {floor.rooms.map(roomNumber => (
          <Room 
            key={roomNumber}
            roomNumber={roomNumber}
            status={roomStatus[roomNumber] || 'available'}
            isHighlighted={highlightedRooms.includes(roomNumber)}
          />
        ))}
      </div>
    </div>
  );
};

export default FloorView;