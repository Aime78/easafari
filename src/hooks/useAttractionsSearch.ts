import { useState, useEffect } from 'react';
import { attractionsApi } from '@/lib/api';
import type { Attraction } from '@/types/attractions.type';

export const useAttractionsSearch = (query: string, delay: number = 500) => {
  const [searchResults, setSearchResults] = useState<Attraction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const timeoutId = setTimeout(async () => {
      try {
        const results = await attractionsApi.search(query.trim());
        setSearchResults(results);
      } catch (err) {
        setSearchError(err instanceof Error ? err.message : 'Search failed');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, delay]);

  return {
    searchResults,
    isSearching,
    searchError,
    hasSearchQuery: query.trim().length > 0,
  };
};
