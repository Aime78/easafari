import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accommodationsApi } from '@/lib/api';
import type { AccommodationCategory } from '@/types/accommodations.type';

export const useAccommodationCategories = () => {
  const [categories, setCategories] = useState<AccommodationCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await accommodationsApi.getCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const createCategoryMutation = useMutation({
    mutationFn: accommodationsApi.createCategory,
    onSuccess: (newCategory) => {
      setCategories(prev => [...prev, newCategory]);
      queryClient.invalidateQueries({ queryKey: ['accommodations'] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to create category');
    }
  });

  const refetch = () => {
    setLoading(true);
    setError(null);
    accommodationsApi.getCategories()
      .then(setCategories)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to fetch categories'))
      .finally(() => setLoading(false));
  };

  return {
    categories,
    loading,
    error,
    refetch,
    createCategory: createCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    createError: createCategoryMutation.error,
  };
};
