import { del, get, post } from "@/features/market/lib/axios";
import type {
  Product,
  SingleProductResponse,
  SubCategory,
} from "@/features/market/types/marketTypes";

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
      const token = localStorage.getItem("token");

      const product = await get<SingleProductResponse>(
        `/market/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return product;
    } catch (error) {
      console.log("error in getSingleProduct");
      throw error;
    }
  },

  updateProduct: async (id: number, formData: FormData) => {
    try {
      const updatedProduct = await post<Product>(
        `/provider/market/products/${id}/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // ✅ important
          },
        }
      );
      return updatedProduct;
    } catch (error) {
      console.log("error in updateproduct");
      throw error;
    }
  },

  deleteProduct: async (id: number) => {
    try {
      await del(`/provider/market/products/${id}`);
      console.log("sent del product reques");
    } catch (error) {
      console.log("error deleting product");
      throw error;
    }
  },
};
