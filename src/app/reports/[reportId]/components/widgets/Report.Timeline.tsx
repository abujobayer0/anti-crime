import { CrimeReport } from "@/components/global/crime-report-card/types";
import { formatTimeAgo } from "@/lib/report";
import { Calendar, FileText, Shield, User } from "lucide-react";
import React from "react";

const ReportTimeline = ({ report }: { report: CrimeReport }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 pb-3 border-b flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        Report Timeline
      </h3>

      <ol className="relative border-l border-gray-200 ml-3 space-y-6">
        <li className="mb-6 ml-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 ring-8 ring-white">
            <User className="w-3 h-3 text-white" />
          </span>
          <h3 className="flex items-center mb-1 text-sm font-semibold">
            Report Created
          </h3>
          <time className="block mb-2 text-xs font-normal leading-none text-gray-500">
            {formatTimeAgo(new Date(report?.createdAt))}
          </time>
        </li>
        <li className="mb-6 ml-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full -left-3 ring-8 ring-white">
            <Shield className="w-3 h-3 text-white" />
          </span>
          <h3 className="flex items-center mb-1 text-sm font-semibold">
            Under Investigation
          </h3>
          <time className="block mb-2 text-xs font-normal leading-none text-gray-500">
            {formatTimeAgo(new Date(Date.now() - 1000 * 60 * 60 * 2))}
          </time>
        </li>
        <li className="ml-6 opacity-50">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full -left-3 ring-8 ring-white">
            <FileText className="w-3 h-3 text-gray-500" />
          </span>
          <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-500">
            Case Resolution
          </h3>
          <time className="block mb-2 text-xs font-normal leading-none text-gray-500">
            Pending
          </time>
        </li>
      </ol>
    </div>
  );
};

export default ReportTimeline;
