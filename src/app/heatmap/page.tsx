"use client";

import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import type { MapContainerProps } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { MapPin, AlertTriangle, Info } from "lucide-react";
import { SelectComponent } from "@/components/global/select-component";
import { SelectItem } from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/api/useReports";
import dynamic from "next/dynamic";

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
    map.flyTo(coordinates, 10, {
      duration: 2,
    });
  }, [coordinates, map]);

  return null;
};

const HeatmapPage = () => {
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [divisions, setDivisions] = useState<{ division: string }[]>([]);
  const [districts, setDistricts] = useState<{ district: string }[]>([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const { getReports } = useReports();
  const { data: reportsData } = getReports;

  const [currentMapCenter, setCurrentMapCenter] = useState<[number, number]>([
    23.8103, 90.4125,
  ]);
  const [mapZoom, setMapZoom] = useState(7);

  useEffect(() => {
    if (reportsData?.data) {
      const fetchData = async () => {
        try {
          const divisionsResponse = await fetch(
            "https://bdapis.com/api/v1.2/divisions"
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
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [reportsData]);

  // Fetch districts when division changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedDivision) return;

      try {
        const response = await fetch(
          `https://bdapis.com/api/v1.2/division/${selectedDivision}`
        );
        const data = await response.json();
        setDistricts(data.data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, [selectedDivision]);

  // Update the filter logic to handle "all" values
  const filteredReports = reports.filter((report) => {
    if (
      selectedDivision &&
      selectedDivision !== "all" &&
      report.division !== selectedDivision
    )
      return false;
    if (
      selectedDistrict &&
      selectedDistrict !== "all" &&
      report.district !== selectedDistrict
    )
      return false;
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
  const handleDivisionChange = (value: string) => {
    setSelectedDivision(value);
    setSelectedDistrict("");

    if (value === "all") {
      setCurrentMapCenter([23.8103, 90.4125]);
      setMapZoom(7);
      return;
    }

    const selectedDivisionData: any = divisions.find(
      (div) => div.division.toLowerCase() === value.toLowerCase()
    );

    if (selectedDivisionData?.coordinates) {
      const [lat, lng] = selectedDivisionData.coordinates
        .split(",")
        .map((coord: string) => parseFloat(coord.trim()));
      setCurrentMapCenter([lat, lng]);
      setMapZoom(9);
    }
  };

  // Handle district selection
  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);

    if (value === "all") {
      const selectedDivisionData: any = divisions.find(
        (div) => div.division.toLowerCase() === selectedDivision.toLowerCase()
      );
      if (selectedDivisionData?.coordinates) {
        const [lat, lng] = selectedDivisionData.coordinates
          .split(",")
          .map((coord: string) => parseFloat(coord.trim()));
        setCurrentMapCenter([lat, lng]);
        setMapZoom(9);
      }
      return;
    }

    const selectedDistrictData: any = districts.find(
      (dist) => dist.district.toLowerCase() === value.toLowerCase()
    );

    if (selectedDistrictData?.coordinates) {
      const [lat, lng] = selectedDistrictData.coordinates
        .split(",")
        .map((coord: string) => parseFloat(coord.trim()));
      setCurrentMapCenter([lat, lng]);
      setMapZoom(11);
    }
  };

  // Update MapContainer props
  const mapContainerProps: MapContainerProps = {
    center: currentMapCenter,
    zoom: mapZoom,
    style: { width: "100%", height: "100%" },
  };

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-900">Crime Heatmap</h2>
            <p className="text-muted-foreground">
              Visualize crime density across different areas of Bangladesh
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>High Risk Areas</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <Info className="w-4 h-4" />
              <span>Legend</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center relative z-40 gap-2 bg-muted/30 px-3 py-2 rounded-lg">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <SelectComponent
              selectValue="Select Division"
              value={selectedDivision}
              onValueChange={handleDivisionChange}
              content={
                <>
                  <SelectItem value="all">All Divisions</SelectItem>
                  {divisions.map((div) => (
                    <SelectItem
                      key={div.division}
                      value={div.division.toLowerCase()}
                    >
                      {div.division}
                    </SelectItem>
                  ))}
                </>
              }
            />
          </div>

          <div className="flex items-center relative z-40 gap-2 bg-muted/30 px-3 py-2 rounded-lg">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <SelectComponent
              selectValue="Select District"
              value={selectedDistrict}
              onValueChange={handleDistrictChange}
              disabled={!selectedDivision || selectedDivision === "all"}
              content={
                <>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map((dist) => (
                    <SelectItem
                      key={dist.district}
                      value={dist.district.toLowerCase()}
                    >
                      {dist.district}
                    </SelectItem>
                  ))}
                </>
              }
            />
          </div>
        </div>
      </div>

      <Card className="relative overflow-hidden rounded-xl shadow-sm border border-border/40">
        <div className="absolute top-4 right-4 z-[1000] space-x-2">
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <span>High Density</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span>Medium Density</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                <span>Low Density</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[600px] relative z-10 w-full">
          <MapContainer {...mapContainerProps}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <HeatmapLayer data={heatmapData} />
            <MapController coordinates={currentMapCenter} />
          </MapContainer>
        </div>
      </Card>
    </div>
  );
};

export default HeatmapPage;
