import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart2,
  Calendar,
  Filter,
  Grid,
  Map,
  MapPin,
  Search,
  X,
} from "lucide-react";
import React from "react";

const SearchFilter = ({
  view,
  setView,
  filter,
  setFilter,
  isFilterExpanded,
  setIsFilterExpanded,
  divisions,
  districts,
  filteredReports,
  uniqueCrimeTypes,
  resetFilters,
}: any) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* View Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setView("grid")}
              className={`px-4 py-2 rounded-md flex items-center ${
                view === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
            >
              <Grid size={18} className="mr-1" />
              Grid
            </button>
            <button
              onClick={() => setView("map")}
              className={`px-4 py-2 rounded-md flex items-center ${
                view === "map"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
            >
              <Map size={18} className="mr-1" />
              Map
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-grow max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) =>
                setFilter({ ...filter, searchQuery: e.target.value })
              }
              placeholder="Search reports..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <Filter size={18} className="mr-2" />
            Filters
            {isFilterExpanded ? (
              <X size={16} className="ml-2" />
            ) : (
              <span className="ml-2 text-xs bg-blue-500 text-white rounded-full px-2 py-0.5">
                {
                  Object.entries(filter).filter(
                    ([key, value]) =>
                      value && key !== "sortBy" && key !== "searchQuery"
                  ).length
                }
              </span>
            )}
          </button>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-500 mb-1">Division</label>
                  <select
                    value={filter.division}
                    onChange={(e) =>
                      setFilter({
                        ...filter,
                        division: e.target.value,
                        district: "",
                      })
                    }
                    className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Divisions</option>
                    {divisions.map((div: any) => (
                      <option
                        key={div.division}
                        value={div.division.toLowerCase()}
                      >
                        {div.division.charAt(0).toUpperCase() +
                          div.division.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-500 mb-1">District</label>
                  <select
                    value={filter.district}
                    onChange={(e) =>
                      setFilter({ ...filter, district: e.target.value })
                    }
                    className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
                    disabled={!filter.division}
                  >
                    <option value="">All Districts</option>
                    {districts.map((dist: any) => (
                      <option
                        key={dist.district}
                        value={dist.district.toLowerCase()}
                      >
                        {dist.district.charAt(0).toUpperCase() +
                          dist.district.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-500 mb-1">
                    Crime Type
                  </label>
                  <select
                    value={filter.crimeType}
                    onChange={(e) =>
                      setFilter({ ...filter, crimeType: e.target.value })
                    }
                    className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Types</option>
                    {uniqueCrimeTypes.map((type: any) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-500 mb-1">
                    Time Period
                  </label>
                  <select
                    value={filter.timeRange}
                    onChange={(e) =>
                      setFilter({ ...filter, timeRange: e.target.value })
                    }
                    className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Time</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="quarter">Last 90 Days</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm text-gray-500 mb-1">Sort By</label>
                  <select
                    value={filter.sortBy}
                    onChange={(e) =>
                      setFilter({ ...filter, sortBy: e.target.value })
                    }
                    className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="algorithmScore">Relevance</option>
                    <option value="recent">Most Recent</option>
                    <option value="engagement">Most Engagement</option>
                    <option value="severity">Severity</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            <MapPin size={16} className="text-gray-500 mr-1" />
            <p className="text-sm text-gray-700">
              {filter.division ? (
                <span className="font-medium">
                  {filter.division.charAt(0).toUpperCase() +
                    filter.division.slice(1)}
                  {filter.district
                    ? ` › ${
                        filter.district.charAt(0).toUpperCase() +
                        filter.district.slice(1)
                      }`
                    : ""}
                </span>
              ) : (
                "All Locations"
              )}
            </p>

            {filter.timeRange !== "all" && (
              <>
                <span className="mx-2 text-gray-300">|</span>
                <Calendar size={16} className="text-gray-500 mr-1" />
                <p className="text-sm text-gray-700">
                  {filter.timeRange === "week"
                    ? "Last 7 Days"
                    : filter.timeRange === "month"
                    ? "Last 30 Days"
                    : "Last 90 Days"}
                </p>
              </>
            )}

            {filter.crimeType && (
              <>
                <span className="mx-2 text-gray-300">|</span>
                <AlertTriangle size={16} className="text-gray-500 mr-1" />
                <p className="text-sm text-gray-700">{filter.crimeType}</p>
              </>
            )}
          </div>
          <div className="flex items-center">
            <BarChart2 size={16} className="text-gray-500 mr-1" />
            <p className="text-sm text-gray-700">
              <span className="font-medium">{filteredReports.length}</span>{" "}
              reports found
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
