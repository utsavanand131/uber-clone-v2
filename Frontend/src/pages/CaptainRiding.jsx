import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { startRide } from "@/features/map/services/map.service";

const CaptainRiding = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const ride = state?.ride;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!ride) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Ride not found.
      </div>
    );
  }

  const handleStartRide = async () => {
    try {
      setLoading(true);

      const startedRide = await startRide(ride._id, otp);

      navigate("/captain-live-ride", {
        state: {
          ride: startedRide,
        },
      });
    } catch (error) {
      console.log(error);
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Start Ride</h1>

        <div className="space-y-4 rounded-xl border p-4">
          <div>
            <h2 className="font-semibold">Passenger</h2>
            <p>
              {ride.user.fullname.firstname} {ride.user.fullname.lastname}
            </p>
          </div>

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

        <div className="mt-6 space-y-4">
          <Input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleStartRide}
            disabled={loading}
          >
            {loading ? "Starting..." : "Start Ride"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaptainRiding;
