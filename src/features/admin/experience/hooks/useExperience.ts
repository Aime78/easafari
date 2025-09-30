import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { experienceService } from "../services/experienceService";
import type {
  ExperienceCategory,
  ApiErrorResponse,
} from "../types/experienceTypes";

export const useExperiences = (categoryId?: number) => {
  return useQuery({
    queryKey: categoryId
      ? queryKeys.experiences.list(`category-${categoryId}`)
      : queryKeys.experiences.lists(),
    queryFn: categoryId
      ? () => experienceService.getByCategory(categoryId)
      : experienceService.getAll,
  });
};

export const useExperience = (id: string) => {
  return useQuery({
    queryKey: queryKeys.experiences.detail(id),
    queryFn: () => experienceService.getById(id),
    enabled: !!id,
  });
};

export const useCreateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: experienceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.experiences.lists(),
      });
    },
    onError: (error) => {
      console.error("Create experience failed:", error);
    },
  });
};

export const useExperienceCategories = () => {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.categories.experiences.lists(),
    queryFn: experienceService.getCategories,
  });

  const createCategoryMutation = useMutation<
    ExperienceCategory,
    ApiErrorResponse,
    { name: string }
  >({
    mutationFn: experienceService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.experiences.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.experiences.lists(),
      });
    },
    onError: (error) => {
      console.error("Create category failed:", error);
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
