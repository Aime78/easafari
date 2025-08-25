import { z } from "zod";

export const providerSettingsSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  address: z.string().min(1, "Address is required"),
  rating: z.string().min(1, "Rating is required"),
  user_id: z.string().min(1, "User ID is required"),
  thumbnail: z.any().optional(),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid mobile number format"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  tour_provider_category_id: z
    .string()
    .min(1, "Tour provider category is required"),
});

export type ProviderSettingsFormData = z.infer<typeof providerSettingsSchema>;
