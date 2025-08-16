import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";


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
