import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Accommodation } from '@/types/accommodations.type';

export const accommodationsKeys = {
  all: ['accommodations'] as const,
  lists: () => [...accommodationsKeys.all, 'list'] as const,
  list: (filters: string) => [...accommodationsKeys.lists(), { filters }] as const,
  details: () => [...accommodationsKeys.all, 'detail'] as const,
  detail: (id: string) => [...accommodationsKeys.details(), id] as const,
};

const accommodationsApi = {
  getAll: (): Promise<Accommodation[]> => api.get('/accommodations'),
  getByCategory: (categoryId: number): Promise<Accommodation[]> => 
    api.get(`/accommodations?category_id=${categoryId}`),
  getById: (id: string): Promise<Accommodation> => api.get(`/accommodations/${id}`),
  create: (data: Omit<Accommodation, 'id'>): Promise<Accommodation> => 
    api.post('/accommodations', data),
  update: (id: string, data: Partial<Accommodation>): Promise<Accommodation> => 
    api.put(`/accommodations/${id}`, data),
  delete: (id: string): Promise<void> => api.delete(`/accommodations/${id}`),
};

export const useAccommodations = (categoryId?: number) => {
  return useQuery({
    queryKey: categoryId ? accommodationsKeys.list(`category-${categoryId}`) : accommodationsKeys.lists(),
    queryFn: categoryId ? () => accommodationsApi.getByCategory(categoryId) : accommodationsApi.getAll,
  });
};

export const useAccommodation = (id: string) => {
  return useQuery({
    queryKey: accommodationsKeys.detail(id),
    queryFn: () => accommodationsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateAccommodation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accommodationsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accommodationsKeys.lists() });
    },
  });
};

export const useUpdateAccommodation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Accommodation> }) =>
      accommodationsApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(accommodationsKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: accommodationsKeys.lists() });
    },
  });
};

export const useDeleteAccommodation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accommodationsApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: accommodationsKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: accommodationsKeys.lists() });
    },
  });
};
