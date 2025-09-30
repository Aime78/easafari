import { z } from "zod";

export const providerProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  address: z.string().min(1, "Address is required"),
  thumbnail: z.any().optional(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid mobile number format"),
  services: z.array(z.number()).min(1, "At least one service must be selected"),
});

export type ProviderProfileFormData = z.infer<typeof providerProfileSchema>;

// Backward compatibility exports
export const providerSettingsSchema = providerProfileSchema;
export type ProviderSettingsFormData = ProviderProfileFormData;
