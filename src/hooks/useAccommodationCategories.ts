import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accommodationsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

export const useAccommodationCategories = () => {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.categories.accommodations.lists(),
    queryFn: accommodationsApi.getCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: accommodationsApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.accommodations.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.accommodations.lists(),
      });
    },
  });

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
