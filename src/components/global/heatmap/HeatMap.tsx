"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet.heat";
import { useMap } from "react-leaflet";
import { format } from "date-fns";

interface Report {
  _id: string;
  title: string;
  description: string;
  time: string;
  location: string;
  crimeTime: string;
  userId: {
    name: string;
  };
  images: string[];
}

interface HeatmapData {
  lat: number;
  lng: number;
  value: number;
  report: Report;
}

interface HeatmapLayerProps {
  data: {
    data: HeatmapData[];
  };
}

const HeatmapLayer = ({ data }: HeatmapLayerProps) => {
  const map = useMap();
  const [currentZoom, setCurrentZoom] = useState(map?.getZoom() || 7);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!map || !data.data.length) return;

    // Group reports by location
    const locationGroups = data.data.reduce(
      (acc: { [key: string]: HeatmapData[] }, point) => {
        const location = point.report.location;
        if (!acc[location]) acc[location] = [];
        acc[location].push(point);
        return acc;
      },
      {}
    );

    // Enhanced heatmap intensity calculation
    const heatmapPoints = Object.values(locationGroups).map((points) => {
      const centerLat =
        points.reduce((sum, p) => sum + p.lat, 0) / points.length;
      const centerLng =
        points.reduce((sum, p) => sum + p.lng, 0) / points.length;

      // Adjusted intensity calculation - logarithmic scale for better visualization
      // This prevents a few high-density areas from dominating the map
      const baseIntensity = Math.min(points.length * 15, 100);
      const intensity = Math.log(baseIntensity + 1) * 20;

      return [centerLat, centerLng, intensity];
    });

    // Create modern gradient with more distinctive colors
    const heatLayer = (L as any).heatLayer(heatmapPoints, {
      radius: 30,
      blur: 20,
      maxZoom: 15,
      max: 100,
      minOpacity: 0.4,
      gradient: {
        0.1: "rgba(0, 153, 255, 0.7)", // Light blue (low)
        0.3: "rgba(0, 204, 255, 0.8)", // Cyan
        0.5: "rgba(255, 237, 0, 0.8)", // Yellow
        0.7: "rgba(255, 153, 0, 0.85)", // Orange
        0.85: "rgba(255, 0, 0, 0.9)", // Red
        1.0: "rgba(179, 0, 0, 0.95)", // Dark red (high)
      },
    });

    // Add pulse animation effect for high-density areas
    const pulseMarkerGroup = L.layerGroup();

    // Add the base heatmap layer
    heatLayer.addTo(map);

    // Create marker group for interactive elements
    const markerGroup = L.layerGroup();

    // Track zoom level changes
    const handleZoomChange = () => {
      const zoom = map.getZoom();
      setCurrentZoom(zoom);
    };

    map.on("zoomend", handleZoomChange);

    // Add interactive markers with modern design
    Object.values(locationGroups).forEach((points) => {
      // Calculate severity based on number of incidents
      const severity = points.length;
      let severityColor = "#3b82f6"; // Default blue

      if (severity >= 15) {
        severityColor = "#dc2626"; // High - red
      } else if (severity >= 8) {
        severityColor = "#f97316"; // Medium-high - orange
      } else if (severity >= 4) {
        severityColor = "#facc15"; // Medium - yellow
      } else if (severity >= 2) {
        severityColor = "#4ade80"; // Low-medium - green
      }

      // Create pulse effect for high severity locations
      if (severity >= 8) {
        const pulseIcon = L.divIcon({
          className: "pulse-icon",
          html: `
            <div style="
              position: relative;
              width: 50px;
              height: 50px;
            ">
              <div style="
                position: absolute;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                background-color: ${severityColor};
                opacity: 0.3;
                top: 0;
                left: 0;
                animation: pulse 2s infinite;
              "></div>
              <div style="
                position: absolute;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                background-color: ${severityColor};
                opacity: 0.5;
                top: 10px;
                left: 10px;
                animation: pulse 2s infinite;
                animation-delay: 0.5s;
              "></div>
            </div>
          `,
          iconSize: [50, 50],
          iconAnchor: [25, 25],
        });

        const pulseMarker = L.marker([points[0].lat, points[0].lng], {
          icon: pulseIcon,
          interactive: false,
        });

        pulseMarkerGroup.addLayer(pulseMarker);
      }

      // Modern marker design with count badge
      const customIcon = L.divIcon({
        className: "crime-marker-icon",
        html: `
          <div style="
            background-color: ${severityColor};
            width: 36px;
            height: 36px;
            border-radius: 12px;
            border: 3px solid white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            transform: rotate(45deg);
          ">
            <div style="
              width: 10px;
              height: 10px;
              background-color: white;
              border-radius: 50%;
              transform: rotate(-45deg);
            "></div>
            <div style="
              position: absolute;
              top: -10px;
              right: -10px;
              background-color: #111827;
              color: white;
              border-radius: 50%;
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 12px;
              transform: rotate(-45deg);
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ">${points.length}</div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      // Enhanced popup with modern styling
      const popupContent = `
        <div class="p-3 w-[350px] max-w-[350px]">
          <h3 class="font-bold text-lg mb-2 text-gray-900 border-b pb-2">${
            points[0].report.location
          }</h3>
          <div class="text-xs mb-2 font-medium text-gray-700">${
            points.length
          } incident${points.length !== 1 ? "s" : ""} reported</div>
          <div class="space-y-3 overflow-y-auto w-full max-h-[350px] pr-1">
            ${points
              .map(
                (point) => `
              <div class="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
                <div class="flex gap-3">
                  <div class="flex-shrink-0">
                    ${
                      point.report.images[0]
                        ? `<img src="${point.report.images[0]}" alt="${point.report.title}" class="w-20 h-16 object-cover rounded-md shadow-sm">`
                        : `<div class="w-20 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2-2m0 0l-2 2m2-2v8" />
                        </svg>
                      </div>`
                    }
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-sm leading-tight text-gray-900 mb-1">${
                      point.report.title
                    }</h4>
                    <p class="text-xs text-gray-600 mb-1 line-clamp-2">
                      ${
                        point.report.description.length > 80
                          ? point.report.description.slice(0, 80) + "..."
                          : point.report.description
                      }
                    </p>
                    <div class="flex items-center justify-between mt-1">
                      <div class="text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ${format(
                          new Date(point.report.crimeTime),
                          "MMM d, yyyy h:mm a"
                        )}
                      </div>
                      <a href="/reports/${
                        point.report._id
                      }" class="text-blue-600 text-xs hover:underline font-medium flex items-center">
                        View
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;

      // Create enhanced popup and marker
      const marker = L.marker([points[0].lat, points[0].lng], {
        icon: customIcon,
      }).bindPopup(popupContent, {
        className: "modern-crime-popup",
        maxWidth: 350,
        minWidth: 300,
        closeButton: true,
        autoClose: false,
      });

      markerGroup.addLayer(marker);
    });

    // Add CSS for animations and styling
    if (!document.getElementById("heatmap-custom-styles")) {
      const styleElement = document.createElement("style");
      styleElement.id = "heatmap-custom-styles";
      styleElement.innerHTML = `
        @keyframes pulse {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.2);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .modern-crime-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .modern-crime-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        
        .modern-crime-popup .leaflet-popup-tip {
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `;
      document.head.appendChild(styleElement);
    }

    // Add the markers after heatmap (for proper layering)
    pulseMarkerGroup.addTo(map);
    markerGroup.addTo(map);

    // Clean up on unmount
    return () => {
      map.removeLayer(heatLayer);
      map.removeLayer(markerGroup);
      map.removeLayer(pulseMarkerGroup);
      map.off("zoomend", handleZoomChange);
    };
  }, [map, data.data]);

  return null;
};

export default HeatmapLayer;
