import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attractionsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

export const useAttractions = (categoryId?: number) => {
  return useQuery({
    queryKey: categoryId
      ? queryKeys.attractions.list(`category-${categoryId}`)
      : queryKeys.attractions.lists(),
    queryFn: categoryId
      ? () => attractionsApi.getByCategory(categoryId)
      : attractionsApi.getAll,
  });
};

export const useAttraction = (id: string) => {
  return useQuery({
    queryKey: queryKeys.attractions.detail(id),
    queryFn: () => attractionsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateAttraction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attractionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attractions.lists(),
      });
    },
  });
};
