"use client";

import CreateReportCard from "@/components/global/create-report-card";
import CrimeReportCard from "@/components/global/crime-report-card";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/v1/reports", {
          cache: "no-store",
        });
        const data = await response.json();
        setReports(data.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className="w-full flex justify-center items-center">
      <div className="p-5 gap-5 flex justify-center items-center w-full flex-col">
        <CreateReportCard />
        {reports.map((report: any, index: number) => (
          <CrimeReportCard key={index} report={report} />
        ))}
      </div>
    </div>
  );
};

export default Page;
