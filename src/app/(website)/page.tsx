import CrimeReportCard from "@/components/global/crime-report-card";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <div>
      <div className="p-5 gap-5 flex flex-col">
        {[1, 1, 1, 1, 1].map((i, indx) => (
          <CrimeReportCard key={indx} />
        ))}
      </div>
    </div>
  );
};

export default Page;
