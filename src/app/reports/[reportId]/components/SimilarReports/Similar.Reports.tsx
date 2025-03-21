import { CrimeReport } from "@/components/global/crime-report-card/types";
import { formatTimeAgo } from "@/lib/report";
import { Eye, LocateIcon, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SimilarReports = ({
  relatedReport,
}: {
  relatedReport: CrimeReport[];
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {relatedReport.map((relatedReport, index) => (
        <Link
          href={`/reports/${relatedReport._id}`}
          key={index}
          className="block group"
        >
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 transition-all group-hover:shadow-lg group-hover:translate-y-[-4px]">
            <div className="relative aspect-square md:aspect-[4/3]">
              <Image
                src={relatedReport.images?.[0] || "/placeholder-crime.jpg"}
                alt={relatedReport.title}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="flex items-center gap-2 text-xs font-medium mb-2 text-white">
                  <LocateIcon size={12} />
                  <span>{relatedReport.division}</span>
                  <span className="mx-1">•</span>
                  <span>
                    {formatTimeAgo(new Date(relatedReport.crimeTime))}
                  </span>
                </div>
                <h3 className="font-bold text-white line-clamp-2">
                  {relatedReport.title}
                </h3>
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-blue-700 font-medium text-xs">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <MessageSquare size={14} className="text-gray-400" />
                    <span className="text-gray-500">
                      {relatedReport.comments?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={14} className="text-gray-400" />
                    <span className="text-gray-500">
                      {Math.floor(Math.random() * 100) + 50}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SimilarReports;
