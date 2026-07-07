import express from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { query } from "express-validator";
import {
  getAutoCompleteSuggestions,
  getCoordinates,
  getDistanceTime,
} from "../controllers/map.controller.js";

const router = express.Router();

// Get Coordinates

router.get(
  "/get-coordinates",
  authUser,
  query("address").isString().isLength({ min: 3 }),
  getCoordinates,
);

// Get Distance & Time

router.get(
  "/get-distance-time",
  authUser,
  query("origin").isString().isLength({ min: 3 }),
  query("destination").isString().isLength({ min: 3 }),
  getDistanceTime,
);

// Suggestions

router.get(
  "/get-suggestions",
  query("input").isString().isLength({ min: 2 }),
  getAutoCompleteSuggestions,
);

export default router;
