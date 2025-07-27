import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attractionsApi } from '@/lib/api';
import type { AttractionCategory } from '@/types/attractions.type';

export const useAttractionCategories = () => {
  const [categories, setCategories] = useState<AttractionCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await attractionsApi.getCategories();
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
    mutationFn: attractionsApi.createCategory,
    onSuccess: (newCategory) => {
      setCategories(prev => [...prev, newCategory]);
      queryClient.invalidateQueries({ queryKey: ['attractions'] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to create category');
    }
  });

  const refetch = () => {
    setLoading(true);
    setError(null);
    attractionsApi.getCategories()
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
