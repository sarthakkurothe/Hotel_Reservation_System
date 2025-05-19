const Room = require('../models/Room');
const { findOptimalRooms } = require('../utils/bookingAlgorithm');

/**
 * Get hotel data including structure and room status
 * @route GET /api/rooms
 */
exports.getHotelData = async (req, res) => {
  try {
    // Check if rooms exist, if not initialize
    const roomCount = await Room.countDocuments();
    
    if (roomCount === 0) {
      await Room.initializeRooms();
    }
    
    // Get hotel structure
    const hotelData = await Room.getHotelStructure();
    
    res.status(200).json(hotelData);
  } catch (error) {
    console.error('Error getting hotel data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Book rooms based on algorithm
 * @route POST /api/rooms/book
 */
exports.bookRooms = async (req, res) => {
  try {
    const { numberOfRooms } = req.body;
    
    // Validate input
    if (!numberOfRooms || numberOfRooms < 1 || numberOfRooms > 5) {
      return res.status(400).json({ 
        message: 'Number of rooms must be between 1 and 5' 
      });
    }
    
    // Get available rooms
    const availableRooms = await Room.getAvailableRooms();
    
    // Find optimal rooms using algorithm
    const bookingResult = findOptimalRooms(availableRooms, parseInt(numberOfRooms));
    
    if (!bookingResult.status) {
      return res.status(400).json({ message: bookingResult.message });
    }
    
    // Mark rooms as occupied
    await Room.updateMany(
      { roomNumber: { $in: bookingResult.bookedRooms } },
      { status: 'occupied' }
    );
    
    res.status(200).json(bookingResult);
  } catch (error) {
    console.error('Error booking rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Randomize room occupancy
 * @route POST /api/rooms/randomize
 */
exports.randomizeOccupancy = async (req, res) => {
  try {
    await Room.randomizeOccupancy();
    res.status(200).json({ message: 'Room occupancy randomized successfully' });
  } catch (error) {
    console.error('Error randomizing room occupancy:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Reset all rooms to available
 * @route POST /api/rooms/reset
 */
exports.resetAllRooms = async (req, res) => {
  try {
    await Room.resetAllRooms();
    res.status(200).json({ message: 'All rooms reset to available' });
  } catch (error) {
    console.error('Error resetting rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};