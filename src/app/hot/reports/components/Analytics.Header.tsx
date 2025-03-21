import React from "react";
import { motion } from "framer-motion";
import { Statistics } from "@/types/trending.type";

const AnalyticsHeader = ({ statistics }: { statistics: Statistics }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Crime Reports Dashboard
      </h1>
      <p className="text-gray-600 mb-4">
        Explore incident reports across Bangladesh, powered by community
        insights
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <h3 className="text-sm text-gray-500 uppercase">Total Reports</h3>
          <p className="text-2xl font-bold">{statistics.totalReports}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <h3 className="text-sm text-gray-500 uppercase">Most Common Crime</h3>
          <p className="text-2xl font-bold">
            {Object.entries(statistics.crimeTypes).sort(
              (a: any, b: any) => b[1] - a[1]
            )[0]?.[0] || "N/A"}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
          <h3 className="text-sm text-gray-500 uppercase">7-Day Trend</h3>
          <p className="text-2xl font-bold flex items-center">
            {statistics.recentTrend > 0 ? "+" : ""}
            {statistics.recentTrend.toFixed(1)}%
            {statistics.recentTrend > 0 ? (
              <span className="text-red-500 ml-2">↑</span>
            ) : statistics.recentTrend < 0 ? (
              <span className="text-green-500 ml-2">↓</span>
            ) : null}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsHeader;
