import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { accommodationService } from "../services/accommodationService";
import type {
  AccommodationCategory,
  ApiErrorResponse,
} from "../types/accommodationTypes";

export const useAccommodations = (categoryId?: number) => {
  return useQuery({
    queryKey: categoryId
      ? queryKeys.accommodations.list(`category-${categoryId}`)
      : queryKeys.accommodations.lists(),
    queryFn: categoryId
      ? () => accommodationService.getByCategory(categoryId)
      : accommodationService.getAll,
  });
};

export const useAccommodation = (id: string) => {
  return useQuery({
    queryKey: queryKeys.accommodations.detail(id),
    queryFn: () => accommodationService.getById(id),
    enabled: !!id,
  });
};

export const useCreateAccommodation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accommodationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.accommodations.lists(),
      });
    },
    onError: (error) => {
      console.error("Create accommodation failed:", error);
    },
  });
};

export const useAccommodationCategories = () => {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.categories.accommodations.lists(),
    queryFn: accommodationService.getCategories,
  });

  const createCategoryMutation = useMutation<
    AccommodationCategory,
    ApiErrorResponse,
    { name: string }
  >({
    mutationFn: accommodationService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.accommodations.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.accommodations.lists(),
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
