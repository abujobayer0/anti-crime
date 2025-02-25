"use client";
import React from "react";
import { ReportFormProvider } from "./ReportFormContext";
import { useReportForm } from "./ReportFormContext";
import ReportHeader from "./ReportHeader";
import ReportBody from "./ReportBody";
import ReportFooter from "./ReportFooter";

type Props = {
  user: any;
};

const CreateReportCard = ({ user }: Props) => {
  const formContext = useReportForm(user);

  return (
    <div className="flex flex-col mt-4 mx-auto justify-center w-full max-w-screen-md items-center">
      <div className="bg-white w-full rounded-2xl transition-all duration-300 overflow-hidden border">
        <ReportFormProvider value={formContext}>
          <ReportHeader user={user} />
          <ReportBody />
          <ReportFooter />
        </ReportFormProvider>
      </div>
    </div>
  );
};

export default CreateReportCard;
