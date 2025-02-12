"use client";

import CreateReportCard from "@/components/global/create-report-card";
import CrimeReportCard from "@/components/global/crime-report-card";
import React, { useEffect, useState } from "react";
import { Activity, AlertTriangle, MapPin, Clock } from "lucide-react";
import { handleAPIError } from "@/lib/Error";
import { toast } from "sonner";

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

const Page = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const deleteReport = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/v1/reports/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        toast.success("Report deleted successfully");
        setReports(reports.filter((report: any) => report._id !== id));
      }
    } catch (error) {
      handleAPIError(error);
    }
  };

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="gap-5 flex flex-col">
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
          <div className="w-80 shrink-0 md:block hidden">
            <div className="bg-card rounded-lg shadow-custom-sm p-4 sticky top-16">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="gap-5 flex flex-col">
            <CreateReportCard />
            {reports.map((report: any, index: number) => (
              <CrimeReportCard
                key={report._id || index}
                deleteReport={deleteReport}
                report={report}
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

export default Page;
