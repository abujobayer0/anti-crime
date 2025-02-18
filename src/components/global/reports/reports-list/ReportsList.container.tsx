"use client";
import { useUser } from "@/hooks";
import { useReports } from "@/hooks/api/useReports";
import { ReportsListView } from "./ReportsList.view";

export const ReportsListContainer = () => {
  const { getReports, deleteReport, updateReport, voteReport } = useReports();
  const { data: reports, isLoading } = getReports;

  const { data: user } = useUser();

  const handleDelete = (id: string) => {
    deleteReport.mutate(id);
  };

  const handleUpdate = ({ id, data }: { id: string; data: any }) => {
    updateReport.mutate({ id, data });
  };

  const handleVote = (props: { id: string; type: "upvote" | "downvote" }) => {
    voteReport.mutate(props);
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
