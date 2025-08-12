import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Experience } from "@/types/experiences.type";

export const experiencesKeys = {
  all: ["experiences"] as const,
  lists: () => [...experiencesKeys.all, "list"] as const,
  list: (filters: string) => [...experiencesKeys.lists(), { filters }] as const,
  details: () => [...experiencesKeys.all, "detail"] as const,
  detail: (id: string) => [...experiencesKeys.details(), id] as const,
};

const experiencesApi = {
  getAll: (): Promise<Experience[]> => api.get("/experiences"),
  getByCategory: (categoryId: number): Promise<Experience[]> =>
    api.get(`/experiences?category_id=${categoryId}`),
  getById: (id: string): Promise<Experience> => api.get(`/experiences/${id}`),
  create: (data: Omit<Experience, "id">): Promise<Experience> =>
    api.post("/experiences", data),
  update: (id: string, data: Partial<Experience>): Promise<Experience> =>
    api.put(`/experiences/${id}`, data),
  delete: (id: string): Promise<void> => api.delete(`/experiences/${id}`),
};

export const useExperiences = (categoryId?: number) => {
  return useQuery({
    queryKey: categoryId
      ? experiencesKeys.list(`category-${categoryId}`)
      : experiencesKeys.lists(),
    queryFn: categoryId
      ? () => experiencesApi.getByCategory(categoryId)
      : experiencesApi.getAll,
  });
};

export const useExperience = (id: string) => {
  return useQuery({
    queryKey: experiencesKeys.detail(id),
    queryFn: () => experiencesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: experiencesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experiencesKeys.lists() });
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Experience> }) =>
      experiencesApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(experiencesKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: experiencesKeys.lists() });
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: experiencesApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: experiencesKeys.detail(deletedId),
      });
      queryClient.invalidateQueries({ queryKey: experiencesKeys.lists() });
    },
  });
};
