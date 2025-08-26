import { object, string } from "zod";

export const loginSchema = object({
  email: string().min(1, "Email is required").email("Invalid email"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const registerSchema = object({
  name: string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  email: string().min(1, "Email is required").email("Invalid email"),
  password: string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be less than 32 characters"),
  phone: string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  position: string()
    .min(1, "Position is required")
    .max(255, "Position must be less than 255 characters"),
});
