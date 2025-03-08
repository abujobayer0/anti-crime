import { AlertTriangle } from "lucide-react";
import React from "react";

const Error = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
      <AlertTriangle size={48} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Unable to load crime reports
      </h2>
      <p className="text-gray-600 mb-6">
        We encountered an error while fetching data. Please try again later.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );
};

export default Error;
