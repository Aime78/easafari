import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { attractionsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

export const useAttractionSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const {
    data: searchResults = [],
    isLoading: isSearching,
    error: searchError,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.attractions.search(debouncedQuery),
    queryFn: () => attractionsApi.search(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const updateSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
  };

  return {
    searchQuery,
    searchResults,
    isSearching: isSearching || isFetching,
    searchError,
    updateSearch,
    clearSearch,
    hasSearchQuery: debouncedQuery.length > 0,
  };
};
