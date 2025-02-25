"use client";
import React from "react";
import { useUser } from "@/hooks";
import { useReports } from "@/hooks/api/useReports";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import type { ViewProps } from "./ReportsList.view";
import CrimeReportCardSkeleton from "@/components/global/skeletons/report-skeleton";

const ReportsListView = dynamic<ViewProps>(
  () => import("./ReportsList.view").then((mod) => mod.ReportsListView),
  {
    loading: () => (
      <div className="space-y-4 p-4">
        <CrimeReportCardSkeleton />
        <CrimeReportCardSkeleton />
        <CrimeReportCardSkeleton />
      </div>
    ),
    ssr: false,
  }
);

export const ReportsListContainer = () => {
  const { getReports, deleteReport, updateReport, voteReport } = useReports();
  const { data: reports, isLoading } = getReports;
  const { data: user } = useUser();

  const handleDelete = React.useCallback(
    (id: string) => {
      deleteReport.mutate(id);
    },
    [deleteReport]
  );

  const handleUpdate = React.useCallback(
    ({ id, data }: { id: string; data: any }) => {
      updateReport.mutate({ id, data });
    },
    [updateReport]
  );

  const handleVote = React.useCallback(
    (props: { id: string; type: "upvote" | "downvote" }) => {
      voteReport.mutate(props);
    },
    [voteReport]
  );

  return (
    <Suspense
      fallback={
        <div className="space-y-4 p-4">
          <CrimeReportCardSkeleton />
          <CrimeReportCardSkeleton />
          <CrimeReportCardSkeleton />
        </div>
      }
    >
      <ReportsListView
        reports={reports?.data}
        isLoading={isLoading}
        user={user}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onVote={handleVote}
      />
    </Suspense>
  );
};
