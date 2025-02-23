"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";
import { useMap } from "react-leaflet";
import { formatDate } from "date-fns";

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!map || !data.data.length) return;

    // Create heatmap data points
    const locationGroups = data.data.reduce(
      (acc: { [key: string]: HeatmapData[] }, point) => {
        const location = point.report.location;
        if (!acc[location]) acc[location] = [];
        acc[location].push(point);
        return acc;
      },
      {}
    );

    // Compute heatmap intensity
    const heatmapPoints = Object.values(locationGroups).map((points) => {
      const centerLat =
        points.reduce((sum, p) => sum + p.lat, 0) / points.length;
      const centerLng =
        points.reduce((sum, p) => sum + p.lng, 0) / points.length;
      const intensity = Math.min(points.length * 20, 100);
      return [centerLat, centerLng, intensity];
    });
    console.log(heatmapPoints, "heatmapPoints");
    console.log(locationGroups, "locationGroups");
    // Create heatmap layer
    const heatLayer = (L as any).heatLayer(heatmapPoints, {
      radius: 35,
      blur: 25,
      maxZoom: 12,
      max: 100,
      gradient: {
        0.4: "#4338ca",
        0.6: "#06b6d4",
        0.7: "#10b981",
        0.8: "#fbbf24",
        1.0: "#ef4444",
      },
    });

    // Add heatmap layer
    heatLayer.addTo(map);

    // Ensure markers are displayed
    const markerGroup = L.layerGroup();

    Object.values(locationGroups).forEach((points) => {
      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: `
          <div style="
            background-color: #ef4444;
            width: 32px;
            height: 32px;
            border-radius: 12px;
            border: 3px solid white;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background-color: white;
              border-radius: 50%;
              transform: rotate(-45deg);
            "></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const popupContent = `
        <div class="p-2 max-w-[320px]">
          <h3 class="font-bold text-lg mb-3 uppercase text-gray-900">${
            points[0].report.location
          }</h3>
          <div class="space-y-3 overflow-y-auto max-h-[300px]">
          
            ${points
              .map(
                (point) => `
              
              <div class="border-b pb-2 flex gap-2">
              <div class="flex items-center gap-2">
                <img src="${point.report.images[0] || ""}" alt="${
                  point.report.userId.name
                }" class="w-24 h-16">
                </div>
                  <div class="flex flex-col gap-1">

                <h4 class="font-semibold leading-relaxed text-gray-900">${
                  point.report.title
                }</h4>
                <p class="text-sm !m-0 text-gray-600">
                  ${
                    point.report.description.length > 50
                      ? point.report.description.slice(0, 50) + "..."
                      : point.report.description
                  }
                </p>
                <div class="text-xs text-gray-500">${formatDate(
                  new Date(point.report.time),
                  "MMM d, yyyy h:mm a"
                )}</div>
                <a href="/reports/${
                  point.report._id
                }" class="text-blue-600 text-xs hover:underline">
                  View Details
                </a>
              </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;

      const marker = L.marker([points[0].lat, points[0].lng], {
        icon: customIcon,
      }).bindPopup(popupContent, {
        className: "modern-popup rounded-lg shadow-xl",
      });

      markerGroup.addLayer(marker);
    });

    // Add markers after heatmap
    markerGroup.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
      map.removeLayer(markerGroup);
    };
  }, [map, data.data]);

  return null;
};

export default HeatmapLayer;
