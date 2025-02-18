"use client";
import React from "react";
import RecentReportCard from "./RecentReportCard";
import { useReports } from "@/hooks";
import RecentReportCardSkeleton from "@/components/global/reports/reports-list/RecentReportsSkeleton";
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
      {recentReports?.data?.map((report: any, index: any) => (
        <RecentReportCard key={index} report={report} />
      ))}
    </div>
  );
};

export default RecentReports;
