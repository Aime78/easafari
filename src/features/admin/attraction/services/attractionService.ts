import { api } from "@/lib/api";
import type { Attraction, AttractionCategory } from "../types/attractionTypes";

export const attractionService = {
  getAll: (): Promise<Attraction[]> => api.get("/admin/attractions"),
  getByCategory: (categoryId: number): Promise<Attraction[]> =>
    api.get(`/admin/attractions?category_id=${categoryId}`),
  getById: (id: string): Promise<Attraction> =>
    api.get(`/admin/attractions/${id}`),
  getCategories: () =>
    api.get<AttractionCategory[]>("/admin/attractions/categories"),
  createCategory: (data: { name: string }) =>
    api.post<AttractionCategory>("/admin/attractions/categories", data),
  search: (query: string) =>
    api.get<Attraction[]>(
      `/admin/attractions/all/search?query=${encodeURIComponent(query)}`
    ),
  create: (data: FormData) =>
    api.post<Attraction>("/admin/attractions", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
