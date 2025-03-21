"use client";
import { useReports } from "@/hooks/api/useReports";
import { useUser } from "@/hooks";
import { ReportDetailsSkeleton } from "./report-details-skeleton";
import { ReportDetailsView } from "./ReportDetails.view";

interface Props {
  reportId: string;
}

export const ReportDetailsContainer = ({ reportId }: Props) => {
  const { useReport } = useReports();
  const { data: report, isLoading } = useReport(reportId);
  const { data: user } = useUser();

  if (isLoading) return <ReportDetailsSkeleton />;

  return <ReportDetailsView report={report} user={user} relatedReports={[]} />;
};
