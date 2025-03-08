import { useEffect, useState } from "react";

export const useLeaflet = () => {
  const [leaflet, setLeaflet] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadLeaflet() {
      try {
        if (typeof window !== "undefined") {
          // First import Leaflet only
          const L = await import("leaflet");

          // Set the global L variable that leaflet.heat needs
          if (typeof window !== "undefined") {
            window.L = L as any;
          }

          // Then import the heat plugin
          await import("leaflet.heat");

          if (isMounted) {
            setLeaflet(L);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Failed to load Leaflet:", error);
      }
    }

    loadLeaflet();

    return () => {
      isMounted = false;
    };
  }, []);

  return { leaflet, isLoading };
};
