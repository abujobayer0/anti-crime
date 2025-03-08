import React from "react";
import { TimeDistribution as TypeTimeDistribution } from "../types";

const TimeDistribution = ({
  timeDistribution,
  maxTimeCount,
  totalReports,
}: {
  timeDistribution: TypeTimeDistribution;
  maxTimeCount: number;
  totalReports: number;
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-700 to-fuchsia-800 px-3 py-2 flex justify-between items-center">
        <h3 className="text-white font-semibold text-sm">Time Distribution</h3>
        <span className="text-xs text-purple-100 bg-purple-800/50 px-2 py-0.5 rounded-full">
          24h Analysis
        </span>
      </div>

      <div className="p-3 space-y-2">
        {/* Time distribution bars with percentage indicators */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 w-14">
              Morning
            </span>
            <div className="relative flex-1 h-6 bg-slate-100 rounded-md overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-md"
                style={{
                  width: maxTimeCount
                    ? `${(timeDistribution.morning / maxTimeCount) * 100}%`
                    : "0%",
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <span className="text-xs font-medium text-slate-600">
                  {timeDistribution.morning}
                </span>
                <span className="text-xs font-medium text-slate-600">
                  {Math.round((timeDistribution.morning / totalReports) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 w-14">
              Afternoon
            </span>
            <div className="relative flex-1 h-6 bg-slate-100 rounded-md overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-md"
                style={{
                  width: maxTimeCount
                    ? `${(timeDistribution.afternoon / maxTimeCount) * 100}%`
                    : "0%",
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <span className="text-xs font-medium text-slate-600">
                  {timeDistribution.afternoon}
                </span>
                <span className="text-xs font-medium text-slate-600">
                  {Math.round(
                    (timeDistribution.afternoon / totalReports) * 100
                  )}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 w-14">
              Evening
            </span>
            <div className="relative flex-1 h-6 bg-slate-100 rounded-md overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-md"
                style={{
                  width: maxTimeCount
                    ? `${(timeDistribution.evening / maxTimeCount) * 100}%`
                    : "0%",
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <span className="text-xs font-medium text-slate-600">
                  {timeDistribution.evening}
                </span>
                <span className="text-xs font-medium text-slate-600">
                  {Math.round((timeDistribution.evening / totalReports) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 w-14">
              Night
            </span>
            <div className="relative flex-1 h-6 bg-slate-100 rounded-md overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-md"
                style={{
                  width: maxTimeCount
                    ? `${(timeDistribution.night / maxTimeCount) * 100}%`
                    : "0%",
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-between px-2">
                <span className="text-xs font-medium text-text-white">
                  {timeDistribution.night}
                </span>
                <span className="text-xs font-medium text-white">
                  {Math.round((timeDistribution.night / totalReports) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeDistribution;
