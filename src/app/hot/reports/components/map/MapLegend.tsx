export const MapLegend = () => (
  <div className="absolute bottom-6 left-6 bg-white bg-opacity-90 backdrop-blur-sm p-3 rounded-lg shadow-lg z-50">
    <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase">
      Severity
    </h4>
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
        <span className="text-sm text-gray-700">High Severity</span>
      </div>
      <div className="flex items-center">
        <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
        <span className="text-sm text-gray-700">Medium Severity</span>
      </div>
      <div className="flex items-center">
        <span className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></span>
        <span className="text-sm text-gray-700">Low Severity</span>
      </div>
    </div>
  </div>
);
