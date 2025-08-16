import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { experiencesApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

export const useExperiences = (categoryId?: number) => {
  return useQuery({
    queryKey: categoryId
      ? queryKeys.experiences.list(`category-${categoryId}`)
      : queryKeys.experiences.lists(),
    queryFn: categoryId
      ? () => experiencesApi.getByCategory(categoryId)
      : experiencesApi.getAll,
  });
};

export const useExperience = (id: string) => {
  return useQuery({
    queryKey: queryKeys.experiences.detail(id),
    queryFn: () => experiencesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: experiencesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.experiences.lists(),
      });
    },
  });
};
