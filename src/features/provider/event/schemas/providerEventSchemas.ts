import { z } from "zod";

export const createProviderEventSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  description: z.string().min(1, "Description is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  location: z.string().min(1, "Location is required"),
  organizer: z.string().min(1, "Organizer is required"),
});

export const createProviderEventCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Name is too long"),
});

export type CreateProviderEventFormData = z.infer<
  typeof createProviderEventSchema
>;
export type CreateProviderEventCategoryFormData = z.infer<
  typeof createProviderEventCategorySchema
>;
