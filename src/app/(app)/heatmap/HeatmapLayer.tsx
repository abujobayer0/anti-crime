"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet.heat";
import { useMap } from "react-leaflet";

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
    console.log(locationGroups);
    // Compute heatmap intensity
    const heatmapPoints = Object.values(locationGroups).map((points) => {
      const centerLat =
        points.reduce((sum, p) => sum + p.lat, 0) / points.length;
      const centerLng =
        points.reduce((sum, p) => sum + p.lng, 0) / points.length;
      const intensity = Math.min(points.length * 20, 100);
      return [centerLat, centerLng, intensity];
    });

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

    data.data.forEach(({ lat, lng, report }) => {
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

      const marker = L.marker([lat, lng], { icon: customIcon }).bindPopup(
        `
        <div class="p-4 max-w-[320px]">
          <h3 class="font-bold text-lg mb-3 text-gray-900">${report.title}</h3>
          <p class="text-sm text-gray-600 mb-3 leading-relaxed">
            ${
              report.description.length > 150
                ? report.description.slice(0, 150) + "..."
                : report.description
            }
          </p>
          <div class="space-y-1.5 text-sm text-gray-500">
            <div class="flex items-center gap-2">
              <span>${report.time}</span>
            </div>
            <div class="flex items-center gap-2">
              <span>Reported by ${report.userId.name}</span>
            </div>
            <div class="flex items-center gap-2">
              <span>${report.location}</span>
            </div>
          </div>
          <a href="/reports/${
            report._id
          }" class="inline-flex items-center justify-center w-full mt-4 px-4 py-2.5 bg-primary !text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors duration-200">
            View Details
          </a>
        </div>
      `,
        { className: "modern-popup rounded-lg shadow-xl" }
      );

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
