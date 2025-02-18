import CrimeReportCard from "../../crime-report-card";
import type { CrimeReport, User } from "../../crime-report-card/types";

interface ViewProps {
  reports: CrimeReport[];
  isLoading: boolean;
  user: User;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
  onVote: (props: { id: string; type: "upvote" | "downvote" }) => void;
}

export const ReportsListView = ({
  reports,
  isLoading,
  user,
  onDelete,
  onUpdate,
  onVote,
}: ViewProps) => {
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4 p-4">
      {reports?.map((report) => (
        <CrimeReportCard
          key={report._id}
          report={report}
          user={user as any}
          deleteReport={onDelete}
          updateReport={onUpdate}
          voteReport={onVote}
        />
      ))}
    </div>
  );
};
