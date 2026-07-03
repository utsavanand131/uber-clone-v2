import { useEffect, useState } from "react";
import { ArrowRight, Circle, MapPin } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import LocationSearchPanel from "./LocationSearchPanel";
import { getSuggestions } from "@/features/map/services/map.service";

const RideBookingCard = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState("pickup");

  const [suggestions, setSuggestions] = useState([]);

  // -----------------------------
  // Debounce logic (IMPORTANT)
  // -----------------------------
  useEffect(() => {
    const timeout = setTimeout(() => {
      const fetchSuggestions = async () => {
        const query = activeField === "pickup" ? pickup : destination;

        if (!query || query.length < 2) return;

        try {
          const data = await getSuggestions(query);
          setSuggestions(data);
        } catch (err) {
          console.log("Suggestion error:", err);
        }
      };

      fetchSuggestions();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeout);
  }, [pickup, destination, activeField]);

  // -----------------------------
  // Select location
  // -----------------------------
  const handleLocationSelect = (location) => {
    if (activeField === "pickup") {
      setPickup(location);
    } else {
      setDestination(location);
    }

    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSearchRide = () => {
    console.log({
      pickup,
      destination,
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
            value={pickup}
            placeholder="Pickup location"
            className="pl-10 h-12 rounded-xl"
            onChange={(e) => setPickup(e.target.value)}
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
            value={destination}
            placeholder="Where to?"
            className="pl-10 h-12 rounded-xl"
            onChange={(e) => setDestination(e.target.value)}
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
