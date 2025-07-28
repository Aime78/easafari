import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Attraction } from '@/types/attractions.type';

export const attractionsKeys = {
  all: ['attractions'] as const,
  lists: () => [...attractionsKeys.all, 'list'] as const,
  list: (filters: string) => [...attractionsKeys.lists(), { filters }] as const,
  details: () => [...attractionsKeys.all, 'detail'] as const,
  detail: (id: string) => [...attractionsKeys.details(), id] as const,
};

const attractionsApi = {
  getAll: (): Promise<Attraction[]> => api.get('/attractions'),
  getByCategory: (categoryId: number): Promise<Attraction[]> => 
    api.get(`/attractions?category_id=${categoryId}`),
  getById: (id: string): Promise<Attraction> => api.get(`/attractions/${id}`),
  create: (data: Omit<Attraction, 'id'>): Promise<Attraction> => 
    api.post('/attractions', data),
  update: (id: string, data: Partial<Attraction>): Promise<Attraction> => 
    api.put(`/attractions/${id}`, data),
  delete: (id: string): Promise<void> => api.delete(`/attractions/${id}`),
};

export const useAttractions = (categoryId?: number) => {
  return useQuery({
    queryKey: categoryId ? attractionsKeys.list(`category-${categoryId}`) : attractionsKeys.lists(),
    queryFn: categoryId ? () => attractionsApi.getByCategory(categoryId) : attractionsApi.getAll,
  });
};

export const useAttraction = (id: string) => {
  return useQuery({
    queryKey: attractionsKeys.detail(id),
    queryFn: () => attractionsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateAttraction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: attractionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attractionsKeys.lists() });
    },
  });
};

export const useUpdateAttraction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Attraction> }) =>
      attractionsApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(attractionsKeys.detail(variables.id), data);
      queryClient.invalidateQueries({ queryKey: attractionsKeys.lists() });
    },
  });
};

export const useDeleteAttraction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: attractionsApi.delete,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: attractionsKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: attractionsKeys.lists() });
    },
  });
};
