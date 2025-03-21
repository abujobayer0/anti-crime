"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useReports } from "@/hooks/api/useReports";
import { fallbackCoordinates } from "@/utils/trending.reports";
import Error from "./Error";
import AnalyticsHeader from "./Analytics.Header";
import SearchFilter from "./Search.Filter";
import GridLayout from "./Grid.Layout";
import MapLayout from "./Map.Layout";
import { CrimeReport } from "@/components/global/crime-report-card/types";
import Loading from "./Loading";

interface Report {
  title?: string;
  description?: string;
  division?: string;
  district?: string;
  crimeType?: string;
  postTime?: string;
  crimeTime?: string;
  districtCoordinates?: string[];
  algorithmScore?: number;
  severity?: number;
  upvotes?: any[];
  comments?: any[];
  location?: {
    lat: number;
    lng: number;
  };
}

interface Statistics {
  totalReports: number;
  crimeTypes: Record<string, number>;
  recentTrend: number;
}

interface Filter {
  division: string;
  district: string;
  timeRange: "all" | "week" | "month" | "quarter";
  sortBy: "algorithmScore" | "recent" | "engagement" | "severity";
  searchQuery: string;
  crimeType: string;
}

export default function CrimeReportsViewer() {
  const { getAlgorithmicReports } = useReports();
  const {
    data: { data: reports = [] } = {},
    isLoading,
    error,
  } = getAlgorithmicReports || {};

  const [view, setView] = useState<"grid" | "map">("grid");
  const [filter, setFilter] = useState<Filter>({
    division: "",
    district: "",
    timeRange: "all",
    sortBy: "algorithmScore",
    searchQuery: "",
    crimeType: "",
  });
  const [divisions, setDivisions] = useState<{ id: string; name: string }[]>(
    []
  );
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>(
    []
  );
  const [reportsWithLocation, setReportsWithLocation] = useState<Report[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const [statistics, setStatistics] = useState<Statistics>({
    totalReports: 0,
    crimeTypes: {},
    recentTrend: 0,
  });

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await fetch(
          "https://bdapi.vercel.app/api/v.1/division"
        );
        if (!response.ok) {
          console.error(`API responded with status: ${response.status}`);
          return;
        }
        const data = await response.json();
        setDivisions(data.data);
      } catch (error) {
        console.error("Error fetching divisions:", error);
        setTimeout(fetchDivisions, 3000);
      }
    };

    fetchDivisions();
  }, []);

  // Fetch districts when division changes with error handling
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!filter.division) return;

      try {
        const response = await fetch(
          `https://bdapi.vercel.app/api/v.1/district/${filter.division}`
        );
        if (!response.ok) {
          console.error(`API responded with status: ${response.status}`);
          return;
        }
        const data = await response.json();
        setDistricts(data.data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, [filter.division]);

  // Process reports to add location data and extract crime types
  useEffect(() => {
    if (!isLoading && reports?.length > 0) {
      const crimeTypes: Record<string, number> = {};

      const processedReports = reports.map((report: CrimeReport) => {
        if (report.crimeType) {
          crimeTypes[report.crimeType] =
            (crimeTypes[report.crimeType] || 0) + 1;
        }

        // Process coordinates
        if (report.districtCoordinates && report.districtCoordinates[0]) {
          const coordinates = report.districtCoordinates[0].split(",");
          if (coordinates.length >= 2) {
            return {
              ...report,
              location: {
                lat: parseFloat(coordinates[0]),
                lng: parseFloat(coordinates[1]),
              },
            };
          }
        }

        // Use fallback coordinates if no valid ones
        if (report.district) {
          const districtKey = report.district.toLowerCase();
          // Check if the district is a valid key in fallbackCoordinates
          if (districtKey in fallbackCoordinates) {
            const fallback =
              fallbackCoordinates[
                districtKey as keyof typeof fallbackCoordinates
              ];
            return {
              ...report,
              location: {
                lat: fallback.lat,
                lng: fallback.lng,
              },
            };
          }
        }

        return report;
      });

      const now = new Date();
      const last7Days = reports.filter((report: CrimeReport) => {
        const reportDate = new Date(
          report.postTime || report.crimeTime || new Date().toISOString()
        );
        return (
          (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24) <= 7
        );
      }).length;

      const previous7Days = reports.filter((report: CrimeReport) => {
        const reportDate = new Date(
          report.postTime || report.crimeTime || new Date().toISOString()
        );
        const daysDiff =
          (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff > 7 && daysDiff <= 14;
      }).length;

      const trendPercentage =
        previous7Days > 0
          ? ((last7Days - previous7Days) / previous7Days) * 100
          : 0;

      setStatistics({
        totalReports: reports.length,
        crimeTypes,
        recentTrend: trendPercentage,
      });

      setReportsWithLocation(processedReports);
    }
  }, [reports, isLoading]);

  const uniqueCrimeTypes = useMemo(() => {
    if (!reportsWithLocation.length) return [];
    return [
      ...new Set(
        reportsWithLocation
          .filter((report) => report.crimeType)
          .map((report) => report.crimeType)
      ),
    ];
  }, [reportsWithLocation]);

  const filteredReports = useMemo(() => {
    if (isLoading || !reportsWithLocation.length) return [];

    return reportsWithLocation
      .filter((report) => {
        if (filter.division && report.division !== filter.division)
          return false;
        if (filter.district && report.district !== filter.district)
          return false;
        if (filter.crimeType && report.crimeType !== filter.crimeType)
          return false;

        if (filter.timeRange !== "all") {
          const reportDate = new Date(
            report.postTime || report.crimeTime || new Date().toISOString()
          );
          const now = new Date();
          const daysDiff =
            (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24);

          if (filter.timeRange === "week" && daysDiff > 7) return false;
          if (filter.timeRange === "month" && daysDiff > 30) return false;
          if (filter.timeRange === "quarter" && daysDiff > 90) return false;
        }

        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase();
          const searchableText = `${report?.title || ""} ${
            report?.description || ""
          } ${report?.division || ""} ${report?.district || ""} ${
            report?.crimeType || ""
          }`.toLowerCase();
          if (!searchableText.includes(query)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filter.sortBy) {
          case "algorithmScore":
            return (b.algorithmScore || 0) - (a.algorithmScore || 0);
          case "recent":
            return (
              new Date(
                b.postTime || b.crimeTime || new Date().toISOString()
              ).getTime() -
              new Date(
                a.postTime || a.crimeTime || new Date().toISOString()
              ).getTime()
            );
          case "engagement":
            const engagementA =
              (a.upvotes?.length || 0) + (a.comments?.length || 0);
            const engagementB =
              (b.upvotes?.length || 0) + (b.comments?.length || 0);
            return engagementB - engagementA;
          case "severity":
            return (b.severity || 0) - (a.severity || 0);
          default:
            return 0;
        }
      });
  }, [reportsWithLocation, filter, isLoading]);

  const resetFilters = () => {
    setFilter({
      division: "",
      district: "",
      timeRange: "all",
      sortBy: "algorithmScore",
      searchQuery: "",
      crimeType: "",
    });
    setIsFilterExpanded(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <AnalyticsHeader statistics={statistics} />
      <SearchFilter
        view={view}
        setFilter={setFilter}
        setView={setView}
        setIsFilterExpanded={setIsFilterExpanded}
        isFilterExpanded={isFilterExpanded}
        resetFilters={resetFilters}
        districts={districts}
        divisions={divisions}
        filter={filter}
        filteredReports={filteredReports}
        uniqueCrimeTypes={uniqueCrimeTypes}
      />

      {view === "grid" ? (
        <GridLayout
          resetFilters={resetFilters}
          filteredReports={filteredReports}
        />
      ) : (
        <MapLayout filteredReports={filteredReports} />
      )}
    </main>
  );
}
