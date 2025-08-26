import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { providerService } from "../services/providerService";
import type { ApiErrorResponse } from "../types/providerTypes";

export const useProviderProfile = () => {
  return useQuery({
    queryKey: queryKeys.provider.profile(),
    queryFn: providerService.getProfile,
  });
};

export const useUpdateProviderProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerService.updateProfile,
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

export const useProviderServices = () => {
  return useQuery({
    queryKey: queryKeys.provider.services(),
    queryFn: providerService.getServices,
  });
};
