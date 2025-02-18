import React from "react";

const CrimeReportCardSkeleton = () => {
  return (
    <div className="flex flex-col max-w-screen-md w-full mx-auto rounded-xl bg-white shadow-sm animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/60">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded mt-1" />
          </div>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded" />
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
      </div>

      {/* Images */}
      <div className="grid grid-cols-2 gap-2 p-6">
        <div className="h-32 bg-gray-200 rounded" />
        <div className="h-32 bg-gray-200 rounded" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-6">
        <div className="flex gap-4">
          <div className="h-8 w-16 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
        <div className="h-8 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default CrimeReportCardSkeleton;
