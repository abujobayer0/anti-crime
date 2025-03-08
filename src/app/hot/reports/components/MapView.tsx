"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { CrimeReport } from "@/components/global/crime-report-card/types";

import {
  IVisualizationStrategy,
  LeafletStatic,
  MapViewProps,
  MarkerGroup,
  VIEW_MODES,
} from "./map/types";
import { SeverityUtil, TimeUtil } from "./map/utils";
import { MapMode, MapService } from "./map/MapService";
import { MapControls } from "./map/MapControls";
import { MapLegend } from "./map/MapLegend";
import { MarkerVisualization } from "./map/MarkerVisualization";
import { HeatmapVisualization } from "./map/HeatmapVisualization";
import MapViewModeSwitch from "./map/states/MapViewModeSwitch";
import CrimeOverview from "./map/states/CrimeOverview";
import TimeDistribution from "./map/states/TimeDistribution";
import TimeAnalysis from "./map/states/TimeAnalysis";
import { useLeaflet } from "./map/hooks/useLeaflet";
import { useMap } from "./map/hooks/useMap";
import Loading from "./map/Loading";

declare global {
  interface Window {
    L: any;
  }
}

export default function MapView({ reports }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { leaflet, isLoading } = useLeaflet();
  const [currentMapMode, setCurrentMapMode] = useState<MapMode>("standard");
  const map = useMap(
    mapRef as React.RefObject<HTMLDivElement>,
    leaflet,
    isLoading,
    currentMapMode
  );

  const [selectedReport, setSelectedReport] = useState<CrimeReport | null>(
    null
  );

  const [viewMode, setViewMode] = useState<"markers" | "heatmap">(
    VIEW_MODES.MARKERS
  );
  const [locationGroups, setLocationGroups] = useState<MarkerGroup>({});

  const visualizationRef = useRef<IVisualizationStrategy | null>(null);

  // Calculate statistics for the dashboard
  const { high, medium, low } =
    reports.length > 0
      ? SeverityUtil.countBySeverity(reports)
      : { high: 0, medium: 0, low: 0 };

  const timeDistribution =
    reports.length > 0
      ? TimeUtil.countByTimeOfDay(reports)
      : { morning: 0, afternoon: 0, evening: 0, night: 0 };

  const totalReports = reports.length;
  const uniqueLocations = Object.keys(locationGroups).length;
  const maxTimeCount = Math.max(
    timeDistribution.morning,
    timeDistribution.afternoon,
    timeDistribution.evening,
    timeDistribution.night
  );

  // Set up event listeners
  useEffect(() => {
    const handleViewReportDetails = (event: CustomEvent) => {
      const reportId = event.detail;
      const report = reports.find((r: CrimeReport) => r._id === reportId);
      if (report) {
        setSelectedReport(report);
      }
    };

    document.addEventListener(
      "viewReportDetails",
      handleViewReportDetails as EventListener
    );

    return () => {
      document.removeEventListener(
        "viewReportDetails",
        handleViewReportDetails as EventListener
      );
    };
  }, [reports]);

  // Group reports by location
  useEffect(() => {
    if (reports.length > 0) {
      const groups = MapService.groupReportsByLocation(reports);
      setLocationGroups(groups);
    }
  }, [reports]);

  // Update visualization when reports, map, or view mode changes
  useEffect(() => {
    if (!map || !leaflet || Object.keys(locationGroups).length === 0) return;

    const L: LeafletStatic = window.L;

    // Create appropriate visualization strategy
    if (viewMode === VIEW_MODES.MARKERS) {
      visualizationRef.current = new MarkerVisualization(map, L);
    } else {
      visualizationRef.current = new HeatmapVisualization(map, L);
    }

    // Render visualization
    if (visualizationRef.current) {
      visualizationRef.current.render(locationGroups, setSelectedReport);
    }

    // Fit map to bounds
    MapService.fitMapToBounds(map, L, locationGroups);
  }, [map, leaflet, locationGroups, viewMode]);

  useEffect(() => {
    if (!map || !leaflet) return;

    const L: LeafletStatic = window.L;
    MapService.setTileLayer(map, L, currentMapMode);
  }, [map, leaflet, currentMapMode]);

  function toggleViewMode(): void {
    setViewMode(
      viewMode === VIEW_MODES.MARKERS ? VIEW_MODES.HEATMAP : VIEW_MODES.MARKERS
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-1 w-full h-full gap-3">
        <div className="relative flex-1 h-full rounded-xl overflow-hidden shadow-lg">
          <div
            ref={mapRef}
            className="w-full h-full rounded-xl overflow-hidden z-10 relative"
          >
            {isLoading && <Loading />}
          </div>

          {/* Map Controls */}
          {!isLoading && map && (
            <>
              <MapControls
                viewMode={viewMode}
                onToggleViewMode={toggleViewMode}
              />
              <MapLegend />
            </>
          )}
        </div>

        {reports.length > 0 && !isLoading && (
          <div className="w-72 h-full flex flex-col gap-2 overflow-y-auto pr-1">
            <MapViewModeSwitch
              currentMapMode={currentMapMode}
              setCurrentMapMode={setCurrentMapMode}
            />

            <CrimeOverview
              totalReports={totalReports}
              uniqueLocations={uniqueLocations}
              low={low}
              high={high}
              medium={medium}
            />

            <TimeDistribution
              timeDistribution={timeDistribution}
              totalReports={totalReports}
              maxTimeCount={maxTimeCount}
            />

            <TimeAnalysis
              totalReports={totalReports}
              timeDistribution={timeDistribution}
            />
          </div>
        )}
      </div>

      <style jsx global>{`
        /* Z-index layering for map elements */
        .leaflet-container {
          z-index: 20 !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
        }
        .leaflet-popup {
          z-index: 30 !important;
        }
        .leaflet-control {
          z-index: 40 !important;
        }

        /* Marker styling */
        .custom-cluster-icon {
          background: transparent;
          border: none;
        }

        .heat-cluster-marker {
          z-index: 1000 !important;
        }

        .marker-container {
          display: block;
          position: relative;
        }

        .pulse-effect {
          pointer-events: none;
        }

        /* Popup styling */
        .cluster-popup-content {
          padding: 0;
          max-height: 400px;
          overflow-y: auto;
        }

        .modern-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }

        .modern-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }

        .modern-popup .leaflet-popup-tip {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .popup-header {
          padding: 14px 16px;
          border-bottom: 1px solid #eee;
          background-color: #f8fafc;
        }

        .popup-header h3 {
          margin: 0 0 5px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .popup-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }

        .report-count {
          color: #64748b;
        }

        .popup-severity {
          padding: 3px 8px;
          border-radius: 12px;
          color: white;
          font-weight: 500;
        }

        .popup-reports {
          padding: 10px 0;
        }

        .report-item {
          display: flex;
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          transition: background-color 0.2s;
        }

        .report-item:hover {
          background-color: #f8fafc;
        }

        .report-item.highlight {
          background-color: #f0f9ff;
        }

        .report-score {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          color: white;
          font-weight: bold;
          margin-right: 14px;
          flex-shrink: 0;
        }

        .report-content {
          flex: 1;
        }

        .report-content h4 {
          margin: 0 0 6px 0;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
        }

        .report-content p {
          margin: 0 0 10px 0;
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }

        .report-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .report-date {
          font-size: 11px;
          color: #94a3b8;
          display: flex;
          align-items: center;
        }

        .report-date svg {
          margin-right: 4px;
        }

        .view-details {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-details:hover {
          background-color: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.95);
            opacity: 0.7;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.95);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
