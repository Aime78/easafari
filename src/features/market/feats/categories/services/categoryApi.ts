import type { Category, SubCategory } from "../../../types/marketTypes";
import { get, post, del } from "../../../lib/axios";

export const categoriesApi = {
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
      const newCategory = await post<Category>(
        "/provider/market/categories",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return newCategory;
    } catch (error) {
      console.log("error in createCategory");
      throw error;
    }
  },

  updateCategory: async (id: number, formData: FormData) => {
    try {
      const updatedCategory = await post<Category>(
        `/provider/market/categories/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return updatedCategory;
    } catch (error) {
      console.log("error updating cat");

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

  updateSubCategory: async (id: number, formData: FormData) => {
    try {
      const updatedCategory = await post<SubCategory>(
        `/provider/market/sub-categories/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return updatedCategory;
    } catch (error) {
      console.log("error updating SUBcat");

      throw error;
    }
  },

  deleteCategory: async (id: number) => {
    try {
      await del(`/provider/market/categories/${id}`);

      console.log("sent del cat reques");
    } catch (error) {
      console.log("error deleting cat");

      throw error;
    }
  },

  deleteSubCategory: async (id: number) => {
    try {
      await del(`/provider/market/sub-categories/${id}`);

      console.log("sent del SUBcat reques");
    } catch (error) {
      console.log("error deleting SUBcat");

      throw error;
    }
  },
};
