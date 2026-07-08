import axios from "axios";

const API = axios.create({
  baseURL: "https://uber-clone-backend-5exd.onrender.com/api/v1",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getCoordinates = async (address) => {
  const { data } = await API.get("/maps/get-coordinates", {
    params: { address },
  });

  return data;
};

export const getDistanceTime = async (origin, destination) => {
  const { data } = await API.get("/maps/get-distance-time", {
    params: {
      origin,
      destination,
    },
  });

  return data;
};

export const getFare = async (pickup, destination) => {
  const { data } = await API.get("/rides/get-fare", {
    params: {
      pickup,
      destination,
    },
  });

  return data;
};

export const getSuggestions = async (input) => {
  const { data } = await API.get("/maps/get-suggestions", {
    params: {
      input,
    },
  });

  return data;
};

export const createRide = async ({ pickup, destination, vehicleType }) => {
  const { data } = await API.post("/rides/create", {
    pickup,
    destination,
    vehicleType,
  });

  return data;
};

export const getRoute = async (pickup, destination) => {
  const { data } = await API.get("/maps/get-route", {
    params: {
      pickup,
      destination,
    },
  });

  return data;
};

export const confirmRide = async (rideId) => {
  const { data } = await API.post("/rides/confirm", {
    rideId,
  });

  return data;
};

export const startRide = async (rideId, otp) => {
  const { data } = await API.get("/rides/start-ride", {
    params: {
      rideId,
      otp,
    },
  });

  return data;
};

export const endRide = async (rideId) => {
  const { data } = await API.post("/rides/end-ride", {
    rideId,
  });

  return data;
};
