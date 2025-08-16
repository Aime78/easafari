import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attractionsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

export const useAttractionCategories = () => {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.categories.attractions.lists(),
    queryFn: attractionsApi.getCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: attractionsApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.attractions.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.attractions.lists(),
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
