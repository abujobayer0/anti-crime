import React from "react";
import ReportCard from "./ReportCard";

const Reports = ({ reports }: { reports: any }) => {
  return (
    <div className="grid gap-6">
      {reports?.map((report: any) => (
        <ReportCard key={report._id} report={report} />
      ))}
    </div>
  );
};

export default Reports;
