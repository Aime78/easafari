import { api } from "@/lib/api";
import type {
  Accommodation,
  AccommodationCategory,
} from "../types/accommodationTypes";

export const accommodationService = {
  getAll: (): Promise<Accommodation[]> => api.get("/accommodations"),
  getByCategory: (categoryId: number): Promise<Accommodation[]> =>
    api.get(`/accommodations?category_id=${categoryId}`),
  getById: (id: string): Promise<Accommodation> =>
    api.get(`/accommodations/${id}`),
  getCategories: () =>
    api.get<AccommodationCategory[]>("/accommodations/categories"),
  createCategory: (data: { name: string }) =>
    api.post<AccommodationCategory>("/accommodations/categories", data),
  search: (query: string) =>
    api.get<Accommodation[]>(
      `/accommodations/all/search?query=${encodeURIComponent(query)}`
    ),
  create: (data: FormData) =>
    api.post<Accommodation>("/accommodations", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
