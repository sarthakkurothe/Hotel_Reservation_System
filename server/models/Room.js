const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: true,
    unique: true
  },
  floorNumber: {
    type: Number,
    required: true
  },
  positionOnFloor: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied'],
    default: 'available'
  }
});

// Add static method to initialize all rooms
roomSchema.statics.initializeRooms = async function() {
  const rooms = [];
  
  // Create rooms for floors 1-9 (10 rooms each)
  for (let floor = 1; floor <= 9; floor++) {
    for (let position = 1; position <= 10; position++) {
      const roomNumber = floor * 100 + position;
      rooms.push({
        roomNumber,
        floorNumber: floor,
        positionOnFloor: position,
        status: 'available'
      });
    }
  }
  
  // Create rooms for floor 10 (7 rooms)
  for (let position = 1; position <= 7; position++) {
    const roomNumber = 1000 + position;
    rooms.push({
      roomNumber,
      floorNumber: 10,
      positionOnFloor: position,
      status: 'available'
    });
  }
  
  // Delete all existing rooms and insert new ones
  await this.deleteMany({});
  await this.insertMany(rooms);
  
  return rooms;
};

// Add method to get all available rooms
roomSchema.statics.getAvailableRooms = function() {
  return this.find({ status: 'available' }).sort({ floorNumber: 1, positionOnFloor: 1 });
};

// Add method to get hotel structure (floors and rooms)
roomSchema.statics.getHotelStructure = async function() {
  const rooms = await this.find().sort({ floorNumber: 1, positionOnFloor: 1 });
  
  const floors = [];
  const roomStatus = {};
  
  // Group rooms by floor
  rooms.forEach(room => {
    // Add room status to lookup object
    roomStatus[room.roomNumber] = room.status;
    
    // Find or create floor
    let floor = floors.find(f => f.floorNumber === room.floorNumber);
    if (!floor) {
      floor = {
        floorNumber: room.floorNumber,
        rooms: []
      };
      floors.push(floor);
    }
    
    // Add room to floor
    floor.rooms.push(room.roomNumber);
  });
  
  return { floors, roomStatus };
};

// Add method to randomize room availability
// New method (fast)
roomSchema.statics.randomizeOccupancy = async function() {
  // Create an array of bulk operations
  const bulkOps = [];
  const rooms = await this.find();
  
  // Build bulk operations array
  for (const room of rooms) {
    const newStatus = Math.random() < 0.5 ? 'occupied' : 'available';
    bulkOps.push({
      updateOne: {
        filter: { _id: room._id },
        update: { $set: { status: newStatus } }
      }
    });
  }
  
  // Execute all updates in one database operation
  if (bulkOps.length > 0) {
    await this.bulkWrite(bulkOps);
  }
  
  return await this.find();
};

// Add method to reset all rooms to available
roomSchema.statics.resetAllRooms = async function() {
  await this.updateMany({}, { status: 'available' });
  return this.find();
};

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;