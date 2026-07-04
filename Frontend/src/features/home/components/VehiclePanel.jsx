import { Car, Bike, Truck } from "lucide-react";

const VehiclePanel = ({ fare, onSelectVehicle }) => {
  const vehicles = [
    {
      id: "car",
      title: "Car",
      price: fare?.car,
      icon: <Car className="h-8 w-8" />,
    },
    {
      id: "auto",
      title: "Auto",
      price: fare?.auto,
      icon: <Truck className="h-8 w-8" />,
    },
    {
      id: "bike",
      title: "Bike",
      price: fare?.bike,
      icon: <Bike className="h-8 w-8" />,
    },
  ];

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl border shadow-lg p-6 mt-2">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Choose a vehicle</h2>

        {vehicles.map((vehicle) => (
          <button
            key={vehicle.id}
            onClick={() => onSelectVehicle(vehicle.id)}
            className="w-full border rounded-2xl p-4 flex justify-between items-center hover:border-black transition"
          >
            <div className="flex items-center gap-4">
              {vehicle.icon}

              <div className="text-left">
                <h3 className="font-semibold">{vehicle.title}</h3>

                <p className="text-sm text-gray-500">Comfortable ride</p>
              </div>
            </div>

            <div className="text-xl font-bold">₹{vehicle.price}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VehiclePanel;
