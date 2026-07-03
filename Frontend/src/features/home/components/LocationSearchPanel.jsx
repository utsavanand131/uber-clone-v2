import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

const LocationSearchPanel = ({ suggestions = [], onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 25 }}
      className="bg-white rounded-2xl border mt-4 shadow-lg overflow-hidden max-h-72 overflow-y-auto"
    >
      {suggestions.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          Start typing to search locations...
        </div>
      ) : (
        suggestions.map((place, index) => (
          <button
            key={index}
            onClick={() => onSelect(place.display_name)}
            className="w-full flex items-start gap-3 px-5 py-4 hover:bg-gray-100 transition text-left"
          >
            <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />

            <span className="text-sm">{place.display_name}</span>
          </button>
        ))
      )}
    </motion.div>
  );
};

export default LocationSearchPanel;
