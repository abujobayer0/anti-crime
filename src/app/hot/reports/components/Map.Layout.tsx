import React from "react";
import { motion } from "framer-motion";
import MapView from "./MapView";

const MapLayout = ({ filteredReports }: any) => {
  return (
    <motion.div
      key="map-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg overflow-hidden shadow-md"
    >
      <div className="h-96 lg:h-[770px]">
        <MapView reports={filteredReports} />
      </div>
    </motion.div>
  );
};

export default MapLayout;
