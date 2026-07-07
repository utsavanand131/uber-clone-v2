import { validationResult } from "express-validator";
import {
  getAddressCoordinate,
  getCaptainInTheRadius,
} from "../services/map.services.js";

import rideModel from "../models/ride.model.js";

import {
  confirmRideService,
  createRideService,
  endRideService,
  getFareService,
  startRideService,
} from "../services/rides.services.js";

import { sendMessageToSocketId } from "../socket.js";
import captainModel from "../models/captain.model.js";

// Create Ride

export const createRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await createRideService({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    res.status(201).json(ride);

    const pickupCoordinates = await getAddressCoordinate(pickup);

    const captainsInRadius = await getCaptainInTheRadius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      2,
    );

    ride.otp = "";

    const rideWithUser = await rideModel.findById(ride._id).populate("user");

    captainsInRadius.forEach((captain) => {
      if (!captain.socketId) return;

      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Ride not created" });
  }
};

// Get Fare

export const getFare = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await getFareService(pickup, destination);

    res.status(200).json(fare);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Fare not found" });
  }
};

// Confirm Ride

export const confirmRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await confirmRideService({
      rideId,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Ride not confirmed" });
  }
};

// Start Ride

export const startRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.query;

  try {
    const ride = await startRideService({
      rideId,
      otp,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Ride not started" });
  }
};

// End Ride

export const endRide = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await endRideService({
      rideId,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    return res.status(200).json(ride);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: "Ride not ended" });
  }
};
