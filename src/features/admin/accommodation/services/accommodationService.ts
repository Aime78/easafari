import { api } from "@/lib/api";
import type {
  Accommodation,
  AccommodationCategory,
} from "../types/accommodationTypes";

export const accommodationService = {
  getAll: (): Promise<Accommodation[]> => api.get("/admin/accommodations"),
  getByCategory: (categoryId: number): Promise<Accommodation[]> =>
    api.get(`/admin/accommodations?category_id=${categoryId}`),
  getById: (id: string): Promise<Accommodation> =>
    api.get(`/admin/accommodations/${id}`),
  getCategories: () =>
    api.get<AccommodationCategory[]>("/admin/accommodations/categories"),
  createCategory: (data: { name: string }) =>
    api.post<AccommodationCategory>("/admin/accommodations/categories", data),
  search: (query: string) =>
    api.get<Accommodation[]>(
      `/admin/accommodations/all/search?query=${encodeURIComponent(query)}`
    ),
  create: (data: FormData) =>
    api.post<Accommodation>("/admin/accommodations", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
