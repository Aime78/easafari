import { api } from "@/lib/api";
import type {
  ProviderProfile,
  Service,
  ProviderProfileUpdateData,
} from "../types/providerTypes";

export const providerService = {
  getProfile: (): Promise<ProviderProfile> =>
    api.get("/provider/tour-providers"),

  // Create new provider profile
  createProfile: (data: FormData): Promise<ProviderProfile> =>
    api.post("/provider/tour-providers", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Update existing provider profile with JSON data
  updateProfile: (
    data: ProviderProfileUpdateData,
    profileId: string
  ): Promise<ProviderProfile> =>
    api.put(`/provider/tour-providers/${profileId}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    }),

  // Smart method that decides between create and update
  saveProfile: (
    data: FormData | ProviderProfileUpdateData,
    isUpdate: boolean,
    profileId?: string
  ): Promise<ProviderProfile> =>
    isUpdate && profileId
      ? api.put(`/provider/tour-providers/${profileId}`, data, {
          headers: { "Content-Type": "application/json" },
        })
      : api.post("/provider/tour-providers", data, {
          headers: { "Content-Type": "multipart/form-data" },
        }),

  getServices: (): Promise<Service[]> => api.get("/provider/services"),
};
