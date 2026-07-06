import { useEffect, useState } from "react";
import { Car, MapPin, Circle, CheckCircle } from "lucide-react";
import socket from "@/socket/socket";

const LookingForDriverPanel = ({
  pickup,
  destination,
  fare,
  selectedVehicle,
}) => {
  const [acceptedRide, setAcceptedRide] = useState(null);

  useEffect(() => {
    const handleRideConfirmed = (ride) => {
      setAcceptedRide(ride);
    };

    socket.on("ride-confirmed", handleRideConfirmed);

    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
    };
  }, []);

  // =========================
  // Driver Found
  // =========================
  if (acceptedRide) {
    return (
      <div className="w-full max-w-lg bg-white rounded-3xl border shadow-lg p-6 mt-2">
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <CheckCircle className="h-14 w-14 text-green-600" />

            <h2 className="text-2xl font-bold mt-4 text-green-600">
              Driver Found!
            </h2>

            <p className="text-gray-500 mt-2">Your captain is on the way.</p>
          </div>

          <div className="rounded-2xl border divide-y">
            <div className="p-4">
              <p className="font-medium">Captain</p>

              <p>
                {acceptedRide.captain.fullname.firstname}{" "}
                {acceptedRide.captain.fullname.lastname}
              </p>
            </div>

            <div className="p-4">
              <p className="font-medium">Vehicle</p>

              <p>
                {acceptedRide.captain.vehicles.color} •{" "}
                {acceptedRide.captain.vehicles.vehicleType}
              </p>

              <p>{acceptedRide.captain.vehicles.plate}</p>
            </div>

            <div className="p-4">
              <p className="font-medium">OTP</p>

              <p className="text-2xl font-bold">{acceptedRide.otp}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Looking for Driver
  // =========================
  return (
    <div className="w-full max-w-lg bg-white rounded-3xl border shadow-lg p-6 mt-2">
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <Car className="h-12 w-12 animate-bounce" />

          <h2 className="text-2xl font-semibold mt-4">
            Looking for a Driver...
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Finding the nearest available driver
          </p>
        </div>

        <div className="rounded-2xl border divide-y">
          <div className="flex gap-4 p-4">
            <Circle className="h-4 w-4 mt-1" />

            <div>
              <p className="font-medium">Pickup</p>

              <p className="text-sm text-gray-500">{pickup.address}</p>
            </div>
          </div>

          <div className="flex gap-4 p-4">
            <MapPin className="h-5 w-5 mt-1" />

            <div>
              <p className="font-medium">Destination</p>

              <p className="text-sm text-gray-500">{destination.address}</p>
            </div>
          </div>

          <div className="flex justify-between items-center p-4">
            <span className="font-medium capitalize">{selectedVehicle}</span>

            <span className="text-xl font-bold">
              ₹{fare?.[selectedVehicle]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookingForDriverPanel;
