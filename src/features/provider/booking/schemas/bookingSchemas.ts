import { object, string } from "zod";

export const updateBookingStatusSchema = object({
  status: string()
    .min(1, "Status is required")
    .refine(
      (val) =>
        ["pending", "confirmed", "completed", "cancelled", "refunded"].includes(
          val
        ),
      "Invalid status value"
    ),
});

export const bookingSearchSchema = object({
  query: string().optional(),
  status: string().optional(),
  startDate: string().optional(),
  endDate: string().optional(),
  paymentMethod: string().optional(),
});
