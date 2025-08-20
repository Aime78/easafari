import { api } from "@/lib/api";
import type { Attraction, AttractionCategory } from "../types/attractionTypes";

export const attractionService = {
  getAll: (): Promise<Attraction[]> => api.get("/attractions"),
  getByCategory: (categoryId: number): Promise<Attraction[]> =>
    api.get(`/attractions?category_id=${categoryId}`),
  getById: (id: string): Promise<Attraction> => api.get(`/attractions/${id}`),
  getCategories: () => api.get<AttractionCategory[]>("/attractions/categories"),
  createCategory: (data: { name: string }) =>
    api.post<AttractionCategory>("/attractions/categories", data),
  search: (query: string) =>
    api.get<Attraction[]>(
      `/attractions/all/search?query=${encodeURIComponent(query)}`
    ),
  create: (data: FormData) =>
    api.post<Attraction>("/attractions", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
