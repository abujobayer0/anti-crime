import { CrimeReport } from "@/components/global/crime-report-card/types";
import {
  IVisualizationStrategy,
  LeafletMap,
  LeafletMarker,
  LeafletStatic,
  MarkerGroup,
} from "./types";
import { SeverityUtil } from "./utils";
import { format } from "date-fns";

export class VisualizationStrategy implements IVisualizationStrategy {
  protected map: LeafletMap;
  protected L: LeafletStatic;
  protected markers: LeafletMarker[];

  constructor(map: LeafletMap, L: LeafletStatic) {
    this.map = map;
    this.L = L;
    this.markers = [];
  }

  clearLayers(): void {
    this.markers.forEach((marker: LeafletMarker) => marker.remove());
    this.markers = [];
  }

  render(locationGroups: MarkerGroup): void {
    this.clearLayers();
  }

  createClusterPopupContent(reports: CrimeReport[]): string {
    // Sort reports by algorithm score (most severe first)
    const sortedReports = [...reports].sort(
      (a, b) => (b.algorithmScore || 0) - (a.algorithmScore || 0)
    );
    const district = sortedReports[0]?.district || "";
    const division = sortedReports[0]?.division || "";

    // Generate popup content
    return `
        <div class="cluster-popup-content">
          <div class="popup-header">
            <h3>${district}, ${division}</h3>
            <div class="popup-meta">
              <span class="report-count">${
                reports.length
              } reports in this area</span>
              <span class="popup-severity" style="background-color: ${SeverityUtil.getColor(
                sortedReports[0]?.algorithmScore || 0
              )}">
                ${SeverityUtil.getLabel(sortedReports[0]?.algorithmScore || 0)}
              </span>
            </div>
          </div>
          
          <div class="popup-reports">
            ${sortedReports
              .map(
                (report, idx) => `
              <div class="report-item ${idx === 0 ? "highlight" : ""}">
                <div class="report-score" style="background-color: ${SeverityUtil.getColor(
                  report.algorithmScore || 0
                )}">
                  ${Math.round(report.algorithmScore || 0)}
                </div>
                <div class="report-content">
                  <h4>${report.title}</h4>
                  <p>${report.description?.substring(0, 100)}${
                  report.description?.length > 100 ? "..." : ""
                }</p>
                  <div class="report-footer">
                    <span class="report-date">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      ${format(new Date(report.postTime), "MMM d, yyyy")}
                    </span>
                    <button class="view-details" onclick="document.dispatchEvent(new CustomEvent('viewReportDetails', {detail: '${
                      report._id
                    }'}))">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;
  }
}
