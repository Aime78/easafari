import { get, post } from "@/features/market/lib/axios";
import type { Order, Product } from "@/features/market/types/marketTypes";

export const ordersApi = {
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
