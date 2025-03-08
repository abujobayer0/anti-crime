import React from "react";
import { motion } from "framer-motion";
import { CrimeReport } from "@/components/global/crime-report-card/types";
import CrimeCard from "./CrimeCards";
import { AlertTriangle } from "lucide-react";

const GridLayout = ({
  filteredReports,
  resetFilters,
}: {
  filteredReports: any;
  resetFilters: () => void;
}) => {
  return (
    <motion.div
      key="grid-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {filteredReports.length > 0 ? (
        filteredReports.map((report: CrimeReport, index: number) => (
          <motion.div
            key={report._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: Math.min(index * 0.05, 0.5),
              duration: 0.3,
            }}
            className="cursor-pointer"
          >
            <CrimeCard report={report} />
          </motion.div>
        ))
      ) : (
        <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
          <AlertTriangle size={36} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700">
            No reports found
          </h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters or search criteria
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default GridLayout;
