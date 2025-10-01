import type { Store } from "@/features/market/types/marketTypes";
import { get, post, del } from "../../../lib/axios";

export const storesApi = {
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
};
