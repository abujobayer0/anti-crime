"use client";
import { useReports } from "@/hooks/api/useReports";
import { useUser } from "@/hooks";
import { ReportDetailsView } from "./ReportDetails.view";
import { ReportDetailsSkeleton } from "../../skeletons/report-details-skeleton";

interface Props {
  reportId: string;
}

export const ReportDetailsContainer = ({ reportId }: Props) => {
  const { getReport } = useReports();
  const { data: report, isLoading } = getReport(reportId);
  const { data: user } = useUser({ reports: false });

  if (isLoading) return <ReportDetailsSkeleton />;

  return <ReportDetailsView report={report} user={user.user} />;
};
