import { api } from "@/lib/api";
import type {
  Accommodation,
  AccommodationCategory,
} from "../types/accommodationTypes";

// Temporary attraction type for the dropdown
interface Attraction {
  id: number;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export const providerAccommodationService = {
  getAll: (): Promise<Accommodation[]> => api.get("/provider/accommodations"),
  getByCategory: (categoryId: number): Promise<Accommodation[]> =>
    api.get(`/provider/accommodations?category_id=${categoryId}`),
  getById: (id: string): Promise<Accommodation> =>
    api.get(`/provider/accommodations/${id}`),
  getCategories: () =>
    api.get<AccommodationCategory[]>("/accommodations/categories"),
  getAttractions: () => api.get<Attraction[]>("/provider/attractions"), // Temporary - get all attractions
  createCategory: (data: { name: string }) =>
    api.post<AccommodationCategory>("/accommodations/categories", data),
  search: (query: string) =>
    api.get<Accommodation[]>(
      `/provider/accommodations/search?query=${encodeURIComponent(query)}`
    ),
  create: (data: FormData) =>
    api.post<Accommodation>("/provider/accommodations", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  update: (id: string, data: FormData) =>
    api.post<Accommodation>(`/provider/accommodations/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  delete: (id: string) => api.delete(`/provider/accommodations/${id}`),
  createRoom: (data: FormData) =>
    api.post("/provider/rooms", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updateRoom: (id: string, data: FormData) =>
    api.post(`/provider/rooms/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  deleteRoom: (id: string) => api.delete(`/provider/rooms/${id}`),
};
