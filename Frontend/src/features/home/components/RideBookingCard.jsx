import { useEffect, useState } from "react";
import { ArrowRight, Circle, MapPin } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import LocationSearchPanel from "./LocationSearchPanel";
import VehiclePanel from "./VehiclePanel";
import ConfirmRidePanel from "./ConfirmRidePanel";
import LookingForDriverPanel from "./LookingForDriverPanel";

import { getFare, getSuggestions } from "@/features/map/services/map.service";

const RideBookingCard = () => {
  // =========================
  // INPUT STATES (TEXT)
  // =========================
  const [pickupInput, setPickupInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");

  // =========================
  // FINAL SELECTED VALUES
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

  const [showVehiclePanel, setShowVehiclePanel] = useState(false);
  const [showConfirmRide, setShowConfirmRide] = useState(false);
  const [showLookingForDriver, setShowLookingForDriver] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [fare, setFare] = useState(null);

  // =========================
  // DEBOUNCED API CALL
  // =========================
  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        let query = "";

        if (activeField === "pickup") {
          query = pickupInput;
        } else {
          query = destinationInput;
        }

        if (query.length < 2) {
          setSuggestions([]);
          return;
        }

        const data = await getSuggestions(query);
        setSuggestions(data);
      } catch (err) {
        console.log("Suggestion error:", err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [pickupInput, destinationInput, activeField]);

  // =========================
  // HANDLE LOCATION SELECT
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
    } else {
      setDestination(location);
      setDestinationInput(place.display_name);
    }

    setSuggestions([]);
    setShowSuggestions(false);
  };

  // =========================
  // SEARCH RIDE
  // =========================
  const handleSearchRide = async () => {
    if (!pickup.address || !destination.address) return;

    try {
      const fareData = await getFare(pickup.address, destination.address);

      setFare(fareData);
      setShowVehiclePanel(true);
    } catch (err) {
      console.log("Fare Error:", err);
    }
  };

  // =========================
  // LOOKING FOR DRIVER PANEL
  // =========================
  if (showLookingForDriver) {
    return (
      <LookingForDriverPanel
        pickup={pickup}
        destination={destination}
        fare={fare}
        selectedVehicle={selectedVehicle}
      />
    );
  }

  // =========================
  // CONFIRM RIDE PANEL
  // =========================
  if (showConfirmRide) {
    return (
      <ConfirmRidePanel
        pickup={pickup}
        destination={destination}
        fare={fare}
        selectedVehicle={selectedVehicle}
        onRideCreated={(ride) => {
          console.log("Ride created successfully:", ride);

          setShowConfirmRide(false);
          setShowLookingForDriver(true);
        }}
      />
    );
  }

  // =========================
  // VEHICLE PANEL
  // =========================
  if (showVehiclePanel) {
    return (
      <VehiclePanel
        fare={fare}
        pickup={pickup}
        destination={destination}
        onSelectVehicle={(vehicle) => {
          setSelectedVehicle(vehicle);
          setShowVehiclePanel(false);
          setShowConfirmRide(true);
        }}
      />
    );
  }

  // =========================
  // BOOKING CARD
  // =========================
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
            className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
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

        <Button
          className="w-full h-12 rounded-xl text-base"
          onClick={handleSearchRide}
        >
          Search Ride
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

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
