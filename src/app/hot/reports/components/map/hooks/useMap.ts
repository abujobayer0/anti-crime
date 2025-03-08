import { useEffect, useState } from "react";
import { LeafletMap } from "../types";
import { MapService, MapMode } from "../MapService";

export function useMap(
  mapRef: React.RefObject<HTMLDivElement>,
  leaflet: any,
  isLoading: boolean,
  mapMode: MapMode = "standard"
) {
  const [map, setMap] = useState<LeafletMap | null>(null);

  useEffect(() => {
    if (isLoading || !leaflet || !mapRef.current || map) return;

    const mapInstance = MapService.initializeMap(
      mapRef.current,
      [23.685, 90.3563],
      7,
      mapMode
    );

    setMap(mapInstance);

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [mapRef, leaflet, isLoading]);

  return map;
}
