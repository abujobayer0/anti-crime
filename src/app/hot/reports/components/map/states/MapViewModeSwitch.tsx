import React from "react";

type MapMode = "standard" | "dark" | "satellite";

interface MapViewModeSwitchProps {
  currentMapMode: MapMode;
  setCurrentMapMode: (mode: MapMode) => void;
}

const MapViewModeSwitch: React.FC<MapViewModeSwitchProps> = ({
  currentMapMode,
  setCurrentMapMode,
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-3 py-2 flex justify-between items-center">
        <h3 className="text-white font-semibold text-sm">Map View</h3>
        <span className="text-xs text-gray-200 bg-gray-800/50 px-2 py-0.5 rounded-full">
          Visualization
        </span>
      </div>

      <div className="p-2">
        <div className="bg-slate-100 rounded-lg p-1 flex justify-between">
          <button
            className={`px-3 py-1 text-xs font-medium rounded-md flex-1 transition-all ${
              currentMapMode === "standard"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-600 hover:bg-white/50"
            }`}
            onClick={() => setCurrentMapMode("standard")}
          >
            Standard
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium rounded-md flex-1 transition-all ${
              currentMapMode === "dark"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-600 hover:bg-white/50"
            }`}
            onClick={() => setCurrentMapMode("dark")}
          >
            Dark
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium rounded-md flex-1 transition-all ${
              currentMapMode === "satellite"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-600 hover:bg-white/50"
            }`}
            onClick={() => setCurrentMapMode("satellite")}
          >
            Satellite
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapViewModeSwitch;
