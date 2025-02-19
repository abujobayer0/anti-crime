"use client";
import { useUser } from "@/hooks";
import CreateReportCard from "../../../../components/global/create-report-card";
import { ReportsListContainer } from "./ReportsList.container";

const ReportsList = () => {
  const { data: user } = useUser();

  return (
    <>
      <CreateReportCard user={user} />
      <ReportsListContainer />
    </>
  );
};

export default ReportsList;
