import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api/v1",
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===========================
// Get Coordinates
// ===========================
export const getCoordinates = async (address) => {
  const { data } = await API.get("/maps/get-coordinates", {
    params: { address },
  });

  return data;
};

// ===========================
// Get Distance & Time
// ===========================
export const getDistanceTime = async (origin, destination) => {
  const { data } = await API.get("/maps/get-distance-time", {
    params: {
      origin,
      destination,
    },
  });

  return data;
};

// ===========================
// Get Suggestions
// ===========================
export const getSuggestions = async (input) => {
  const { data } = await API.get("/maps/get-suggestions", {
    params: {
      input,
    },
  });

  return data;
};
