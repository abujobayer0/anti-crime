import { CrimeReport } from "@/components/global/crime-report-card/types";
import { LeafletMap, LeafletStatic, MarkerGroup } from "./types";
import { VisualizationStrategy } from "./VisualizationStrategy";
import { SeverityUtil } from "./utils";

export class HeatmapVisualization extends VisualizationStrategy {
  private heatmapLayer: any | null;

  constructor(map: LeafletMap, L: LeafletStatic) {
    super(map, L);
    this.heatmapLayer = null;
  }

  clearLayers(): void {
    super.clearLayers();

    if (this.heatmapLayer) {
      this.map.removeLayer(this.heatmapLayer);
      this.heatmapLayer = null;
    }
  }

  render(
    locationGroups: MarkerGroup,
    onReportSelect?: (report: CrimeReport) => void
  ): void {
    this.clearLayers();

    const L = this.L;
    const heatmapPoints: Array<[number, number, number]> = [];
    let maxValue = 0;

    Object.entries(locationGroups).forEach(([coordKey, groupReports]) => {
      try {
        const coords = coordKey
          .split(",")
          .map((coord) => parseFloat(coord.trim()));
        const count = groupReports.length;
        const avgScore =
          groupReports.reduce(
            (sum: number, r) => sum + (r.algorithmScore || 0),
            0
          ) / count;

        // Weight by both count and severity score
        const intensity = Math.min(count * (avgScore / 40), 100);
        maxValue = Math.max(maxValue, intensity);

        heatmapPoints.push([coords[0], coords[1], intensity]);

        // For clusters, also add clickable markers on top of heatmap
        if (count > 1) {
          // Determine crime type for icon (use the most severe report's type)
          const sortedReports = [...groupReports].sort(
            (a, b) => (b.algorithmScore || 0) - (a.algorithmScore || 0)
          );
          const primaryCrimeType = sortedReports[0]?.crimeType || "general";

          // Calculate size based on count but with a more balanced scale
          const markerSize = Math.min(30 + Math.sqrt(count) * 4, 48);

          // Get crime type icon
          const crimeIcon = this.getCrimeTypeIcon(primaryCrimeType);

          const clusterIcon = L.divIcon({
            className: "heat-cluster-marker",
            html: `
                <div class="marker-container" style="
                  position: relative;
                  width: ${markerSize}px;
                  height: ${markerSize}px;
                ">
                  <div style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: ${markerSize}px;
                    height: ${markerSize}px;
                    background-color: rgba(255, 255, 255, 0.9);
                    color: #333;
                    border-radius: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: ${Math.max(9, Math.min(12, count + 6))}px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    z-index: 1;
                  ">
                    <div style="
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                      width: 100%;
                      height: 100%;
                      padding: 4px;
                    ">
                      ${crimeIcon.replace('stroke="white"', 'stroke="#333"')}
                      <span style="
                        margin-top: 2px;
                        background-color: rgba(0,0,0,0.1);
                        border-radius: 8px;
                        padding: 1px 6px;
                        font-size: ${Math.max(9, Math.min(11, count + 5))}px;
                      ">${count}</span>
                    </div>
                    <div style="
                      position: absolute;
                      bottom: 0;
                      left: 0;
                      width: 100%;
                      height: 3px;
                      background: linear-gradient(90deg, 
                        ${SeverityUtil.getColor(avgScore)} 0%, 
                        ${SeverityUtil.getColor(avgScore)} ${Math.min(
              (avgScore / 150) * 100,
              100
            )}%, 
                        transparent ${Math.min((avgScore / 150) * 100, 100)}%);
                    "></div>
                  </div>
                </div>
              `,
            iconSize: [markerSize, markerSize],
            iconAnchor: [markerSize / 2, markerSize / 2],
          });

          const position: [number, number] = [coords[0], coords[1]];
          const popupContent = this.createClusterPopupContent(groupReports);

          const marker = L.marker(position, {
            icon: clusterIcon,
          }).bindPopup(popupContent, {
            className: "modern-popup cluster-popup",
            maxWidth: 320,
            minWidth: 300,
          });

          marker.on("click", () => {
            marker.openPopup();
          });

          this.markers.push(marker);
          marker.addTo(this.map);
        }
      } catch (error) {
        console.error("Error adding heatmap point:", error);
      }
    });

    // Create heatmap layer with improved gradient
    if (heatmapPoints.length > 0 && this.L.heatLayer) {
      this.heatmapLayer = this.L.heatLayer(heatmapPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 15,
        max: maxValue,
        gradient: {
          0.1: "rgba(65, 105, 225, 0.7)", // Royal blue
          0.3: "rgba(0, 255, 255, 0.7)", // Cyan
          0.5: "rgba(255, 255, 0, 0.8)", // Yellow
          0.7: "rgba(255, 128, 0, 0.9)", // Orange
          0.9: "rgba(255, 0, 0, 0.9)", // Red
        },
      }).addTo(this.map);
    }
  }

  // Helper method to get appropriate icon based on crime type
  private getCrimeTypeIcon(crimeType: string): string {
    // Default icon colors
    const iconColor = "white";

    // Return appropriate icon based on crime type
    switch (crimeType?.toLowerCase()) {
      case "theft":
      case "robbery":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>`;

      case "assault":
      case "violence":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12h5l2 9 4-18 2 9h5"></path>
          </svg>`;

      case "vandalism":
      case "property":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 22l10-10m0-10v10l10-10v20L12 12"></path>
          </svg>`;

      case "traffic":
      case "accident":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v4m0 4h.01"></path>
          </svg>`;

      case "drugs":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"></path>
          </svg>`;

      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>`;
    }
  }
}
