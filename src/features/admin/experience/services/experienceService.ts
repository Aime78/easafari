import { api } from "@/lib/api";
import type { Experience, ExperienceCategory } from "../types/experienceTypes";

export const experienceService = {
  getAll: (): Promise<Experience[]> => api.get("/admin/experiences"),
  getByCategory: (categoryId: number): Promise<Experience[]> =>
    api.get(`/admin/experiences?category_id=${categoryId}`),
  getById: (id: string): Promise<Experience> =>
    api.get(`/admin/experiences/${id}`),
  getCategories: () =>
    api.get<ExperienceCategory[]>("/admin/experiences/categories"),
  createCategory: (data: FormData | { name: string }) =>
    api.post<ExperienceCategory>(
      "/admin/experiences/categories",
      data,
      data instanceof FormData
        ? {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        : undefined
    ),
  search: (query: string) =>
    api.get<Experience[]>(
      `/admin/experiences/all/search?query=${encodeURIComponent(query)}`
    ),
  create: (data: FormData) =>
    api.post<Experience>("/admin/experiences", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
