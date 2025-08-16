import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { LoginResponse } from "@/features/auth/types/authTypes";
import type { AttractionCategory, Attraction } from "@/types/attractions.type";
import type {
  Accommodation,
  AccommodationCategory,
} from "@/types/accommodations.type";
import type { Experience, ExperienceCategory } from "@/types/experiences.type";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        // Clear stored auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to login page if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      // Server responded with error status
      throw new Error(
        `API Error: ${error.response.status} ${error.response.statusText}`
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Network Error: No response received");
    } else {
      // Something else happened
      throw new Error(`Request Error: ${error.message}`);
    }
  }
);

export const apiRequest = async <T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> => {
  const response = await axiosInstance.request<T>({
    url: endpoint,
    ...options,
  });

  return response.data;
};

export const api = {
  get: <T>(endpoint: string, options?: AxiosRequestConfig) =>
    apiRequest<T>(endpoint, { method: "GET", ...options }),

  post: <T, D = Record<string, unknown> | FormData>(
    endpoint: string,
    data?: D,
    options?: AxiosRequestConfig
  ) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      data,
      ...options,
    }),

  put: <T, D = Record<string, unknown> | FormData>(
    endpoint: string,
    data?: D,
    options?: AxiosRequestConfig
  ) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      data,
      ...options,
    }),

  patch: <T, D = Record<string, unknown> | FormData>(
    endpoint: string,
    data?: D,
    options?: AxiosRequestConfig
  ) =>
    apiRequest<T>(endpoint, {
      method: "PATCH",
      data,
      ...options,
    }),

  delete: <T>(endpoint: string, options?: AxiosRequestConfig) =>
    apiRequest<T>(endpoint, { method: "DELETE", ...options }),
};

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post<LoginResponse>("/auth/login", credentials),
};

export const attractionsApi = {
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
  update: (id: string, data: Partial<Attraction>): Promise<Attraction> =>
    api.put(`/attractions/${id}`, data),
  delete: (id: string): Promise<void> => api.delete(`/attractions/${id}`),
};

export const accommodationsApi = {
  // Data fetching
  getAll: (): Promise<Accommodation[]> => api.get("/accommodations"),
  getByCategory: (categoryId: number): Promise<Accommodation[]> =>
    api.get(`/accommodations?category_id=${categoryId}`),
  getById: (id: string): Promise<Accommodation> =>
    api.get(`/accommodations/${id}`),
  search: (query: string): Promise<Accommodation[]> =>
    api.get(`/accommodations/all/search?query=${encodeURIComponent(query)}`),

  // Category management
  getCategories: (): Promise<AccommodationCategory[]> =>
    api.get("/accommodations/categories"),
  createCategory: (data: { name: string }): Promise<AccommodationCategory> =>
    api.post("/accommodations/categories", data),

  // CRUD operations
  create: (data: FormData): Promise<Accommodation> =>
    api.post("/accommodations", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  update: (id: string, data: Partial<Accommodation>): Promise<Accommodation> =>
    api.put(`/accommodations/${id}`, data),
  delete: (id: string): Promise<void> => api.delete(`/accommodations/${id}`),
};

export const experiencesApi = {
  // Data fetching
  getAll: (): Promise<Experience[]> => api.get("/experiences"),
  getByCategory: (categoryId: number): Promise<Experience[]> =>
    api.get(`/experiences?category_id=${categoryId}`),
  getById: (id: string): Promise<Experience> => api.get(`/experiences/${id}`),
  search: (query: string): Promise<Experience[]> =>
    api.get(`/experiences/all/search?query=${encodeURIComponent(query)}`),

  // Category management
  getCategories: (): Promise<ExperienceCategory[]> =>
    api.get("/experiences/categories"),
  createCategory: (data: { name: string }): Promise<ExperienceCategory> =>
    api.post("/experiences/categories", data),

  // CRUD operations
  create: (data: FormData): Promise<Experience> =>
    api.post("/experiences", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  update: (id: string, data: Partial<Experience>): Promise<Experience> =>
    api.put(`/experiences/${id}`, data),
  delete: (id: string): Promise<void> => api.delete(`/experiences/${id}`),
};
