import { api } from "@/lib/api";
import type { ProviderProfile, Service } from "../types/providerTypes";

export const providerService = {
  getProfile: (): Promise<ProviderProfile> =>
    api.get("/provider/tour-providers"),

  // Update/Create provider profile
  updateProfile: (data: FormData): Promise<ProviderProfile> =>
    api.post("/provider/tour-providers", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getServices: (): Promise<Service[]> => api.get("/provider/services"),
};
