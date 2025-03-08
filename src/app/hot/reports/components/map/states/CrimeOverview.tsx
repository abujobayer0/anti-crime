import React from "react";

const CrimeOverview = ({
  totalReports,
  uniqueLocations,
  low,
  medium,
  high,
}: any) => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-3 py-2 flex justify-between items-center">
        <h3 className="text-white font-semibold text-sm">Crime Overview</h3>
        <span className="text-xs text-blue-100 bg-blue-800/50 px-2 py-0.5 rounded-full">
          {totalReports} Reports
        </span>
      </div>

      <div className="p-3">
        {/* Summary Stats - Horizontal Layout */}
        <div className="flex justify-between mb-3 gap-1">
          <div className="flex-1 bg-white rounded-lg p-2 shadow-sm border border-slate-100 text-center">
            <span className="text-indigo-500 text-xs font-medium block">
              Reports
            </span>
            <span className="text-lg font-bold text-gray-800">
              {totalReports}
            </span>
          </div>
          <div className="flex-1 bg-white rounded-lg p-2 shadow-sm border border-slate-100 text-center">
            <span className="text-indigo-500 text-xs font-medium block">
              Locations
            </span>
            <span className="text-lg font-bold text-gray-800">
              {uniqueLocations}
            </span>
          </div>
          <div className="flex-1 bg-white rounded-lg p-2 shadow-sm border border-slate-100 text-center">
            <span className="text-indigo-500 text-xs font-medium block">
              Severity
            </span>
            <span className="text-lg font-bold text-gray-800">
              {totalReports > 0
                ? Math.round(
                    (high * 130 + medium * 100 + low * 50) / totalReports
                  )
                : 0}
            </span>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-xs font-semibold text-slate-600">
              Severity Distribution
            </h4>
          </div>

          {/* Horizontal Distribution Bar */}
          <div className="h-6 flex rounded-md overflow-hidden">
            <div
              className="bg-red-500 flex items-center justify-center"
              style={{
                width: totalReports ? `${(high / totalReports) * 100}%` : "0%",
              }}
            >
              <span className="text-xs text-white font-medium">{high}</span>
            </div>
            <div
              className="bg-amber-500 flex items-center justify-center"
              style={{
                width: totalReports
                  ? `${(medium / totalReports) * 100}%`
                  : "0%",
              }}
            >
              <span className="text-xs text-white font-medium">{medium}</span>
            </div>
            <div
              className="bg-emerald-500 flex items-center justify-center"
              style={{
                width: totalReports ? `${(low / totalReports) * 100}%` : "0%",
              }}
            >
              <span className="text-xs text-white font-medium">{low}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-between mt-1 text-xs text-slate-600">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
              <span>High</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-amber-500 mr-1"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-emerald-500 mr-1"></div>
              <span>Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrimeOverview;
