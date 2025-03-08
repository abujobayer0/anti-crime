import { CrimeReport } from "@/components/global/crime-report-card/types";
import { SEVERITY_THRESHOLDS } from "./types";

// Utility functions
export const SeverityUtil = {
  getColor: (score: number) => {
    if (score > SEVERITY_THRESHOLDS.HIGH) return "#EF4444"; // High score - red
    if (score > SEVERITY_THRESHOLDS.MEDIUM) return "#F59E0B"; // Medium score - amber
    return "#10B981"; // Lower score - green
  },

  getLabel: (score: number) => {
    if (score > SEVERITY_THRESHOLDS.HIGH) return "High Severity";
    if (score > SEVERITY_THRESHOLDS.MEDIUM) return "Medium Severity";
    return "Low Severity";
  },

  countBySeverity: (reports: CrimeReport[]) => {
    return {
      high: reports.filter(
        (r: CrimeReport) => r.algorithmScore! > SEVERITY_THRESHOLDS.HIGH
      ).length,
      medium: reports.filter(
        (r: CrimeReport) =>
          r.algorithmScore! > SEVERITY_THRESHOLDS.MEDIUM &&
          r.algorithmScore! <= SEVERITY_THRESHOLDS.HIGH
      ).length,
      low: reports.filter(
        (r: CrimeReport) => r.algorithmScore! <= SEVERITY_THRESHOLDS.MEDIUM
      ).length,
    };
  },
};

export const TimeUtil = {
  countByTimeOfDay: (reports: CrimeReport[]) => {
    return {
      morning: reports.filter((r) => {
        const hour = new Date(r.postTime).getHours();
        return hour >= 5 && hour < 12;
      }).length,

      afternoon: reports.filter((r) => {
        const hour = new Date(r.postTime).getHours();
        return hour >= 12 && hour < 17;
      }).length,

      evening: reports.filter((r) => {
        const hour = new Date(r.postTime).getHours();
        return hour >= 17 && hour < 21;
      }).length,

      night: reports.filter((r) => {
        const hour = new Date(r.postTime).getHours();
        return hour >= 21 || hour < 5;
      }).length,
    };
  },
};
