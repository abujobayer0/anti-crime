import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const RecentReportCardSkeleton = () => {
  return (
    <div className="flex gap-2 p-2 rounded-md animate-pulse">
      <Skeleton className="w-12 h-12 rounded-md" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex items-center gap-2 mt-1">
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
};

export default RecentReportCardSkeleton;
