import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { experiencesApi } from "@/lib/api";
import type { ExperienceCategory } from "@/types/experiences.type";

export const useExperienceCategories = () => {
  const [categories, setCategories] = useState<ExperienceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await experiencesApi.getCategories();
        setCategories(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const createCategoryMutation = useMutation({
    mutationFn: experiencesApi.createCategory,
    onSuccess: (newCategory: ExperienceCategory) => {
      setCategories((prev) => [...prev, newCategory]);
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
    },
    onError: (err) => {
      setError(
        err instanceof Error ? err.message : "Failed to create category"
      );
    },
  });

  const refetch = () => {
    setLoading(true);
    setError(null);
    experiencesApi
      .getCategories()
      .then(setCategories)
      .catch((err: Error) =>
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories"
        )
      )
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
