import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { providerService } from "../services/providerService";
import type {
  ApiErrorResponse,
  ProviderProfileUpdateData,
} from "../types/providerTypes";

export const useProviderProfile = () => {
  return useQuery({
    queryKey: queryKeys.provider.profile(),
    queryFn: providerService.getProfile,
  });
};

export const useCreateProviderProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerService.createProfile,
    onSuccess: (data) => {
      // Update the provider profile cache
      queryClient.setQueryData(queryKeys.provider.profile(), data);

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.all,
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.error("Create provider profile failed:", error);
    },
  });
};

export const useUpdateProviderProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      profileId,
    }: {
      data: ProviderProfileUpdateData;
      profileId: string;
    }) => providerService.updateProfile(data, profileId),
    onSuccess: (data) => {
      // Update the provider profile cache
      queryClient.setQueryData(queryKeys.provider.profile(), data);

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.all,
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.error("Update provider profile failed:", error);
    },
  });
};

// Unified hook that handles both create and update
export const useSaveProviderProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      isUpdate,
      profileId,
    }: {
      data: FormData | ProviderProfileUpdateData;
      isUpdate: boolean;
      profileId?: string;
    }) => providerService.saveProfile(data, isUpdate, profileId),
    onSuccess: (data) => {
      // Update the provider profile cache
      queryClient.setQueryData(queryKeys.provider.profile(), data);

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.all,
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.error("Save provider profile failed:", error);
    },
  });
};

export const useProviderServices = () => {
  return useQuery({
    queryKey: queryKeys.provider.services(),
    queryFn: providerService.getServices,
  });
};
