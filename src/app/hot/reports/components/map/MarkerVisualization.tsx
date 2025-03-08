import { CrimeReport } from "@/components/global/crime-report-card/types";
import { MarkerGroup } from "./types";
import { VisualizationStrategy } from "./VisualizationStrategy";
import { SeverityUtil } from "./utils";

export class MarkerVisualization extends VisualizationStrategy {
  render(
    locationGroups: MarkerGroup,
    onReportSelect?: (report: CrimeReport) => void
  ): void {
    super.render(locationGroups);

    const L = this.L;
    const markerGroup = L.layerGroup().addTo(this.map);

    Object.entries(locationGroups).forEach(([coordKey, groupReports]) => {
      try {
        const coords = coordKey
          .split(",")
          .map((coord) => parseFloat(coord.trim()));
        const position: [number, number] = [coords[0], coords[1]];

        const count = groupReports.length;
        const maxScore = Math.max(
          ...groupReports.map((r) => r.algorithmScore || 0)
        );

        // Determine crime type for icon (use the most severe report's type)
        const sortedReports = [...groupReports].sort(
          (a, b) => (b.algorithmScore || 0) - (a.algorithmScore || 0)
        );
        const primaryCrimeType = sortedReports[0]?.crimeType || "general";

        // Calculate size based on count but with a more balanced scale
        const markerSize =
          count === 1 ? 36 : Math.min(36 + Math.sqrt(count) * 6, 60);

        // Get severity color
        const severityColor = SeverityUtil.getColor(maxScore);

        // Choose icon based on crime type
        const crimeIcon = this.getCrimeTypeIcon(primaryCrimeType);

        const clusterIcon = L.divIcon({
          className: "custom-cluster-icon",
          html: `
              <div class="marker-container" style="
                position: relative;
                width: ${markerSize}px;
                height: ${markerSize}px;
              ">
                ${
                  count > 1
                    ? `
                  <div class="pulse-effect" style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: ${markerSize + 16}px;
                    height: ${markerSize + 16}px;
                    border-radius: 16px;
                    background-color: ${severityColor};
                    opacity: 0.3;
                    animation: pulse 2s infinite;
                    z-index: -1;
                  "></div>
                  `
                    : ""
                }
                <div class="cluster-marker" style="
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: ${markerSize}px;
                  height: ${markerSize}px;
                  background-color: ${severityColor};
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 12px;
                  border: 2px solid white;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                  position: relative;
                  overflow: hidden;
                  ${count > 1 ? "cursor: pointer;" : ""}
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
                    ${crimeIcon}
                    ${
                      count > 1
                        ? `<span style="
                      color: white;
                      font-weight: bold;
                      font-size: ${Math.max(10, Math.min(14, count + 6))}px;
                      margin-top: 2px;
                      background-color: rgba(0,0,0,0.3);
                      border-radius: 10px;
                      padding: 1px 6px;
                    ">${count}</span>`
                        : ""
                    }
                  </div>
                  
                  ${
                    count > 1
                      ? `<div style="
                      position: absolute;
                      bottom: 0;
                      left: 0;
                      width: 100%;
                      height: 4px;
                      background: linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.7) ${Math.min(
                        (maxScore / 150) * 100,
                        100
                      )}%, transparent ${Math.min(
                          (maxScore / 150) * 100,
                          100
                        )}%);
                    "></div>`
                      : ""
                  }
                </div>
              </div>
            `,
          iconSize: [markerSize, markerSize],
          iconAnchor: [markerSize / 2, markerSize / 2],
        });

        const popupContent = this.createClusterPopupContent(groupReports);

        const marker = L.marker(position, {
          icon: clusterIcon,
        }).bindPopup(popupContent, {
          className: "modern-popup cluster-popup",
          maxWidth: 320,
          minWidth: 300,
          offset: [0, -5],
          closeButton: true,
        });

        marker.on("mouseover", function () {
          if (count > 1) {
            marker.openPopup();
          }
        });

        marker.on("click", () => {
          if (count === 1 && onReportSelect) {
            onReportSelect(groupReports[0]);
          }
          marker.openPopup();
        });

        this.markers.push(marker);
        markerGroup.addLayer(marker);
      } catch (error) {
        console.error(`Error adding marker for location:`, error);
      }
    });

    // Adjust map bounds
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds(), {
        padding: [50, 50],
        maxZoom: 10,
      });
    }
  }

  private getCrimeTypeIcon(crimeType: string): string {
    // Default icon colors
    const iconColor = "white";

    // Return appropriate icon based on crime type
    switch (crimeType?.toLowerCase()) {
      case "theft":
      case "robbery":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>`;

      case "assault":
      case "violence":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 12h5l2 9 4-18 2 9h5"></path>
          </svg>`;

      case "vandalism":
      case "property":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 22l10-10m0-10v10l10-10v20L12 12"></path>
          </svg>`;

      case "traffic":
      case "accident":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v4m0 4h.01"></path>
          </svg>`;

      case "drugs":
        return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"></path>
          </svg>`;

      default:
        return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>`;
    }
  }
}
