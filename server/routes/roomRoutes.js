const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Get all rooms and hotel structure
router.get('/', roomController.getHotelData);

// Book rooms
router.post('/book', roomController.bookRooms);

// Randomize room occupancy
router.post('/randomize', roomController.randomizeOccupancy);

// Reset all rooms to available
router.post('/reset', roomController.resetAllRooms);

module.exports = router;