import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  address: z.string().min(1, "Address is required"),
  latitude: z
    .string()
    .min(1, "Latitude is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= -90 && num <= 90;
    }, "Latitude must be a valid number between -90 and 90"),
  longitude: z
    .string()
    .min(1, "Longitude is required")
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= -180 && num <= 180;
    }, "Longitude must be a valid number between -180 and 180"),
  opening_hours: z.string(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  category_id: z.string().optional(),
  thumbnail: z
    .instanceof(File, { message: "Thumbnail must be a file" })
    .optional(),
});

// Form validation schema (no transforms)
export const productFormSchema = z.object({
  name: z.string().min(1, "Product name required"),
  description: z.string().min(1, "description required"),
  store_id: z
    .string()
    .min(1, "Store required")
    .refine((val) => val !== "none", "select a store"),
  sub_category_id: z
    .string()
    .min(1, "Sub category required")
    .refine((val) => val !== "none", "choose a sub category"),
  thumbnail: z.instanceof(File, { message: "Thumbnail file must be added" }),
  quantity: z
    .string()
    .min(1, "quantity is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
      "quantity must be a positive number"
    ),
  price: z
    .string()
    .min(1, "Price is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
      "Price must be a positive number"
    ),
  discount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, "Must be between 0 and 100"),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
});
