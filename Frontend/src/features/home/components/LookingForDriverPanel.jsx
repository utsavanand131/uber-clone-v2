import { Car, MapPin, Circle } from "lucide-react";

const LookingForDriverPanel = ({
  pickup,
  destination,
  fare,
  selectedVehicle,
}) => {
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
            <span className="font-medium">{selectedVehicle}</span>

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
