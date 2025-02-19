"use client";
import React from "react";
import RecentReportCard from "./RecentReportCard";
import { useReports } from "@/hooks";
import RecentReportCardSkeleton from "@/app/(app)/components/reports-list/RecentReportsSkeleton";
import { Report } from "@/types";

const RecentReports = () => {
  const { getRecentReports } = useReports();
  const { data: recentReports, isLoading } = getRecentReports;

  if (isLoading)
    return (
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <RecentReportCardSkeleton key={index} />
        ))}
      </div>
    );

  return (
    <div className="space-y-4">
      {recentReports?.data?.map((report: Report, index: number) => (
        <RecentReportCard key={index} report={report} />
      ))}
    </div>
  );
};

export default RecentReports;
