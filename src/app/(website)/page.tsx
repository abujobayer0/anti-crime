import CreateReportCard from "@/components/global/create-report-card";
import CrimeReportCard from "@/components/global/crime-report-card";
import React from "react";

const Page = () => {
  return (
    <div>
      <div className="p-5 gap-5 flex flex-col">
        <CreateReportCard />
        {[1, 1, 1, 1, 1].map((i, indx) => (
          <CrimeReportCard key={indx} />
        ))}
      </div>
    </div>
  );
};

export default Page;
