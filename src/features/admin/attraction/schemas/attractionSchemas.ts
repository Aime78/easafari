import { object, string, coerce } from "zod";

export const createAttractionSchema = object({
name: string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  description: string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  address: string()
    .min(1, "Address is required")
    .max(500, "Address must be less than 500 characters"),
  latitude: string()
    .min(1, "Latitude is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= -90 && num <= 90;
    }, "Latitude must be a valid number between -90 and 90"),
  longitude: string()
    .min(1, "Longitude is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= -180 && num <= 180;
    }, "Longitude must be a valid number between -180 and 180"),
  rating: string()
    .min(1, "Rating is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 5;
    }, "Rating must be a valid number between 0 and 5"),
  attraction_category_id: string().min(1, "Category is required"),
});

export const attractionSearchSchema = object({
  query: string().optional(),
  categoryId: coerce.number().int().optional(),
  rating: coerce.number().min(0).max(5).optional(),
  sortBy: string().optional(),
  sortOrder: string().optional(),
});

export const createCategorySchema = object({
  name: string().min(1, "Category name is required"),
});
