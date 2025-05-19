import React from 'react';

const Room = ({ roomNumber, status, isHighlighted }) => {
  let roomClass = 'room';
  
  if (isHighlighted) {
    roomClass += ' highlighted';
  } else if (status === 'occupied') {
    roomClass += ' occupied';
  } else {
    roomClass += ' available';
  }

  return (
    <div className={roomClass}>
      <span className="room-number">{roomNumber}</span>
    </div>
  );
};

export default Room;