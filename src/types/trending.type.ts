export interface Report {
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

export interface Statistics {
  totalReports: number;
  crimeTypes: Record<string, number>;
  recentTrend: number;
}
export interface Location {
  lat: number;
  lng: number;
}
export interface Division {
  id: string;
  name: string;
}

export type ViewType = "grid" | "map";
export type TimeRange = "all" | "week" | "month" | "quarter";
export type SortOption =
  | "algorithmScore"
  | "recent"
  | "engagement"
  | "severity";

export interface Filter {
  division: Division | null;
  district: null | string;
  timeRange: "all" | "week" | "month" | "quarter";
  sortBy: "algorithmScore" | "recent" | "engagement" | "severity";
  searchQuery: string;
  crimeType: string;
}

export const DEFAULT_FILTER: Filter = {
  division: null,
  district: null,
  timeRange: "all",
  sortBy: "algorithmScore",
  searchQuery: "",
  crimeType: "",
};
