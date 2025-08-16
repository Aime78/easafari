import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { experiencesApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

export const useExperienceCategories = () => {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.categories.experiences.lists(),
    queryFn: experiencesApi.getCategories,
  });

  const createCategoryMutation = useMutation({
    mutationFn: experiencesApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.experiences.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.experiences.lists(),
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
