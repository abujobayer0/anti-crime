import React from "react";
import { Bookmark, AlertTriangle, Clock, MapPin, Search } from "lucide-react";

const BookmarkPageComponent = () => {
  const bookmarkedReports = [
    {
      id: 1,
      title: "Suspicious Activity on Main Street",
      description:
        "Multiple reports of suspicious individuals checking car doors in the parking lot near Main Street Plaza.",
      location: "Main Street, Downtown",
      timestamp: "2025-03-07T14:30:00",
      category: "Suspicious Activity",
      status: "Under Investigation",
      severity: "Medium",
    },
    {
      id: 2,
      title: "Break-in at Technology Store",
      description:
        "Store reported broken window and missing electronics. Security footage available.",
      location: "Westfield Mall, 3rd Floor",
      timestamp: "2025-03-08T02:15:00",
      category: "Theft",
      status: "Active",
      severity: "High",
    },
    {
      id: 3,
      title: "Vandalism at City Park",
      description:
        "Graffiti found on multiple surfaces at the central playground area. Photos submitted.",
      location: "Memorial Park, East Entrance",
      timestamp: "2025-03-06T23:45:00",
      category: "Vandalism",
      status: "Resolved",
      severity: "Low",
    },
    {
      id: 4,
      title: "Traffic Signal Malfunction",
      description:
        "Traffic light at intersection is showing green in all directions. Causing dangerous traffic conditions.",
      location: "Oak St & 5th Ave Intersection",
      timestamp: "2025-03-09T08:20:00",
      category: "Infrastructure",
      status: "In Progress",
      severity: "High",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      case "Low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-100 text-red-800";
      case "Under Investigation":
        return "bg-purple-100 text-purple-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto px-4 sm:px-4 lg:px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bookmarked Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Stay updated on cases you're following
            </p>
          </div>
          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search bookmarks..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4  gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bookmark className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Bookmarks</p>
                <p className="text-2xl font-semibold">
                  {bookmarkedReports.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">High Severity</p>
                <p className="text-2xl font-semibold">
                  {
                    bookmarkedReports.filter(
                      (report) => report.severity === "High"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Resolved</p>
                <p className="text-2xl font-semibold">
                  {
                    bookmarkedReports.filter(
                      (report) => report.status === "Resolved"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Locations</p>
                <p className="text-2xl font-semibold">
                  {
                    new Set(
                      bookmarkedReports.map(
                        (report) => report.location.split(",")[0]
                      )
                    ).size
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3  gap-6">
          {bookmarkedReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getSeverityColor(
                        report.severity
                      )}`}
                    >
                      {report.severity}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-blue-600">
                    <Bookmark className="h-5 w-5 fill-current" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {report.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {report.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{report.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{formatDate(report.timestamp)}</span>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                <span className="text-xs font-medium text-gray-500">
                  {report.category}
                </span>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {bookmarkedReports.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Bookmark className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No bookmarked reports
            </h3>
            <p className="text-gray-500 mb-4">
              When you bookmark crime reports, they will appear here for easy
              access
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Browse Reports
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkPageComponent;
