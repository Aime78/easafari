import { api } from "@/lib/api";
import type { Experience, ExperienceCategory } from "../types/experienceTypes";

// Temporary attraction type for the dropdown
interface Attraction {
  id: number;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export const providerExperienceService = {
  getAll: (): Promise<Experience[]> => api.get("/provider/experiences"),
  getByCategory: (categoryId: number): Promise<Experience[]> =>
    api.get(`/provider/experiences?category_id=${categoryId}`),
  getById: (id: string): Promise<Experience> =>
    api.get(`/provider/experiences/${id}`),
  getCategories: () => api.get<ExperienceCategory[]>("/experiences/categories"),
  getAttractions: () => api.get<Attraction[]>("/provider/attractions"), // Temporary - get all attractions
  createCategory: (data: { name: string }) =>
    api.post<ExperienceCategory>("/experiences/categories", data),
  search: (query: string) =>
    api.get<Experience[]>(
      `/provider/experiences/search?query=${encodeURIComponent(query)}`
    ),
  create: (data: FormData) =>
    api.post<Experience>("/provider/experiences", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  update: (id: string, data: FormData) =>
    api.put<Experience>(`/provider/experiences/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  delete: (id: string) => api.delete(`/provider/experiences/${id}`),
};
