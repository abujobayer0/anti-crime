"use client";
import { useUser } from "@/hooks";
import { useReports } from "@/hooks/api/useReports";
import { ReportsListView } from "./ReportsList.view";

export const ReportsListContainer = () => {
  const { data: reports, isLoading } = useReports().getReports;
  const { data: user } = useUser({ reports: false });
  const { deleteReport, updateReport, voteReport } = useReports();

  const handleDelete = (id: string) => {
    deleteReport.mutate(id);
  };

  const handleUpdate = (id: string, data: any) => {
    updateReport.mutate({ id, data });
  };

  const handleVote = (id: string, type: "upvote" | "downvote") => {
    voteReport.mutate({ id, type });
  };

  return (
    <ReportsListView
      reports={reports?.data}
      isLoading={isLoading}
      user={user}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
      onVote={handleVote}
    />
  );
};
