import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

const LocationSearchPanel = ({ suggestions = [], onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 25 }}
      className="bg-white rounded-2xl border mt-4 shadow-lg max-h-72 overflow-y-auto"
    >
      {suggestions.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          Start typing to search locations...
        </div>
      ) : (
        suggestions.map((place) => (
          <button
            key={`${place.lat}-${place.lng}`}
            type="button"
            onClick={() => onSelect(place)}
            className="w-full flex items-start gap-3 px-5 py-4 hover:bg-gray-100 transition text-left border-b last:border-b-0"
          >
            <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />

            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {place.display_name.split(",")[0]}
              </span>

              <span className="text-xs text-gray-500">
                {place.display_name}
              </span>
            </div>
          </button>
        ))
      )}
    </motion.div>
  );
};

export default LocationSearchPanel;
