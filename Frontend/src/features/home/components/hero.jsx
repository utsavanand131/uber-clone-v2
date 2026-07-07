import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { CarFront } from "lucide-react";

import { Button } from "@/components/ui/button";
import RideBookingCard from "./RideBookingCard";
import { getDistanceTime } from "@/features/map/services/map.service";

// Controls Map

function MapController({ center, route }) {
  const map = useMap();

  useEffect(() => {
    if (route.length > 0) {
      map.fitBounds(route, {
        padding: [60, 60],
      });
    } else {
      map.setView(center, 13);
    }
  }, [center, route, map]);

  return null;
}

const HeroMap = () => {
  const [mapCenter] = useState([28.6139, 77.209]); // Delhi

  // Shared Ride State

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

  const [route, setRoute] = useState([]);

  // Fetch Route

  useEffect(() => {
    const fetchRoute = async () => {
      if (!pickup.address || !destination.address) {
        setRoute([]);
        return;
      }

      try {
        const data = await getDistanceTime(pickup.address, destination.address);

        // ORS returns [lng, lat]
        // Leaflet expects [lat, lng]
        const coordinates = data.route.map(([lng, lat]) => [lat, lng]);

        setRoute(coordinates);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoute();
  }, [pickup, destination]);

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white px-8 lg:px-12">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col pt-8 lg:pt-10">
        <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
          Go anywhere with
          <span className="block">Uber</span>
        </h1>

        <div className="mt-8 flex flex-col items-start space-y-4">
          <Button variant="outline" size="icon">
            <CarFront size={26} />
          </Button>

          <span className="text-lg font-medium">Ride</span>

          <RideBookingCard
            pickup={pickup}
            setPickup={setPickup}
            destination={destination}
            setDestination={setDestination}
          />
        </div>
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

            {/* Current Location */}
            <Marker position={mapCenter} icon={customIcon}>
              <Popup>Current Location</Popup>
            </Marker>

            {/* Pickup */}
            {pickup.lat && (
              <Marker position={[pickup.lat, pickup.lng]}>
                <Popup>Pickup Location</Popup>
              </Marker>
            )}

            {/* Destination */}
            {destination.lat && (
              <Marker position={[destination.lat, destination.lng]}>
                <Popup>Destination</Popup>
              </Marker>
            )}

            {/* Route */}
            {route.length > 0 && (
              <Polyline
                positions={route}
                pathOptions={{
                  color: "#000",
                  weight: 5,
                }}
              />
            )}

            <MapController center={mapCenter} route={route} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default HeroMap;
