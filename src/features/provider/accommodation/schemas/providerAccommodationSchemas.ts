import { object, string, number, boolean } from "zod";

export const createProviderAccommodationSchema = object({
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
  latitude: string()
    .min(1, "Latitude is required")
    .refine(
      (val) =>
        !isNaN(parseFloat(val)) &&
        parseFloat(val) >= -90 &&
        parseFloat(val) <= 90,
      "Latitude must be a valid number between -90 and 90"
    ),
  longitude: string()
    .min(1, "Longitude is required")
    .refine(
      (val) =>
        !isNaN(parseFloat(val)) &&
        parseFloat(val) >= -180 &&
        parseFloat(val) <= 180,
      "Longitude must be a valid number between -180 and 180"
    ),
  rating: string()
    .min(1, "Rating is required")
    .refine(
      (val) =>
        !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 5,
      "Rating must be a number between 0 and 5"
    ),
  amenities: string().min(1, "Amenities are required"),
  accommodation_category_id: string().min(1, "Category is required"),
  attraction_id: string().min(1, "Attraction is required"),
});

export const createProviderAccommodationCategorySchema = object({
  name: string().min(1, "Category name is required"),
});

export const roomCreateSchema = object({
  name: string()
    .min(1, "Room name is required")
    .max(255, "Room name must be less than 255 characters"),
  description: string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  capacity: number()
    .min(1, "Capacity must be at least 1")
    .max(20, "Capacity cannot exceed 20"),
  price_per_night: number().min(0, "Price must be 0 or greater"),
  quantity: number()
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity cannot exceed 100"),
  is_available: boolean(),
});

export const roomEditSchema = roomCreateSchema;

export type RoomCreateFormData = {
  name: string;
  description?: string;
  capacity: number;
  price_per_night: number;
  quantity: number;
  is_available: boolean;
};

export type RoomEditFormData = RoomCreateFormData;
