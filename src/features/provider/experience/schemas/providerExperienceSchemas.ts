import { object, string } from "zod";

export const createProviderExperienceSchema = object({
  name: string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  description: string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  address: string()
    .min(1, "Address is required")
    .max(500, "Address must be less than 500 characters"),
  price: string()
    .min(1, "Price is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
      "Price must be a positive number"
    ),
  duration: string().min(1, "Duration is required"),
  whats_included: string().min(1, "Included items are required"),
  experience_category_id: string().min(1, "Category is required"),
  attraction_id: string().min(1, "Attraction is required"),
});

export const createProviderCategorySchema = object({
  name: string().min(1, "Category name is required"),
});
