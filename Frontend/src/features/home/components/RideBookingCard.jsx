import { useEffect, useState } from "react";
import { ArrowRight, Circle, MapPin, Clock3, Route } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import LocationSearchPanel from "./LocationSearchPanel";
import {
  getSuggestions,
  getDistanceTime,
} from "@/features/map/services/map.service";

const RideBookingCard = () => {
  // =========================
  // INPUT STATES
  // =========================
  const [pickupInput, setPickupInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");

  // =========================
  // SELECTED LOCATIONS
  // =========================
  const [pickup, setPickup] = useState({
    address: "",
    lat: null,
    lng: null,
  });

  const [destination, setDestination] = useState({
    address: "",
    lat: null,
    lng: null,
  });

  // =========================
  // UI STATES
  // =========================
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState("pickup");
  const [suggestions, setSuggestions] = useState([]);

  // =========================
  // TRIP INFO
  // =========================
  const [tripInfo, setTripInfo] = useState(null);
  const [loadingTrip, setLoadingTrip] = useState(false);

  // =========================
  // LIVE SUGGESTIONS
  // =========================
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        const query = activeField === "pickup" ? pickupInput : destinationInput;

        if (query.length < 2) {
          setSuggestions([]);
          return;
        }

        const data = await getSuggestions(query);
        setSuggestions(data);
      } catch (err) {
        console.log(err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [pickupInput, destinationInput, activeField]);

  // =========================
  // DISTANCE + TIME
  // =========================
  useEffect(() => {
    const fetchTripInfo = async () => {
      if (!pickup.address || !destination.address) return;

      try {
        setLoadingTrip(true);

        const data = await getDistanceTime(pickup.address, destination.address);

        setTripInfo(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingTrip(false);
      }
    };

    fetchTripInfo();
  }, [pickup, destination]);

  // =========================
  // LOCATION SELECT
  // =========================
  const handleLocationSelect = (place) => {
    const location = {
      address: place.display_name,
      lat: place.lat,
      lng: place.lng,
    };

    if (activeField === "pickup") {
      setPickup(location);
      setPickupInput(place.display_name);

      // Automatically move user to destination
      setActiveField("destination");
    } else {
      setDestination(location);
      setDestinationInput(place.display_name);

      setShowSuggestions(false);
    }

    setSuggestions([]);
  };

  // =========================
  // SEARCH BUTTON
  // =========================
  const handleSearchRide = () => {
    console.log({
      pickup,
      destination,
      tripInfo,
    });
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl border shadow-lg p-6 mt-2">
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold">Book a ride</h2>

          <p className="text-sm text-gray-500 mt-1">
            Enter your pickup and destination
          </p>
        </div>

        {/* Pickup */}

        <div className="relative">
          <Circle
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <Input
            value={pickupInput}
            placeholder="Pickup location"
            className="pl-10 h-12 rounded-xl"
            onChange={(e) => setPickupInput(e.target.value)}
            onFocus={() => {
              setActiveField("pickup");
              setShowSuggestions(true);
            }}
          />
        </div>

        {/* Destination */}

        <div className="relative">
          <MapPin
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2"
          />

          <Input
            value={destinationInput}
            placeholder="Where to?"
            className="pl-10 h-12 rounded-xl"
            onChange={(e) => setDestinationInput(e.target.value)}
            onFocus={() => {
              setActiveField("destination");
              setShowSuggestions(true);
            }}
          />
        </div>

        {/* Search */}

        <Button className="w-full h-12 rounded-xl" onClick={handleSearchRide}>
          Search Ride
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        {/* Distance */}

        {loadingTrip && (
          <div className="rounded-xl border p-4 bg-gray-50 text-sm">
            Calculating route...
          </div>
        )}

        {tripInfo && !loadingTrip && (
          <div className="rounded-xl border bg-gray-50 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Route size={18} />
              <span className="font-medium">
                {tripInfo.distance_km.toFixed(1)} km
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock3 size={18} />
              <span className="text-gray-600">
                {tripInfo.duration_min.toFixed(0)} mins
              </span>
            </div>
          </div>
        )}

        {/* Suggestions */}

        <AnimatePresence>
          {showSuggestions && (
            <LocationSearchPanel
              suggestions={suggestions}
              onSelect={handleLocationSelect}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RideBookingCard;
