import express from "express";
import { body, query } from "express-validator";
import { authUser, authCaptain } from "../middleware/auth.middleware.js";
import {
  confirmRide,
  createRide,
  endRide,
  getFare,
  startRide,
} from "../controllers/rides.controller.js";

const router = express.Router();

// =========================
// Create Ride
// =========================
router.post(
  "/create",
  authUser,

  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),

  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),

  body("vehicleType")
    .isString()
    .isIn(["auto", "car", "bike"])
    .withMessage("Invalid vehicle type"),

  createRide,
);

// =========================
// Get Fare
// =========================
router.get(
  "/get-fare",
  authUser,

  query("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),

  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),

  getFare,
);

// =========================
// Confirm Ride
// =========================
router.post(
  "/confirm",
  authCaptain,

  body("rideId").isMongoId().withMessage("Invalid ride id"),

  confirmRide,
);

// =========================
// Start Ride
// =========================
router.get(
  "/start-ride",
  authCaptain,

  query("rideId").isMongoId().withMessage("Invalid ride id"),

  query("otp")
    .isString()
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid OTP"),

  startRide,
);

// =========================
// End Ride
// =========================
router.post(
  "/end-ride",
  authCaptain,

  body("rideId").isMongoId().withMessage("Invalid ride id"),

  endRide,
);

export default router;
