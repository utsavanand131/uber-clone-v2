import { Car, Bike, Truck, MapPin, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { createRide } from "@/features/map/services/map.service";

const ConfirmRidePanel = ({
  pickup,
  destination,
  fare,
  selectedVehicle,
  onRideCreated,
}) => {
  const getVehicleIcon = () => {
    switch (selectedVehicle) {
      case "car":
        return <Car className="h-8 w-8" />;

      case "bike":
        return <Bike className="h-8 w-8" />;

      case "auto":
        return <Truck className="h-8 w-8" />;

      default:
        return <Car className="h-8 w-8" />;
    }
  };

  const handleConfirmRide = async () => {
    try {
      const ride = await createRide({
        pickup: pickup.address,
        destination: destination.address,
        vehicleType: selectedVehicle,
      });

      // Notify parent component that ride has been created
      if (onRideCreated) {
        onRideCreated(ride);
      }
    } catch (err) {
      console.log("Create Ride Error:", err);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl border shadow-lg p-6 mt-2">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {getVehicleIcon()}

          <div>
            <h2 className="text-2xl font-semibold">Confirm Ride</h2>

            <p className="text-sm text-gray-500 capitalize">
              {selectedVehicle}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border divide-y">
          {/* Pickup */}
          <div className="flex gap-4 p-4">
            <Circle className="h-4 w-4 mt-1" />

            <div>
              <p className="font-medium">Pickup</p>

              <p className="text-sm text-gray-500">{pickup.address}</p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex gap-4 p-4">
            <MapPin className="h-5 w-5 mt-1" />

            <div>
              <p className="font-medium">Destination</p>

              <p className="text-sm text-gray-500">{destination.address}</p>
            </div>
          </div>

          {/* Fare */}
          <div className="flex justify-between items-center p-4">
            <span className="font-medium">Estimated Fare</span>

            <span className="text-xl font-bold">
              ₹{fare?.[selectedVehicle]}
            </span>
          </div>
        </div>

        <Button className="w-full h-12 rounded-xl" onClick={handleConfirmRide}>
          Confirm Ride
        </Button>
      </div>
    </div>
  );
};

export default ConfirmRidePanel;
