import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accommodationsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

export const useAccommodations = (categoryId?: number) => {
  return useQuery({
    queryKey: categoryId
      ? queryKeys.accommodations.list(`category-${categoryId}`)
      : queryKeys.accommodations.lists(),
    queryFn: categoryId
      ? () => accommodationsApi.getByCategory(categoryId)
      : accommodationsApi.getAll,
  });
};

export const useAccommodation = (id: string) => {
  return useQuery({
    queryKey: queryKeys.accommodations.detail(id),
    queryFn: () => accommodationsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateAccommodation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accommodationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.accommodations.lists(),
      });
    },
  });
};
