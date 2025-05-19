/**
 * Booking algorithm utility functions
 */

/**
 * Calculate the horizontal travel time between two rooms on the same floor
 * @param {Object} room1 - First room object
 * @param {Object} room2 - Second room object
 * @returns {number} - Travel time in minutes
 */
const calculateHorizontalTravelTime = (room1, room2) => {
  // Each adjacent room takes 1 minute
  return Math.abs(room1.positionOnFloor - room2.positionOnFloor);
};

/**
 * Calculate the vertical travel time between two rooms on different floors
 * @param {Object} room1 - First room object
 * @param {Object} room2 - Second room object
 * @returns {number} - Travel time in minutes
 */
const calculateVerticalTravelTime = (room1, room2) => {
  // Each floor takes 2 minutes
  return Math.abs(room1.floorNumber - room2.floorNumber) * 2;
};

/**
 * Calculate the total travel time between two rooms
 * @param {Object} room1 - First room object
 * @param {Object} room2 - Second room object
 * @returns {Object} - Object containing travel time and details
 */
const calculateTravelTime = (room1, room2) => {
  const travelDetails = [];
  let totalTime = 0;
  
  // If rooms are on different floors
  if (room1.floorNumber !== room2.floorNumber) {
    const verticalTime = calculateVerticalTravelTime(room1, room2);
    totalTime += verticalTime;
    travelDetails.push({
      type: 'vertical',
      from: `Floor ${room1.floorNumber}`,
      to: `Floor ${room2.floorNumber}`,
      time: verticalTime
    });
  }
  
  // Add horizontal travel time within the floor
  const horizontalTime = calculateHorizontalTravelTime(
    { positionOnFloor: room1.floorNumber !== room2.floorNumber ? 1 : room1.positionOnFloor },
    { positionOnFloor: room2.positionOnFloor }
  );
  
  if (horizontalTime > 0) {
    totalTime += horizontalTime;
    travelDetails.push({
      type: 'horizontal',
      from: room1.floorNumber !== room2.floorNumber ? 
        `Room ${room2.floorNumber}01` : 
        `Room ${room1.roomNumber}`,
      to: `Room ${room2.roomNumber}`,
      time: horizontalTime
    });
  }
  
  return { totalTime, travelDetails };
};

/**
 * Find optimal rooms for booking based on travel time
 * @param {Array} availableRooms - Array of available room objects
 * @param {number} requiredRooms - Number of rooms to book (1-5)
 * @returns {Object} - Object containing booked rooms and travel details
 */
const findOptimalRooms = (availableRooms, requiredRooms) => {
  // If not enough rooms available
  if (availableRooms.length < requiredRooms) {
    return {
      status: false,
      message: `Only ${availableRooms.length} rooms available, but ${requiredRooms} were requested`
    };
  }
  
  // Group available rooms by floor
  const roomsByFloor = availableRooms.reduce((acc, room) => {
    if (!acc[room.floorNumber]) {
      acc[room.floorNumber] = [];
    }
    acc[room.floorNumber].push(room);
    return acc;
  }, {});
  
  // Check if any floor has enough rooms
  const floorWithEnoughRooms = Object.keys(roomsByFloor).find(
    floor => roomsByFloor[floor].length >= requiredRooms
  );
  
  // If we find a floor with enough rooms, pick rooms from that floor
  if (floorWithEnoughRooms) {
    // Sort rooms by position on floor (left to right)
    const sortedRooms = roomsByFloor[floorWithEnoughRooms]
      .sort((a, b) => a.positionOnFloor - b.positionOnFloor)
      .slice(0, requiredRooms);
    
    // Calculate travel time between first and last room
    let totalTravelTime = 0;
    const travelDetails = [];
    
    if (sortedRooms.length > 1) {
      // Calculate travel between first and last room
      const { totalTime, travelDetails: details } = calculateTravelTime(
        sortedRooms[0],
        sortedRooms[sortedRooms.length - 1]
      );
      totalTravelTime = totalTime;
      travelDetails.push(...details);
    }
    
    return {
      status: true,
      bookedRooms: sortedRooms.map(room => room.roomNumber),
      totalTravelTime,
      travelDetails
    };
  }
  
  // If no single floor has enough rooms, find optimal combination across floors
  // Try all possible combinations of rooms and pick the one with minimum travel time
  let bestCombination = null;
  let minTravelTime = Infinity;
  let bestTravelDetails = [];
  
  // This is a brute force approach that works for small sets
  // For a real-world application with many rooms, we'd need a more efficient algorithm
  const findCombinations = (availableRooms, requiredRooms, maxCombinations = 10000) => {
    const combinations = [];
    const roomCount = availableRooms.length;
    
    // Helper function to generate combinations
    const generateCombination = (start, current) => {
      if (current.length === requiredRooms) {
        combinations.push([...current]);
        return;
      }
      
      if (combinations.length >= maxCombinations) return;
      
      for (let i = start; i < roomCount; i++) {
        current.push(availableRooms[i]);
        generateCombination(i + 1, current);
        current.pop();
      }
    };
    
    generateCombination(0, []);
    return combinations;
  };
  
  // Get all possible combinations of rooms
  const combinations = findCombinations(availableRooms, requiredRooms);
  
  // Evaluate each combination
  for (const roomCombo of combinations) {
    // Sort rooms by floor and position
    const sortedCombo = [...roomCombo].sort((a, b) => {
      if (a.floorNumber !== b.floorNumber) {
        return a.floorNumber - b.floorNumber;
      }
      return a.positionOnFloor - b.positionOnFloor;
    });
    
    let comboTravelTime = 0;
    const comboTravelDetails = [];
    
    // Calculate total travel time for this combination
    if (sortedCombo.length > 1) {
      for (let i = 0; i < sortedCombo.length - 1; i++) {
        const { totalTime, travelDetails } = calculateTravelTime(
          sortedCombo[i],
          sortedCombo[i + 1]
        );
        comboTravelTime += totalTime;
        comboTravelDetails.push(...travelDetails);
      }
    }
    
    // If this combination has lower travel time, update best combination
    if (comboTravelTime < minTravelTime) {
      minTravelTime = comboTravelTime;
      bestCombination = sortedCombo;
      bestTravelDetails = comboTravelDetails;
    }
  }
  
  if (bestCombination) {
    return {
      status: true,
      bookedRooms: bestCombination.map(room => room.roomNumber),
      totalTravelTime: minTravelTime,
      travelDetails: bestTravelDetails
    };
  }
  
  return {
    status: false,
    message: "Could not find an optimal combination of rooms"
  };
};

module.exports = {
  calculateHorizontalTravelTime,
  calculateVerticalTravelTime,
  calculateTravelTime,
  findOptimalRooms
};