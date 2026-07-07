import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { endRide } from "@/features/map/services/map.service";

const CaptainLiveRide = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const ride = state?.ride;

  const [loading, setLoading] = useState(false);

  if (!ride) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Ride not found.
      </div>
    );
  }

  const handleEndRide = async () => {
    try {
      setLoading(true);

      const completedRide = await endRide(ride._id);

      console.log("Ride Completed:", completedRide);

      navigate("/captain-home");
    } catch (error) {
      console.log(error);
      alert("Unable to end ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Ride In Progress</h1>

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

          <div>
            <h2 className="font-semibold">Status</h2>
            <p className="text-green-600 font-semibold capitalize">
              {ride.status}
            </p>
          </div>
        </div>

        <Button
          className="w-full mt-6"
          onClick={handleEndRide}
          disabled={loading}
        >
          {loading ? "Ending Ride..." : "End Ride"}
        </Button>
      </div>
    </div>
  );
};

export default CaptainLiveRide;
