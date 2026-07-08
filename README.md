# 🚖 Uber Clone

A full-stack Uber Clone built with the MERN stack, Socket.IO , OpenRouteService API
Nominatim Geocoding API. Users can book rides, captains receive ride requests in real time, verify OTP before starting the trip, and complete rides with live status updates.

## 🚀 Features

### User

- Register & Login
- Book a ride
- Address autocomplete
- Fare estimation
- Real-time driver matching
- Driver details & OTP
- Live ride status updates
- Ride completion screen

### Captain

- Register & Login
- Live location updates
- Receive nearby ride requests
- Accept ride requests
- OTP verification before starting ride
- Ride in progress screen
- End ride functionality

### Real-Time Features

- Socket.IO integration
- Instant ride notifications
- Driver assignment
- Ride started updates
- Ride completed updates

---

## 🛠 Tech Stack

### Frontend

- React (Vite)
- React Router
- Tailwind CSS
- shadcn/ui
- Axios
- React Hook Form
- Zod
- Leaflet
- React Leaflet
- Socket.IO Client
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Socket.IO
- Express Validator

### APIs

- OpenRouteService API
- Nominatim Geocoding API

---

## 📂 Project Structure

```
Uber Clone/
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── Backend/
│   ├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── socket.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/utsavanand131/uber-clone.git
```

### Backend

```bash
cd Backend

npm install

npm run dev
```

### Frontend

```bash
cd Frontend

npm install

npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file inside the Backend folder.

```env
PORT=5001

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret

ORS_API_KEY=your_openrouteservice_api_key
```

---

## 🚖 Ride Flow

```
User Login
      │
      ▼
Book Ride
      │
      ▼
Fare Calculation
      │
      ▼
Ride Created
      │
      ▼
Nearby Captain Receives Request
      │
      ▼
Captain Accepts Ride
      │
      ▼
User Receives Driver Details
      │
      ▼
OTP Verification
      │
      ▼
Ride Started
      │
      ▼
Ride In Progress
      │
      ▼
Ride Completed
```

---

## 👨‍💻 Author

**Utsav Anand**

GitHub: https://github.com/utsavanand131
