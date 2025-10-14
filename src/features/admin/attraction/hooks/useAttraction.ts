import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { attractionService } from "../services/attractionService";
import type {
  AttractionCategory,
  ApiErrorResponse,
} from "../types/attractionTypes";

// Attraction hooks
export const useAttractions = (categoryId?: number) => {
  return useQuery({
    queryKey: categoryId
      ? queryKeys.attractions.list(`category-${categoryId}`)
      : queryKeys.attractions.lists(),
    queryFn: categoryId
      ? () => attractionService.getByCategory(categoryId)
      : attractionService.getAll,
  });
};

export const useAttraction = (id: string) => {
  return useQuery({
    queryKey: queryKeys.attractions.detail(id),
    queryFn: () => attractionService.getById(id),
    enabled: !!id,
  });
};

export const useCreateAttraction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attractionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attractions.lists(),
      });
    },
    onError: (error) => {
      console.error("Create attraction failed:", error);
    },
  });
};

// Category hooks
export const useAttractionCategories = () => {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.categories.attractions.lists(),
    queryFn: attractionService.getCategories,
  });

  const createCategoryMutation = useMutation<
    AttractionCategory,
    ApiErrorResponse,
    FormData | { name: string }
  >({
    mutationFn: attractionService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.attractions.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.attractions.lists(),
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
