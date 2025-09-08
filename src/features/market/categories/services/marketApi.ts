import axios from "axios";
import type {
  Category,
  Order,
  Product,
  Store,
  SubCategory,
} from "../types/marketTypes";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_GENERAL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Market-Header": "easafari",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Request sent: ", { config });

    const token = import.meta.env.VITE_API_PROVIDER_TOKEN;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.data);
    return response.data;
  },
  (error) => {
    console.error("Response error:", error.response?.status, error.config?.url);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log("Unauthorized - redirecting to login");
          // Remove invalid token
          localStorage.removeItem("token");
          // Redirect to login (adjust based on your routing)
          window.location.href = "/login";
          break;
        case 403:
          console.log("Forbidden - insufficient permissions");
          break;
        case 404:
          console.log("Not found");
          break;
        case 500:
          console.log("Server error");
          break;
        default:
          console.log("Other error:", error.response.status);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("📡 Network error - no response received");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("⚙️ Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

//UTILITY FUNCTIONS

export const get = async <T>(url: string, config = {}): Promise<T> => {
  try {
    const response: T = await axiosInstance.get(url, config);
    return response;
  } catch (error) {
    console.log("error in get");

    throw error;
  }
};

export const post = async <T>(url: string, data = {}, config = {}) => {
  try {
    const response: T = await axiosInstance.post(url, data, config);
    return response;
  } catch (error) {
    console.log("error in post: ", error);

    throw error;
  }
};

export const put = async <T>(
  url: string,
  data = {},
  config = {}
): Promise<T> => {
  try {
    const response: T = await axiosInstance.put(url, data, config);
    return response;
  } catch (error) {
    console.log("error in put");

    throw error;
  }
};

export const del = async (url: string, data = {}) => {
  try {
    const response = await axiosInstance.delete(url, data);
    return response;
  } catch (error) {
    console.log("error in del");

    throw error;
  }
};

export const marketApi = {
  getStores: async () => {
    try {
      const response = await get<Store[]>("/provider/market/stores");

      return response;
    } catch (error) {
      console.log("error in getStores");

      throw error;
    }
  },

  createStore: async (formData: FormData) => {
    try {
      const response = await post<Store>("/provider/market/stores", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // ✅ important
        },
      });

      return response;
    } catch (error) {
      console.log("error in createStore");

      throw error;
    }
  },

  updateStore: async (id: number, formData: FormData) => {
    try {
      const updatedStore = await post<Store>(
        `/provider/market/stores/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // ✅ important
          },
        }
      );

      return updatedStore;
    } catch (error) {
      console.log("error in updateStore");

      throw error;
    }
  },

  getStoreDetails: async (id: number) => {
    try {
      const storeDetails = await get<Store>(`/provider/market/stores/${id}`);

      return storeDetails;
    } catch (error) {
      console.log("error getting store details");

      throw error;
    }
  },

  deleteStore: async (id: number) => {
    try {
      await del(`/provider/market/stores/${id}`);
      console.log("sent del store reques");
    } catch (error) {
      console.log("error deleting store");

      throw error;
    }
  },

  getMyCategories: async () => {
    try {
      const cats = await get<Category[]>("/provider/market/categories");
      return cats;
    } catch (error) {
      console.log("error in getMyCategories");
      throw error;
    }
  },

  createCategory: async (formData: FormData) => {
    try {
      const response = await post<Category>(
        "/provider/market/categories",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response;
    } catch (error) {
      console.log("error in createCategory");
      throw error;
    }
  },

  getMySubCategories: async () => {
    try {
      const subCats = await get<SubCategory[]>(
        "/provider/market/sub-categories"
      );

      return subCats;
    } catch (error) {
      console.log("error in getMySubCategories");
      throw error;
    }
  },

  createSubCategories: async (formData: FormData) => {
    try {
      const response = await post<SubCategory>(
        "/provider/market/sub-categories",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response;
    } catch (error) {
      console.log("error in createSubCategories");
      throw error;
    }
  },

  createProduct: async (formData: FormData) => {
    console.log("start create prod");

    try {
      const response = await post<Product>(
        "/provider/market/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // ✅ important
          },
        }
      );
      return response;
    } catch (error) {
      console.log("error in createProduct: ", error);
      throw error;
    }
  },

  getAllProducts: async () => {
    try {
      const products = await get<Product[]>("/provider/market/products");

      return products;
    } catch (error) {
      console.log("error in getAllProducts");

      throw error;
    }
  },

  getProductsByCategory: async (id: number) => {
    try {
      const products = await get<Product[]>(
        `/market/categories/${id}/products/`
      );
      return products;
    } catch (error) {
      console.log("error in getProductsByCategory");
      throw error;
    }
  },

  getProductsBySubCategory: async (id: number) => {
    try {
      const products = await get<SubCategory[]>(
        `/market/sub_categories/${id}/products/`
      );
      return products;
    } catch (error) {
      console.log("error in getProductsBySubCategory");
      throw error;
    }
  },

  getSingleProduct: async (id: number) => {
    try {
      const product = await get<Product>(`/market/products/${id}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_SECOND_TOKEN}`,
        },
      });
      return product;
    } catch (error) {
      console.log("error in getSingleProduct");
      throw error;
    }
  },

  createOrder: async (formdata: FormData) => {
    try {
      const response = await post<Order>("/market/orders", formdata, {
        headers: {
          "Content-Type": "multipart/form-data", // ✅ important
        },
      });

      return response;
    } catch (error) {
      console.log("error in createOrder");
      throw error;
    }
  },

  getOrders: async () => {
    try {
      const orders = await get<Order>("/market/orders", {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_SECOND_TOKEN}`,
        },
      });
      return orders;
    } catch (error) {
      console.log("error in getOrders");
      throw error;
    }
  },

  searchProducts: async (query: string) => {
    try {
      const results = await get<Product[]>(`/market/search?query=${query}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_SECOND_TOKEN}`,
        },
      });
      return results;
    } catch (error) {
      console.log("error in searchProducts");
      throw error;
    }
  },
};
