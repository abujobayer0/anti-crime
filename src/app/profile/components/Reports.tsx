import React from "react";
import ReportCard from "./ReportCard";
import { useReports } from "@/hooks";

const Reports = ({ reports }: { reports: any }) => {
  const { updateReport } = useReports();
  return (
    <div className="grid gap-6">
      {reports?.map((report: any) => (
        <ReportCard
          key={report._id}
          report={report}
          onUpdate={updateReport.mutate}
        />
      ))}
    </div>
  );
};

export default Reports;
