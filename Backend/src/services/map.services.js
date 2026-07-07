import axios from "axios";
import captainModel from "../models/captain.model.js";

// Get Coordinates

export const getAddressCoordinate = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Uber",
      },
    });

    if (response.data.length === 0) {
      throw new Error("Location not found");
    }

    const location = response.data[0];

    return {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
    };
  } catch (error) {
    console.error("Coordinate Error:", error.message);
    throw error;
  }
};

// Get Distance & Time

export const getDistanceAndTime = async (originName, destinationName) => {
  try {
    const origin = await getAddressCoordinate(originName);
    const destination = await getAddressCoordinate(destinationName);

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.ORS_API_KEY}&start=${origin.lng},${origin.lat}&end=${destination.lng},${destination.lat}`;

    const response = await axios.get(url);

    if (
      !response.data.features ||
      response.data.features.length === 0 ||
      !response.data.features[0].properties.segments ||
      response.data.features[0].properties.segments.length === 0
    ) {
      throw new Error("No routes returned from OpenRouteService");
    }

    const feature = response.data.features[0];
    const segment = feature.properties.segments[0];

    return {
      origin: originName,
      destination: destinationName,

      distance_km: Number((segment.distance / 1000).toFixed(2)),
      duration_min: Number((segment.duration / 60).toFixed(2)),

      origin_coords: origin,
      destination_coords: destination,

      route: feature.geometry.coordinates,
    };
  } catch (error) {
    console.error("Distance Service Error:", error.message);
    throw error;
  }
};

// Auto Complete Suggestions

export const getAutoCompleteSuggestionservice = async (input) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      input,
    )}&addressdetails=1&limit=5`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Uber",
      },
    });

    return response.data.map((place) => ({
      display_name: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    }));
  } catch (error) {
    console.error("Autocomplete Error:", error.message);
    throw error;
  }
};

// Get Captains In Radius

export const getCaptainInTheRadius = async (lat, lng, radius) => {
  const captains = await captainModel.find({
    socketId: { $exists: true, $ne: null },
  });

  return captains.filter((captain) => {
    if (!captain.location) return false;

    const captainLat = captain.location.ltd;
    const captainLng = captain.location.lng;

    if (captainLat == null || captainLng == null) return false;

    const distance =
      Math.sqrt(Math.pow(captainLat - lat, 2) + Math.pow(captainLng - lng, 2)) *
      111;

    return distance <= radius;
  });
};
