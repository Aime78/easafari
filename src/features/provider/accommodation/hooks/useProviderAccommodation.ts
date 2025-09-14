import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { providerAccommodationService } from "../services/accommodationService";
import type {
  AccommodationCategory,
  ApiErrorResponse,
} from "../types/accommodationTypes";

export const useProviderAccommodations = (categoryId?: number) => {
  return useQuery({
    queryKey: categoryId
      ? queryKeys.provider.accommodations.list(`category-${categoryId}`)
      : queryKeys.provider.accommodations.lists(),
    queryFn: categoryId
      ? () => providerAccommodationService.getByCategory(categoryId)
      : providerAccommodationService.getAll,
  });
};

export const useProviderAccommodation = (id: string) => {
  return useQuery({
    queryKey: queryKeys.provider.accommodations.detail(id),
    queryFn: () => providerAccommodationService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProviderAccommodation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerAccommodationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.accommodations.lists(),
      });
    },
    onError: (error) => {
      console.error("Create accommodation failed:", error);
    },
  });
};

export const useUpdateProviderAccommodation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      providerAccommodationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.accommodations.lists(),
      });
    },
    onError: (error) => {
      console.error("Update accommodation failed:", error);
    },
  });
};

export const useDeleteProviderAccommodation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerAccommodationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.accommodations.lists(),
      });
    },
    onError: (error) => {
      console.error("Delete accommodation failed:", error);
    },
  });
};

export const useProviderAccommodationCategories = () => {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.categories.accommodations.lists(),
    queryFn: providerAccommodationService.getCategories,
  });

  const createCategoryMutation = useMutation<
    AccommodationCategory,
    ApiErrorResponse,
    { name: string }
  >({
    mutationFn: providerAccommodationService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.accommodations.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.accommodations.lists(),
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
    queryFn: providerAccommodationService.getAttractions,
  });
};
