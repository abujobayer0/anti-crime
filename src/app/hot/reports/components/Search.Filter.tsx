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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
  const activeFilterCount = Object.entries(filter).filter(
    ([key, value]) => value && key !== "sortBy" && key !== "searchQuery"
  ).length;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            {/* View Toggle */}
            <div className="flex space-x-2">
              <Button
                onClick={() => setView("grid")}
                variant={view === "grid" ? "default" : "outline"}
                size="sm"
                className="flex items-center"
              >
                <Grid size={18} className="mr-1" />
                Grid
              </Button>
              <Button
                onClick={() => setView("map")}
                variant={view === "map" ? "default" : "outline"}
                size="sm"
                className="flex items-center"
              >
                <Map size={18} className="mr-1" />
                Map
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative flex-grow max-w-md">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <Input
                  type="text"
                  value={filter.searchQuery}
                  onChange={(e) =>
                    setFilter({ ...filter, searchQuery: e.target.value })
                  }
                  placeholder="Search reports..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <Button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Filter size={18} className="mr-2" />
              Filters
              {isFilterExpanded ? (
                <X size={16} className="ml-2" />
              ) : (
                activeFilterCount > 0 && (
                  <Badge variant="default" className="ml-2">
                    {activeFilterCount}
                  </Badge>
                )
              )}
            </Button>
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
                <Separator className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm text-gray-500">Division</label>
                    <Select
                      value={filter.division || " "}
                      onValueChange={(value) =>
                        setFilter({
                          ...filter,
                          division: value,
                          district: "",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Divisions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={" "}>All Divisions</SelectItem>
                        {divisions.map((div: any) => (
                          <SelectItem key={div.id} value={div}>
                            {div.name.charAt(0).toUpperCase() +
                              div.name.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm text-gray-500">District</label>
                    <Select
                      value={filter.district || " "}
                      onValueChange={(value) =>
                        setFilter({ ...filter, district: value })
                      }
                      disabled={!filter.division?.name}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Districts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={" "}>All Districts</SelectItem>
                        {districts.map((dist: any) => (
                          <SelectItem
                            key={dist.id}
                            value={dist.name.toLowerCase()}
                          >
                            {dist.name.charAt(0).toUpperCase() +
                              dist.name.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm text-gray-500">Crime Type</label>
                    <Select
                      value={filter.crimeType}
                      onValueChange={(value) =>
                        setFilter({ ...filter, crimeType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=" ">All Types</SelectItem>
                        {uniqueCrimeTypes.map((type: any) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm text-gray-500">Time Period</label>
                    <Select
                      value={filter.timeRange}
                      onValueChange={(value) =>
                        setFilter({ ...filter, timeRange: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                        <SelectItem value="quarter">Last 90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm text-gray-500">Sort By</label>
                    <Select
                      value={filter.sortBy}
                      onValueChange={(value) =>
                        setFilter({ ...filter, sortBy: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Relevance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="algorithmScore">
                          Relevance
                        </SelectItem>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="engagement">
                          Most Engagement
                        </SelectItem>
                        <SelectItem value="severity">Severity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={resetFilters} variant="outline" size="sm">
                    Reset All Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-between gap-y-2 pt-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <div className="flex items-center">
                <MapPin size={16} className="text-gray-500 mr-1" />
                <p className="text-sm text-gray-700">
                  {filter.division?.name ? (
                    <span className="font-medium">
                      {filter.division.name.charAt(0).toUpperCase() +
                        filter.division.name.slice(1)}
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
              </div>

              {filter.timeRange !== "all" && (
                <div className="flex items-center">
                  <Calendar size={16} className="text-gray-500 mr-1" />
                  <p className="text-sm text-gray-700">
                    {filter.timeRange === "week"
                      ? "Last 7 Days"
                      : filter.timeRange === "month"
                      ? "Last 30 Days"
                      : "Last 90 Days"}
                  </p>
                </div>
              )}

              {filter.crimeType && (
                <div className="flex items-center">
                  <AlertTriangle size={16} className="text-gray-500 mr-1" />
                  <p className="text-sm text-gray-700">
                    {filter.crimeType.charAt(0).toUpperCase() +
                      filter.crimeType.slice(1)}
                  </p>
                </div>
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
      </CardContent>
    </Card>
  );
};

export default SearchFilter;
