import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom hook for controlling the map
function MapController({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

const HeroMap = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [selectedType, setSelectedType] = useState("ride");
  const [mapCenter] = useState([28.6139, 77.209]); // Delhi

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });

  const handleRideTypeChange = (type) => {
    setSelectedType(type);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white px-8 lg:px-12">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col pt-8 lg:pt-10">
        <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
          Go anywhere with
          <span className="block">Uber</span>
        </h1>

        <div className="mt-8 flex flex-col items-start space-y-2">
          <Button variant="outline" size="icon">
            <CarFront size={26} />
          </Button>

          <span className="font-medium">Ride</span>
        </div>

        {/* TODO: Add ride fields here */}
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-3">
        <div className="w-full h-[85vh] rounded-2xl overflow-hidden shadow-xl">
          <MapContainer
            center={mapCenter}
            zoom={13}
            zoomControl={false}
            attributionControl={false}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker position={mapCenter} icon={customIcon}>
              <Popup>Current Location</Popup>
            </Marker>

            <MapController center={mapCenter} />

            {/* Custom Zoom Buttons */}
            <div className="absolute right-4 bottom-4 z-[1000] flex flex-col space-y-2">
              <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </button>

              <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14" />
                </svg>
              </button>
            </div>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default HeroMap;
