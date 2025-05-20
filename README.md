# Hotel Room Reservation System

A full-stack application that implements a hotel room reservation system with a dynamic booking algorithm to optimize room assignments based on travel time.

## Features

- Interactive hotel visualization with floors and rooms
- Room reservation system that optimizes based on travel time
- Ability to randomize room occupancy
- Reset functionality to clear all bookings

## Project Structure

```
hotel-reservation-system/
├── client/                    # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookingForm.jsx
│   │   │   ├── FloorView.jsx
│   │   │   ├── HotelView.jsx
│   │   │   ├── Room.jsx
│   │   │   └── BookingSummary.jsx
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── styles.css
│   └── package.json
├── server/                    # Backend Node.js application
│   ├── controllers/
│   │   └── roomController.js
│   ├── models/
│   │   └── Room.js
│   ├── routes/
│   │   └── roomRoutes.js
│   ├── utils/
│   │   └── bookingAlgorithm.js
│   ├── server.js
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v14 or later)
- MongoDB (v4 or later)

## Installation and Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd hotel-reservation-system
```

### 2. Set up the server

```bash
cd server
npm install
```

### 3. Set up the client

```bash
cd ../client
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running on your local machine:

```bash
# On most systems
sudo service mongod start

# Or
mongod
```

### 5. Run the application

#### Terminal 1 - Backend:

```bash
cd server
npm run dev
```

#### Terminal 2 - Frontend:

```bash
cd client
npm start
```

The application should now be running:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

- `GET /api/rooms` - Get all rooms and hotel structure
- `POST /api/rooms/book` - Book rooms based on the algorithm
- `POST /api/rooms/randomize` - Randomize room occupancy
- `POST /api/rooms/reset` - Reset all rooms to available

## Algorithm Explanation

The room booking algorithm works as follows:

1. It first attempts to book rooms on the same floor to minimize travel time.
2. If enough rooms are not available on the same floor, it finds a combination of rooms across floors that minimizes the total travel time.
3. Travel time is calculated based on:
   - Horizontal travel: 1 minute per room
   - Vertical travel: 2 minutes per floor

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **State Management**: React hooks
- **Styling**: CSS3

## Future Improvements

- User authentication system
- Guest management
- Booking history
- Room categories and pricing
- Date-based reservations
