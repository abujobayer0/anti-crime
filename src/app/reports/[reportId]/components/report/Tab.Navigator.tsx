import React from "react";

const TabNavigator = ({
  activeTab,
  report,
  setActiveTab,
}: {
  activeTab: string;
  report: any;
  setActiveTab: (tab: string) => void;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md mb-6 p-1 inline-flex">
      <button
        onClick={() => setActiveTab("details")}
        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          activeTab === "details"
            ? "bg-primary text-white"
            : "hover:bg-gray-100 text-gray-600"
        }`}
      >
        Report Details
      </button>
      <button
        onClick={() => setActiveTab("comments")}
        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
          activeTab === "comments"
            ? "bg-primary text-white"
            : "hover:bg-gray-100 text-gray-600"
        }`}
      >
        Comments
        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
          {report.comments.length}
        </span>
      </button>
    </div>
  );
};

export default TabNavigator;
