import React from "react";
import { TimeDistribution } from "../types";

const TimeAnalysis = ({
  timeDistribution,
  totalReports,
}: {
  timeDistribution: TimeDistribution;
  totalReports: number;
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 px-3 py-2 flex justify-between items-center">
        <h3 className="text-white font-semibold text-sm">Time Analysis</h3>
        <span className="text-xs text-emerald-100 bg-emerald-800/50 px-2 py-0.5 rounded-full">
          Clock View
        </span>
      </div>

      <div className="p-3">
        <div className="flex justify-center mb-2">
          <div className="relative w-32 h-32">
            {/* Base Clock Face */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer rim */}
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="white"
                stroke="#e2e8f0"
                strokeWidth="2"
              />

              {/* Inner fill */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="#f8fafc"
                stroke="#e2e8f0"
                strokeWidth="1"
              />

              {/* Clock hour marks */}
              {[...Array(12)].map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="10"
                  x2="50"
                  y2="15"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  transform={`rotate(${i * 30} 50 50)`}
                />
              ))}

              {/* Time segments */}
              {/* Morning: 5am-12pm (75-0 degrees) */}
              <path
                d={`M 50 50 L ${50 + 40 * Math.cos((Math.PI * 75) / 180)} ${
                  50 - 40 * Math.sin((Math.PI * 75) / 180)
                } A 40 40 0 0 1 50 10 L 50 50`}
                fill="rgba(96, 165, 250, 0.7)"
                stroke="#60a5fa"
                strokeWidth="1"
                opacity={timeDistribution.morning / totalReports}
              />

              {/* Afternoon: 12pm-5pm (0-75 degrees) */}
              <path
                d={`M 50 50 L 90 50 A 40 40 0 0 1 ${
                  50 + 40 * Math.cos((Math.PI * 75) / 180)
                } ${50 + 40 * Math.sin((Math.PI * 75) / 180)} L 50 50`}
                fill="rgba(251, 191, 36, 0.7)"
                stroke="#fbbf24"
                strokeWidth="1"
                opacity={timeDistribution.afternoon / totalReports}
              />

              {/* Evening: 5pm-9pm (75-135 degrees) */}
              <path
                d={`M 50 50 L ${50 + 40 * Math.cos((Math.PI * 75) / 180)} ${
                  50 + 40 * Math.sin((Math.PI * 75) / 180)
                } A 40 40 0 0 1 ${50 - 40 * Math.cos((Math.PI * 45) / 180)} ${
                  50 + 40 * Math.sin((Math.PI * 45) / 180)
                } L 50 50`}
                fill="rgba(251, 146, 60, 0.7)"
                stroke="#fb923c"
                strokeWidth="1"
                opacity={timeDistribution.evening / totalReports}
              />

              {/* Night: 9pm-5am (135-75+360 degrees) */}
              <path
                d={`M 50 50 L ${50 - 40 * Math.cos((Math.PI * 45) / 180)} ${
                  50 + 40 * Math.sin((Math.PI * 45) / 180)
                } A 40 40 0 1 1 ${50 + 40 * Math.cos((Math.PI * 75) / 180)} ${
                  50 - 40 * Math.sin((Math.PI * 75) / 180)
                } L 50 50`}
                fill="rgba(79, 70, 229, 0.7)"
                stroke="#4f46e5"
                strokeWidth="1"
                opacity={timeDistribution.night / totalReports}
              />

              {/* Center text */}
              <circle
                cx="50"
                cy="50"
                r="18"
                fill="white"
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-semibold fill-slate-700"
              >
                {totalReports}
              </text>
            </svg>
          </div>
        </div>

        {/* Modern legend with percentages */}
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              name: "Morning",
              color: "bg-blue-400",
              percentage:
                Math.round((timeDistribution.morning / totalReports) * 100) ||
                0,
            },
            {
              name: "Afternoon",
              color: "bg-amber-400",
              percentage:
                Math.round((timeDistribution.afternoon / totalReports) * 100) ||
                0,
            },
            {
              name: "Evening",
              color: "bg-orange-400",
              percentage:
                Math.round((timeDistribution.evening / totalReports) * 100) ||
                0,
            },
            {
              name: "Night",
              color: "bg-indigo-600",
              percentage:
                Math.round((timeDistribution.night / totalReports) * 100) || 0,
            },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between bg-white p-1 rounded-md shadow-sm"
            >
              <div className="flex items-center">
                <div
                  className={`h-3 w-3 rounded-full ${item.color} mr-2`}
                ></div>
                <span className="text-xs text-slate-600">{item.name}</span>
              </div>
              <span className="text-xs font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeAnalysis;
