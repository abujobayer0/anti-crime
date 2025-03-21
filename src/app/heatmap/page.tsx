"use client";

import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import type { MapContainerProps } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  AlertTriangle,
  Info,
  Filter,
  Layers,
  AlertCircle,
  ChevronDown,
  Search,
  Thermometer,
} from "lucide-react";
import { SelectComponent } from "@/components/global/select-component";
import { SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/api/useReports";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const HeatmapLayer = dynamic(
  () => import("@/components/global/heatmap/HeatMap"),
  { ssr: false }
);

interface CrimeReport {
  _id: string;
  location: {
    lat: number;
    lng: number;
  };
  division: string;
  district: string;
  crimeTime: string;
  title: string;
  description: string;
  userId: {
    name: string;
  };
  images: string[];
}

const MapController = ({ coordinates }: { coordinates: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(coordinates, map.getZoom(), {
      duration: 1.5,
      easeLinearity: 0.25,
    });
  }, [coordinates, map]);

  return null;
};

const HeatmapPage = () => {
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [divisions, setDivisions] = useState<any>([]);
  const [districts, setDistricts] = useState<any>([]);
  const [selectedDivision, setSelectedDivision] = useState<any>("");
  const [selectedDistrict, setSelectedDistrict] = useState<any>("");
  const [currentMapStyle, setCurrentMapStyle] = useState("standard");
  const [timeFilter, setTimeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const { getReports } = useReports();
  const { data: reportsData, isLoading: isReportsLoading } = getReports;

  const [currentMapCenter, setCurrentMapCenter] = useState<[number, number]>([
    23.8103, 90.4125,
  ]);
  const [mapZoom, setMapZoom] = useState(7);
  const [crimeStats, setCrimeStats] = useState({
    total: 0,
    recentWeek: 0,
    recentMonth: 0,
    highDensityAreas: 0,
  });

  useEffect(() => {
    const ac = new AbortController();
    if (reportsData?.data) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const divisionsResponse = await fetch(
            "https://bdapi.vercel.app/api/v.1/division",
            { signal: ac.signal }
          );
          const divisionsData = await divisionsResponse.json();

          const reportsWithLocation = reportsData?.data?.map((report: any) => {
            return {
              ...report,
              location: {
                lat: parseFloat(report.districtCoordinates[0]?.split(",")[0]),
                lng: parseFloat(report.districtCoordinates[0]?.split(",")[1]),
              },
            };
          });

          setReports(reportsWithLocation);
          setDivisions(divisionsData.data);

          // Calculate statistics
          const now = new Date();
          const lastWeek = new Date(now);
          lastWeek.setDate(now.getDate() - 7);
          const lastMonth = new Date(now);
          lastMonth.setMonth(now.getMonth() - 1);

          const recentWeekCount = reportsWithLocation.filter(
            (report: CrimeReport) => new Date(report.crimeTime) >= lastWeek
          ).length;

          const recentMonthCount = reportsWithLocation.filter(
            (report: CrimeReport) => new Date(report.crimeTime) >= lastMonth
          ).length;

          // Group reports by location to find high density areas
          const locationCounts = reportsWithLocation.reduce(
            (acc: any, report: CrimeReport) => {
              const key = `${report.location.lat.toFixed(
                2
              )},${report.location.lng.toFixed(2)}`;
              acc[key] = (acc[key] || 0) + 1;
              return acc;
            },
            {}
          );

          const highDensityCount = Object.values(locationCounts).filter(
            (count: any) => count >= 8
          ).length;

          setCrimeStats({
            total: reportsWithLocation.length,
            recentWeek: recentWeekCount,
            recentMonth: recentMonthCount,
            highDensityAreas: highDensityCount,
          });

          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };

      fetchData();
    }
    return () => ac.abort();
  }, [reportsData?.data]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedDivision) return;

      try {
        setLoading(true);
        const response = await fetch(
          `https://bdapi.vercel.app/api/v.1/district/${selectedDivision.id}`
        );
        const data = await response.json();
        setDistricts(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching districts:", error);
        setLoading(false);
      }
    };

    if (selectedDivision && selectedDivision !== "all") {
      fetchDistricts();
    } else {
      setDistricts([]);
    }
  }, [selectedDivision]);

  // Get current date for time filtering
  const now = new Date();
  const lastWeek = new Date(now);
  lastWeek.setDate(now.getDate() - 7);
  const lastMonth = new Date(now);
  lastMonth.setMonth(now.getMonth() - 1);

  // Update the filter logic to handle time filters
  const filteredReports = reports.filter((report) => {
    if (
      selectedDivision &&
      selectedDivision !== "all" &&
      report.division.toLowerCase() !== selectedDivision.name.toLowerCase()
    )
      return false;

    // District filter
    if (
      selectedDistrict &&
      selectedDistrict !== "all" &&
      report.district.toLowerCase() !== selectedDistrict.toLowerCase()
    )
      return false;

    // Time filter
    if (timeFilter !== "all") {
      const reportDate = new Date(report.crimeTime);

      if (timeFilter === "week" && reportDate < lastWeek) return false;
      if (timeFilter === "month" && reportDate < lastMonth) return false;
    }

    return true;
  });

  // Transform reports data for heatmap
  const heatmapData = {
    data: filteredReports.map((report) => ({
      lat: report.location.lat,
      lng: report.location.lng,
      value: 1,
      report: {
        title: report.title,
        images: report.images,
        description: report.description.substring(0, 100) + "...",
        time: new Date(report.crimeTime).toLocaleString(),
        location: `${report.district}, ${report.division}`,
        _id: report._id,
        crimeTime: report.crimeTime,
        userId: {
          name: report.userId.name,
        },
      },
    })),
  };

  // Handle division selection
  const handleDivisionChange = (value: any) => {
    setSelectedDivision(value);
    setSelectedDistrict("");

    if (value === "all") {
      setCurrentMapCenter([23.8103, 90.4125]);
      setMapZoom(7);
      return;
    }
  };

  // Handle district selection
  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);

    if (value === "all") {
      const selectedDistrictData: any = districts.find(
        (dist: any) => dist.name.toLowerCase() === value.toLowerCase()
      );
      if (selectedDistrictData) {
        setCurrentMapCenter([
          selectedDistrictData.lat,
          selectedDistrictData.lon,
        ]);
        setMapZoom(11);
      }
    }
  };

  // Handle map style change
  const handleMapStyleChange = (style: string) => {
    setCurrentMapStyle(style);
  };

  // Handle time filter change
  const handleTimeFilterChange = (time: string) => {
    setTimeFilter(time);
  };

  // Get map tile layer based on style
  const getMapTileLayer = () => {
    switch (currentMapStyle) {
      case "dark":
        return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
      case "satellite":
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      default:
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }
  };

  // Update MapContainer props
  const mapContainerProps: MapContainerProps = {
    center: currentMapCenter,
    zoom: mapZoom,
    style: { width: "100%", height: "100%" },
    zoomControl: false,
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedDivision("");
    setSelectedDistrict("");
    setTimeFilter("all");
    setCurrentMapStyle("standard");
    setCurrentMapCenter([23.8103, 90.4125]);
    setMapZoom(7);
  };

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="p-2">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Thermometer className="h-6 w-6 text-red-500" />
              Crime Heatmap Analysis
            </h2>
            <p className="text-muted-foreground">
              Visualize crime density across Bangladesh with advanced heat
              mapping
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            {loading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="px-3 py-1 flex items-center gap-1 bg-gray-100"
                >
                  <AlertCircle className="h-3 w-3" />
                  <span>Total: {crimeStats.total}</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="px-3 py-1 flex items-center gap-1 bg-blue-50"
                >
                  <Info className="h-3 w-3" />
                  <span>Week: {crimeStats.recentWeek}</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="px-3 py-1 flex items-center gap-1 bg-red-50"
                >
                  <AlertTriangle className="h-3 w-3" />
                  <span>Hotspots: {crimeStats.highDensityAreas}</span>
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <Tabs defaultValue="location" className="w-full">
            <TabsList className="grid grid-cols-2 w-full md:w-80">
              <TabsTrigger value="location" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </TabsTrigger>
              <TabsTrigger value="filters" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="location" className="mt-2 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center relative z-40 gap-2 bg-muted/30 px-3 py-2 rounded-lg">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <SelectComponent
                    selectValue="Select Division"
                    value={selectedDivision}
                    onValueChange={handleDivisionChange}
                    content={
                      <>
                        <SelectItem value="all">All Divisions</SelectItem>
                        {divisions.map((div: any) => (
                          <SelectItem key={div.id} value={div}>
                            {div.name}
                          </SelectItem>
                        ))}
                      </>
                    }
                  />
                </div>

                <div className="flex items-center relative z-40 gap-2 bg-muted/30 px-3 py-2 rounded-lg">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <SelectComponent
                    selectValue="Select District"
                    value={selectedDistrict}
                    onValueChange={handleDistrictChange}
                    disabled={!selectedDivision || selectedDivision === "all"}
                    content={
                      <>
                        <SelectItem value="all">All Districts</SelectItem>
                        {districts.map((dist: any) => (
                          <SelectItem
                            key={dist.id}
                            value={dist.name.toLowerCase()}
                          >
                            {dist.name}
                          </SelectItem>
                        ))}
                      </>
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="filters" className="mt-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center relative z-30 gap-2 bg-muted/30 px-3 py-2 rounded-lg">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  <SelectComponent
                    selectValue="Map Style"
                    value={currentMapStyle}
                    onValueChange={handleMapStyleChange}
                    content={
                      <>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="dark">Dark Mode</SelectItem>
                        <SelectItem value="satellite">Satellite</SelectItem>
                      </>
                    }
                  />
                </div>

                <div className="flex items-center relative z-30 gap-2 bg-muted/30 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <SelectComponent
                    selectValue="Time Period"
                    value={timeFilter}
                    onValueChange={handleTimeFilterChange}
                    content={
                      <>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="week">Past Week</SelectItem>
                        <SelectItem value="month">Past Month</SelectItem>
                      </>
                    }
                  />
                </div>

                <Button
                  variant="outline"
                  className="bg-gray-50"
                  onClick={resetFilters}
                >
                  Reset All
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-end">
            <Badge
              variant={
                filteredReports.length === 0
                  ? "destructive"
                  : filteredReports.length < reports.length / 2
                  ? "outline"
                  : "default"
              }
              className="px-3 py-1"
            >
              Showing {filteredReports.length} of {reports.length} reports
            </Badge>
          </div>
        </div>
      </div>

      <Card className="relative overflow-hidden rounded-xl shadow-md border border-border/40">
        <div className="absolute top-4 right-4 z-[1000]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-white/90 backdrop-blur-sm shadow-md flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                <span>Map Legend</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h3 className="font-medium text-base">Crime Density Guide</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-full h-6 rounded-md"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(0, 153, 255, 0.7), rgba(0, 204, 255, 0.8), rgba(255, 237, 0, 0.8), rgba(255, 153, 0, 0.85), rgba(255, 0, 0, 0.9), rgba(179, 0, 0, 0.95))",
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>

                  <div className="pt-2 border-t">
                    <h4 className="font-medium text-sm mb-2">Markers</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-sm bg-red-600"></div>
                        <span className="text-sm">
                          High density (15+ incidents)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-sm bg-orange-500"></div>
                        <span className="text-sm">
                          Medium-high (8-14 incidents)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-sm bg-yellow-400"></div>
                        <span className="text-sm">Medium (4-7 incidents)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-sm bg-green-400"></div>
                        <span className="text-sm">
                          Low-medium (2-3 incidents)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-sm bg-blue-400"></div>
                        <span className="text-sm">Low (1 incident)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <h4 className="font-medium text-sm mb-2">About This Map</h4>
                    <p className="text-sm text-gray-600">
                      This heatmap visualizes crime report density across
                      Bangladesh. Areas with higher concentration of incidents
                      appear in warmer colors (red, orange), while areas with
                      fewer reports appear in cooler colors (blue, green).
                    </p>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {loading || isReportsLoading ? (
          <div className="h-[600px] flex items-center justify-center">
            <div className="space-y-4 text-center">
              <Skeleton className="h-32 w-32 rounded-full mx-auto" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48 mx-auto" />
                <Skeleton className="h-4 w-36 mx-auto" />
              </div>
              <p className="text-muted-foreground">Loading map data...</p>
            </div>
          </div>
        ) : (
          <div className="h-[600px] relative z-10 w-full">
            <MapContainer {...mapContainerProps}>
              <TileLayer
                url={getMapTileLayer()}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <HeatmapLayer data={heatmapData} />
              <MapController coordinates={currentMapCenter} />
            </MapContainer>
          </div>
        )}

        {filteredReports.length === 0 && !loading && !isReportsLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center p-6 max-w-md">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No Crime Reports Found
              </h3>
              <p className="text-gray-600 mb-4">
                There are no crime reports matching your current filters. Try
                adjusting your location or time period filters.
              </p>
              <Button onClick={resetFilters}>Reset All Filters</Button>
            </div>
          </div>
        )}
      </Card>

      <div className="text-sm text-gray-500 text-center">
        Data is sourced from user-reported crime incidents and may not represent
        official crime statistics. Last updated:{" "}
        {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default HeatmapPage;
