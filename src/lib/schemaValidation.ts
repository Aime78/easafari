import { object, string } from "zod";

export const signInSchema = object({
  email: string().min(1, "Email is required").email("Invalid email"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const registerSchema = object({
  email: string().min(1, "Company email is required").email("Invalid email"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  companyName: string()
    .min(1, "Company name is required")
    .max(255, "Company name must be less than 255 characters"),
});

export const addAttractionSchema = object({
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

export const addAccommodationSchema = object({
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
  amenities: string().min(1, "Amenities are required"),
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
  accommodation_category_id: string().min(1, "Category is required"),
});
