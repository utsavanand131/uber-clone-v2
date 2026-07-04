import rideModel from "../models/ride.model.js";
import { getDistanceAndTime } from "../services/map.services.js";
import crypto from "crypto";

// ==========================
// Calculate Fare
// ==========================
export const getFareService = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const distanceTime = await getDistanceAndTime(pickup, destination);

  const distance_km = distanceTime.distance_km;
  const duration_min = distanceTime.duration_min;

  const baseFare = {
    auto: 30,
    car: 50,
    bike: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    bike: 8,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    bike: 1,
  };

  return {
    auto: Math.round(
      baseFare.auto +
        distance_km * perKmRate.auto +
        duration_min * perMinuteRate.auto,
    ),

    car: Math.round(
      baseFare.car +
        distance_km * perKmRate.car +
        duration_min * perMinuteRate.car,
    ),

    bike: Math.round(
      baseFare.bike +
        distance_km * perKmRate.bike +
        duration_min * perMinuteRate.bike,
    ),
  };
};

// ==========================
// Generate OTP
// ==========================
const getOtp = (num) => {
  return crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
};

// ==========================
// Create Ride
// ==========================
export const createRideService = async ({
  user,
  pickup,
  destination,
  vehicleType,
}) => {
  const fare = await getFareService(pickup, destination);

  const ride = await rideModel.create({
    user,
    pickup,
    destination,
    vehicleType,
    otp: getOtp(6),
    fare: fare[vehicleType],
  });

  return ride;
};

// ==========================
// Confirm Ride
// ==========================
export const confirmRideService = async ({ rideId, captain }) => {
  await rideModel.findByIdAndUpdate(rideId, {
    status: "accepted",
    captain: captain._id,
  });

  const ride = await rideModel
    .findById(rideId)
    .populate("user")
    .populate("captain")
    .select("+otp");

  return ride;
};

// ==========================
// Start Ride
// ==========================
export const startRideService = async ({ rideId, otp, captain }) => {
  const ride = await rideModel
    .findById(rideId)
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.captain._id.toString() !== captain._id.toString()) {
    throw new Error("Unauthorized captain");
  }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (ride.status !== "accepted") {
    throw new Error("Ride not accepted");
  }

  ride.status = "ongoing";
  await ride.save();

  return ride;
};

// ==========================
// End Ride
// ==========================
export const endRideService = async ({ rideId, captain }) => {
  const ride = await rideModel
    .findOne({
      _id: rideId,
      captain: captain._id,
    })
    .populate("user")
    .populate("captain");

  if (!ride) {
    throw new Error("Ride not found");
  }

  if (ride.status !== "ongoing") {
    throw new Error("Ride is not ongoing");
  }

  ride.status = "completed";
  await ride.save();

  return ride;
};
