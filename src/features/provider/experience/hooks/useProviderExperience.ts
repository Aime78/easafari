import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { providerExperienceService } from "../services/experienceService";
import type {
  ExperienceCategory,
  ApiErrorResponse,
} from "../types/experienceTypes";

export const useProviderExperiences = (categoryId?: number) => {
  return useQuery({
    queryKey: categoryId
      ? queryKeys.provider.experiences.list(`category-${categoryId}`)
      : queryKeys.provider.experiences.lists(),
    queryFn: categoryId
      ? () => providerExperienceService.getByCategory(categoryId)
      : providerExperienceService.getAll,
  });
};

export const useProviderExperience = (id: string) => {
  return useQuery({
    queryKey: queryKeys.provider.experiences.detail(id),
    queryFn: () => providerExperienceService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProviderExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerExperienceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.experiences.lists(),
      });
    },
    onError: (error) => {
      console.error("Create experience failed:", error);
    },
  });
};

export const useUpdateProviderExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      providerExperienceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.experiences.lists(),
      });
    },
    onError: (error) => {
      console.error("Update experience failed:", error);
    },
  });
};

export const useDeleteProviderExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerExperienceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.experiences.lists(),
      });
    },
    onError: (error) => {
      console.error("Delete experience failed:", error);
    },
  });
};

export const useProviderExperienceCategories = () => {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.categories.experiences.lists(),
    queryFn: providerExperienceService.getCategories,
  });

  const createCategoryMutation = useMutation<
    ExperienceCategory,
    ApiErrorResponse,
    { name: string }
  >({
    mutationFn: providerExperienceService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.experiences.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.experiences.lists(),
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

export const useProviderAttractions = () => {
  return useQuery({
    queryKey: queryKeys.attractions.lists(),
    queryFn: providerExperienceService.getAttractions,
  });
};
