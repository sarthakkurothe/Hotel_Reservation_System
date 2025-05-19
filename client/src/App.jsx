import React, { useState, useEffect } from 'react';
import BookingForm from './components/BookingForm';
import HotelView from './components/HotelView';
import BookingSummary from './components/BookingSummary';
import './styles.css';

function App() {
  const [hotelData, setHotelData] = useState({
    floors: [],
    roomStatus: {}
  });
  const [loading, setLoading] = useState(true);
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHotelData();
  }, []);

  const fetchHotelData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/rooms');
      if (!response.ok) {
        throw new Error('Failed to fetch hotel data');
      }
      const data = await response.json();
      setHotelData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRooms = async (numberOfRooms) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/rooms/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numberOfRooms }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to book rooms');
      }
      
      const result = await response.json();
      setBookingResult(result);
      fetchHotelData(); // Refresh hotel data after booking
    } catch (err) {
      setError(err.message);
      setBookingResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomizeOccupancy = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/rooms/randomize', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to randomize room occupancy');
      }
      
      fetchHotelData(); // Refresh hotel data after randomizing
      setBookingResult(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/rooms/reset', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset bookings');
      }
      
      fetchHotelData(); // Refresh hotel data after reset
      setBookingResult(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !hotelData.floors.length) {
    return <div className="loading">Loading hotel data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Hotel Room Reservation System</h1>
      </header>
      <main>
        <div className="control-panel">
          <BookingForm 
            onBookRooms={handleBookRooms} 
            onRandomizeOccupancy={handleRandomizeOccupancy}
            onResetBookings={handleResetBookings}
            loading={loading}
          />
          {bookingResult && <BookingSummary booking={bookingResult} />}
        </div>
        <div className="hotel-visualization">
          <HotelView 
            floors={hotelData.floors} 
            roomStatus={hotelData.roomStatus}
            bookingResult={bookingResult}
          />
        </div>
      </main>
    </div>
  );
}

export default App;