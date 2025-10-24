import { api } from "@/lib/api";
import type { Event, EventCategory } from "../types/eventTypes";

// Temporary attraction type for the dropdown
interface Attraction {
  id: number;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export const providerEventService = {
  getAll: (): Promise<Event[]> => api.get("/provider/events"),
  getByCategory: (categoryId: number): Promise<Event[]> =>
    api.get(`/provider/events?category_id=${categoryId}`),
  getById: (id: string): Promise<Event> => api.get(`/provider/events/${id}`),
  getCategories: () => api.get<EventCategory[]>("/events/categories"),
  getAttractions: () => api.get<Attraction[]>("/provider/attractions"), // Temporary - get all attractions
  createCategory: (data: { name: string }) =>
    api.post<EventCategory>("/events/categories", data),
  search: (query: string) =>
    api.get<Event[]>(
      `/provider/events/search?query=${encodeURIComponent(query)}`
    ),
  create: (data: FormData) =>
    api.post<Event>("/provider/events", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  update: (id: string, data: FormData) =>
    api.post<Event>(`/provider/events/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  delete: (id: string) => api.delete(`/provider/events/${id}`),
};
