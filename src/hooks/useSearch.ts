import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";
import apiClient from "@/api/client";
import { ENDPOINTS } from "@/api/config";

function sanitizeQuery(query: string) {
  return encodeURIComponent(query.trim().replace(/[<>%$\/]/g, ""));
}

export function useSearch(query: string) {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const sanitizedQuery = sanitizeQuery(debouncedQuery);

  useEffect(() => {
    if (sanitizedQuery === "") {
      setResults([]);
      return;
    }

    let isMounted = true;

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(
          `${ENDPOINTS.search.search}?searchTerm=${sanitizedQuery}`
        );

        if (isMounted) {
          setResults(response.data.data || []);
        }
      } catch (error) {
        console.error("Search error:", error);
        if (isMounted) {
          setResults([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, [sanitizedQuery]);

  return { results, isLoading };
}
