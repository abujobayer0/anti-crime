"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
      <div className="relative w-full h-[300px] lg:h-[400px] bg-muted animate-pulse rounded-lg" />

      <div className="container max-w-7xl mx-auto px-4 -mt-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col items-center lg:items-start">
            <Skeleton className="w-32 h-32 rounded-full border-4 border-background" />
          </div>

          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        <div className="mt-8">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>

        <div className="mt-8 space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;
