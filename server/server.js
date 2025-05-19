const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const roomRoutes = require('./routes/roomRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sarthak:550420AR@cluster0.l6dbltz.mongodb.net/hotel_reservation?retryWrites=true&w=majority&appName=Cluster0';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rooms', roomRoutes);

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

module.exports = app;