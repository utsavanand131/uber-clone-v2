import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import socket from "@/socket/socket";
import { CaptainDataContext } from "@/features/captain/context/CaptainContext";
import { Button } from "@/components/ui/button";
import { confirmRide } from "@/features/map/services/map.service";

const CaptainHome = () => {
  const { captain } = useContext(CaptainDataContext);

  const navigate = useNavigate();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(false);

  // Join Socket

  useEffect(() => {
    if (!captain?._id) return;

    socket.emit("join", {
      userId: captain._id,
      userType: "captain",
    });
  }, [captain]);

  // Send Captain Location

  useEffect(() => {
    if (!captain?._id) return;

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (err) => console.log(err),
        {
          enableHighAccuracy: true,
        },
      );
    };

    // Send immediately
    updateLocation();

    // Update every 10 seconds
    const interval = setInterval(updateLocation, 10000);

    return () => clearInterval(interval);
  }, [captain]);

  // Listen for Ride Requests

  useEffect(() => {
    socket.on("new-ride", (rideData) => {
      setRide(rideData);
    });

    return () => {
      socket.off("new-ride");
    };
  }, []);

  // Accept Ride

  const handleAcceptRide = async () => {
    try {
      setLoading(true);

      const acceptedRide = await confirmRide(ride._id);

      navigate("/captain-riding", {
        state: {
          ride: acceptedRide,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Captain Dashboard</h1>

        {!ride ? (
          <p className="text-gray-500">Waiting for ride requests...</p>
        ) : (
          <>
            <div className="space-y-4 rounded-xl border p-4">
              <div>
                <h2 className="font-semibold">Pickup</h2>
                <p>{ride.pickup}</p>
              </div>

              <div>
                <h2 className="font-semibold">Destination</h2>
                <p>{ride.destination}</p>
              </div>

              <div>
                <h2 className="font-semibold">Fare</h2>
                <p>₹{ride.fare}</p>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              onClick={handleAcceptRide}
              disabled={loading}
            >
              {loading ? "Accepting..." : "Accept Ride"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CaptainHome;
