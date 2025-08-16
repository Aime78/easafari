import { api } from "@/lib/api";
import type { Experience, ExperienceCategory } from "../types/experienceTypes";

export const experienceService = {
  getAll: (): Promise<Experience[]> => api.get("/experiences"),
  getByCategory: (categoryId: number): Promise<Experience[]> =>
    api.get(`/experiences?category_id=${categoryId}`),
  getById: (id: string): Promise<Experience> => api.get(`/experiences/${id}`),
  getCategories: () => api.get<ExperienceCategory[]>("/experiences/categories"),
  createCategory: (data: { name: string }) =>
    api.post<ExperienceCategory>("/experiences/categories", data),
  search: (query: string) =>
    api.get<Experience[]>(
      `/experiences/all/search?query=${encodeURIComponent(query)}`
    ),
  create: (data: FormData) =>
    api.post<Experience>("/experiences", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
