import { CrimeReport } from "@/components/global/crime-report-card/types";

export const fallbackCoordinates = {
  dhaka: { lat: 23.8103, lng: 90.4125 },
  chittagong: { lat: 22.3569, lng: 91.7832 },
  rajshahi: { lat: 24.3745, lng: 88.6042 },
  khulna: { lat: 22.8456, lng: 89.5403 },
  sylhet: { lat: 24.8949, lng: 91.8687 },
};

export const processReports = (reports: CrimeReport[]) => {
  const crimeTypes: Record<string, number> = {};

  return reports?.map((report: CrimeReport) => {
    if (report.crimeType) {
      crimeTypes[report.crimeType] = (crimeTypes[report.crimeType] || 0) + 1;
    }

    if (report.districtCoordinates && report.districtCoordinates[0]) {
      const coordinates = report.districtCoordinates[0].split(",");
      if (coordinates.length >= 2) {
        return {
          ...report,
          location: {
            lat: parseFloat(coordinates[0]),
            lng: parseFloat(coordinates[1]),
          },
        };
      }
    }

    if (report.district) {
      const districtKey = report.district.toLowerCase();
      if (districtKey in fallbackCoordinates) {
        const fallback =
          fallbackCoordinates[districtKey as keyof typeof fallbackCoordinates];
        return {
          ...report,
          location: {
            lat: fallback.lat,
            lng: fallback.lng,
          },
        };
      }
    }

    return report;
  });
};
