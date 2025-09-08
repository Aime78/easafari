import { get, post } from "@/features/market/lib/axios";
import type { Product, SubCategory } from "@/features/market/types/marketTypes";

export const productsApi = {
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
};
