import { CrimeReport } from "@/components/global/crime-report-card/types";
import { Shield, TrendingUp } from "lucide-react";
import React from "react";

const CrimeStatistics = ({ report }: { report: CrimeReport }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 pb-3 border-b flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        Crime Statistics
      </h3>

      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Similar Reports</span>
            <span className="font-semibold">
              {Math.floor(Math.random() * 20) + 5}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${Math.floor(Math.random() * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Area Safety Index</span>
            <span className="font-semibold">
              {Math.floor(Math.random() * 50) + 50}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-amber-500 h-2.5 rounded-full"
              style={{
                width: `${Math.floor(Math.random() * 50) + 50}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Verification Score</span>
            <span className="font-semibold">{report.upvotes.length * 10}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${report.upvotes.length * 10}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Safety Recommendations
        </h4>
        <ul className="text-sm space-y-2">
          <li className="flex items-start gap-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
            <span>Avoid {report?.district} area during late hours</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
            <span>Report suspicious activity to local authorities</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
            <span>Use well-lit routes when traveling in this area</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CrimeStatistics;
