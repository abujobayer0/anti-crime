import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import apiClient from "@/api/client";
import { ENDPOINTS } from "@/api/config";

export function useSearch(query: string) {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setResults([]);
      return;
    }

    let isMounted = true;

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(
          `${ENDPOINTS.search.search}?searchTerm=${debouncedQuery}`
        );

        if (isMounted) {
          setResults(response.data.data || []);
        }
      } catch (error) {
        console.error("Search error:", error);
        if (isMounted) {
          setResults([]);
          setIsLoading(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  return { results, isLoading };
}
