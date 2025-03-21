"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useReports } from "@/hooks/api/useReports";
import { processReports } from "@/utils/trending.reports";
import Error from "./Error";
import AnalyticsHeader from "./Analytics.Header";
import SearchFilter from "./Search.Filter";
import GridLayout from "./Grid.Layout";
import MapLayout from "./Map.Layout";
import { CrimeReport } from "@/components/global/crime-report-card/types";
import Loading from "./Loading";
import { useLocation } from "@/hooks/useLocation";

import {
  Filter,
  Statistics,
  Report,
  ViewType,
  DEFAULT_FILTER,
} from "@/types/trending.type";

export default function CrimeReportsViewer() {
  const { getAlgorithmicReports } = useReports();
  const {
    data: { data: reports = [] } = {},
    isLoading,
    error,
  } = getAlgorithmicReports || {};

  const [view, setView] = useState<ViewType>("grid");
  const [filter, setFilter] = useState<Filter>(DEFAULT_FILTER);
  const { divisions, districts, fetchDistricts } = useLocation();
  const [reportsWithLocation, setReportsWithLocation] = useState<Report[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const [statistics, setStatistics] = useState<Statistics>({
    totalReports: 0,
    crimeTypes: {},
    recentTrend: 0,
  });

  useEffect(() => {
    if (filter.division) {
      fetchDistricts(filter.division);
    }
  }, [filter.division]);

  useEffect(() => {
    if (!isLoading && reports?.length > 0) {
      const crimeTypes: Record<string, number> = {};
      const processedReports = processReports(reports);

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
        if (
          filter?.division?.name &&
          report.division?.toLowerCase() !==
            filter?.division?.name.toLowerCase()
        )
          return false;
        if (
          filter.district &&
          report?.district?.toLowerCase() !== filter?.district?.toLowerCase()
        )
          return false;

        if (filter.crimeType?.trim() && report.crimeType !== filter.crimeType)
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
      division: null,
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
