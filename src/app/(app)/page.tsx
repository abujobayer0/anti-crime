"use client";

import { useReports } from "@/hooks/api/useReports";
import CrimeReportCard from "@/components/global/crime-report-card";
import CreateReportCard from "@/components/global/create-report-card";
import React from "react";
import { Activity, AlertTriangle, MapPin, Clock } from "lucide-react";
import { useUser } from "@/hooks";

interface RecentActivity {
  id: string;
  type: "report" | "alert" | "update";
  title: string;
  location: string;
  timestamp: Date;
  description: string;
}

const dummyActivities: RecentActivity[] = [
  {
    id: "1",
    type: "report",
    title: "New Crime Report: Theft in Gulshan-1",
    location: "Gulshan-1, Dhaka",
    timestamp: new Date("2024-03-21T14:30:00"),
    description:
      "A mobile phone snatching incident reported near Gulshan-1 DCC Market.",
  },
  {
    id: "2",
    type: "alert",
    title: "Security Alert: Suspicious Activity",
    location: "Banani, Dhaka",
    timestamp: new Date("2024-03-21T13:15:00"),
    description:
      "Multiple residents reported suspicious individuals monitoring parked vehicles.",
  },
  {
    id: "3",
    type: "update",
    title: "Evidence Added: Vehicle Theft Case",
    location: "Uttara Sector 4, Dhaka",
    timestamp: new Date("2024-03-21T12:45:00"),
    description:
      "New CCTV footage added to the ongoing vehicle theft investigation.",
  },
  {
    id: "4",
    type: "report",
    title: "New Crime Report: Theft in Gulshan-1",
    location: "Gulshan-1, Dhaka",
    timestamp: new Date("2024-03-21T14:30:00"),
    description:
      "A mobile phone snatching incident reported near Gulshan-1 DCC Market.",
  },
  {
    id: "5",
    type: "alert",
    title: "Security Alert: Suspicious Activity",
    location: "Banani, Dhaka",
    timestamp: new Date("2024-03-21T13:15:00"),
    description:
      "Multiple residents reported suspicious individuals monitoring parked vehicles.",
  },
  {
    id: "6",
    type: "update",
    title: "Evidence Added: Vehicle Theft Case",
    location: "Uttara Sector 4, Dhaka",
    timestamp: new Date("2024-03-21T12:45:00"),
    description:
      "New CCTV footage added to the ongoing vehicle theft investigation.",
  },
];

const HomePage = () => {
  const { getReports, deleteReport, voteReport, updateReport } = useReports();
  const { data: reports, isLoading, error } = getReports;
  const { data: user } = useUser({ reports: false });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading reports</div>;

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "report":
        return <Activity className="w-4 h-4" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4" />;
      case "update":
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: RecentActivity["type"]) => {
    switch (type) {
      case "report":
        return "text-blue-500 bg-blue-50";
      case "alert":
        return "text-red-500 bg-red-50";
      case "update":
        return "text-green-500 bg-green-50";
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="gap-5 flex flex-col">
            <CreateReportCard user={user} />
            {reports?.data?.map((report: any) => (
              <CrimeReportCard
                key={report._id}
                report={report}
                deleteReport={deleteReport}
                updateReport={updateReport}
                voteReport={voteReport}
              />
            ))}
          </div>
        </div>

        <div className="w-80 shrink-0 md:block hidden">
          <div className="bg-card rounded-lg shadow-custom-sm p-4 sticky top-16">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {dummyActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`p-1.5 rounded-lg ${getActivityColor(
                      activity.type
                    )}`}
                  >
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-gray-900">
                      {activity.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{activity.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
