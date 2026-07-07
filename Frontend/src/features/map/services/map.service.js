import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/v1",
});

// Attach JWT Token

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Get Coordinates

export const getCoordinates = async (address) => {
  const { data } = await API.get("/maps/get-coordinates", {
    params: { address },
  });

  return data;
};

// Get Distance & Time

export const getDistanceTime = async (origin, destination) => {
  const { data } = await API.get("/maps/get-distance-time", {
    params: {
      origin,
      destination,
    },
  });

  return data;
};

// Get Fare

export const getFare = async (pickup, destination) => {
  const { data } = await API.get("/rides/get-fare", {
    params: {
      pickup,
      destination,
    },
  });

  return data;
};

// Get Suggestions

export const getSuggestions = async (input) => {
  const { data } = await API.get("/maps/get-suggestions", {
    params: {
      input,
    },
  });

  return data;
};

// Create Ride

export const createRide = async ({ pickup, destination, vehicleType }) => {
  const { data } = await API.post("/rides/create", {
    pickup,
    destination,
    vehicleType,
  });

  return data;
};

// Get Route

export const getRoute = async (pickup, destination) => {
  const { data } = await API.get("/maps/get-route", {
    params: {
      pickup,
      destination,
    },
  });

  return data;
};

// Confirm Ride

export const confirmRide = async (rideId) => {
  const { data } = await API.post("/rides/confirm", {
    rideId,
  });

  return data;
};

// Start Ride

export const startRide = async (rideId, otp) => {
  const { data } = await API.get("/rides/start-ride", {
    params: {
      rideId,
      otp,
    },
  });

  return data;
};

// End Ride

export const endRide = async (rideId) => {
  const { data } = await API.post("/rides/end-ride", {
    rideId,
  });

  return data;
};
