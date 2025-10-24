import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { providerEventService } from "../services/eventService";
import type { EventCategory, ApiErrorResponse } from "../types/eventTypes";

export const useProviderEvents = (categoryId?: number) => {
  return useQuery({
    queryKey: categoryId
      ? queryKeys.provider.events.list(`category-${categoryId}`)
      : queryKeys.provider.events.lists(),
    queryFn: categoryId
      ? () => providerEventService.getByCategory(categoryId)
      : providerEventService.getAll,
  });
};

export const useProviderEvent = (id: string) => {
  return useQuery({
    queryKey: queryKeys.provider.events.detail(id),
    queryFn: () => providerEventService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProviderEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerEventService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.events.lists(),
      });
    },
    onError: (error) => {
      console.error("Create event failed:", error);
    },
  });
};

export const useUpdateProviderEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      providerEventService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.events.lists(),
      });
    },
    onError: (error) => {
      console.error("Update event failed:", error);
    },
  });
};

export const useDeleteProviderEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerEventService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.events.lists(),
      });
    },
    onError: (error) => {
      console.error("Delete event failed:", error);
    },
  });
};

export const useProviderEventCategories = () => {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.categories.events.lists(),
    queryFn: providerEventService.getCategories,
  });

  const createCategoryMutation = useMutation<
    EventCategory,
    ApiErrorResponse,
    { name: string }
  >({
    mutationFn: providerEventService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.events.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.events.lists(),
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
    queryFn: providerEventService.getAttractions,
  });
};
