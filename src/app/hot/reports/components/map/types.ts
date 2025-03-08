import { CrimeReport } from "@/components/global/crime-report-card/types";

export interface MapViewProps {
  reports: CrimeReport[];
}

export interface MarkerGroup {
  [key: string]: CrimeReport[];
}
export interface TimeDistribution {
  morning: number;
  afternoon: number;
  evening: number;
  night: number;
}

export interface LeafletMap {
  setView: (center: [number, number], zoom: number) => LeafletMap;
  remove: () => void;
  fitBounds: (bounds: any, options?: any) => void;
  removeLayer: (layer: any) => void;
  eachLayer: (callback: (layer: any) => void) => void;
}

export interface LeafletMarker {
  remove: () => void;
  openPopup: () => void;
  on: (event: string, handler: () => void) => void;
  bindPopup: (content: string, options: any) => LeafletMarker;
  addTo: (map: LeafletMap) => LeafletMarker;
}

export interface LeafletStatic {
  map: (element: HTMLElement, options: any) => LeafletMap;
  tileLayer: (url: string, options: any) => any;
  control: {
    zoom: (options: any) => any;
  };
  marker: (position: [number, number], options: any) => LeafletMarker;
  divIcon: (options: any) => any;
  layerGroup: () => any;
  featureGroup: (markers: LeafletMarker[]) => any;
  latLngBounds: (positions: number[][]) => any;
  heatLayer?: (points: any[], options: any) => any;
  TileLayer?: any;
}
export interface IVisualizationStrategy {
  clearLayers(): void;
  render(
    locationGroups: MarkerGroup,
    onReportSelect?: (report: CrimeReport) => void
  ): void;
  createClusterPopupContent(reports: CrimeReport[]): string;
}
export const VIEW_MODES = {
  MARKERS: "markers",
  HEATMAP: "heatmap",
} as const;

export const SEVERITY_THRESHOLDS = {
  HIGH: 120,
  MEDIUM: 90,
  LOW: 0,
};
