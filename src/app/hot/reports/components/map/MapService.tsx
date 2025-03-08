import { CrimeReport } from "@/components/global/crime-report-card/types";
import { LeafletMap, LeafletStatic, MarkerGroup } from "./types";

export type MapMode = "standard" | "dark" | "satellite";

export class MapService {
  static initializeMap(
    mapElement: HTMLElement,
    center: [number, number] = [23.685, 90.3563],
    zoom = 7,
    mapMode: MapMode = "standard"
  ): LeafletMap | null {
    if (!mapElement) return null;

    const L: LeafletStatic = window.L;
    const mapInstance = L.map(mapElement, {
      zoomControl: false,
    }).setView(center, zoom);

    // Apply the initial tile layer based on the map mode
    MapService.setTileLayer(mapInstance, L, mapMode);

    L.control
      .zoom({
        position: "bottomright",
      })
      .addTo(mapInstance);

    return mapInstance;
  }

  static setTileLayer(
    mapInstance: LeafletMap,
    L: LeafletStatic,
    mapMode: MapMode
  ): void {
    mapInstance.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstance.removeLayer(layer);
      }
    });

    // Then add the new tile layer based on the map mode
    switch (mapMode) {
      case "dark":
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 19,
          }
        ).addTo(mapInstance);
        break;
      case "satellite":
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution:
              "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
            maxZoom: 19,
          }
        ).addTo(mapInstance);
        break;
      case "standard":
      default:
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }).addTo(mapInstance);
        break;
    }
  }

  static groupReportsByLocation(reports: CrimeReport[]): MarkerGroup {
    const groups: MarkerGroup = {};

    reports.forEach((report) => {
      if (report.districtCoordinates && report.districtCoordinates.length > 0) {
        const coordKey = report.districtCoordinates[0];
        if (!groups[coordKey]) {
          groups[coordKey] = [];
        }
        groups[coordKey].push(report);
      }
    });

    return groups;
  }

  static fitMapToBounds(
    map: LeafletMap,
    L: LeafletStatic,
    locationGroups: MarkerGroup
  ): void {
    if (Object.keys(locationGroups).length === 0) return;

    const positions = Object.keys(locationGroups).map((coordKey) => {
      return coordKey.split(",").map((coord) => parseFloat(coord.trim()));
    });

    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 10,
      });
    }
  }
}
