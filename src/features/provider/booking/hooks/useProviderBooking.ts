import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { providerBookingService } from "../services/bookingService";
import type { ApiErrorResponse } from "../types/bookingTypes";

// Experience Bookings Hooks
export const useProviderExperienceBookings = (status?: string) => {
  return useQuery({
    queryKey: status
      ? queryKeys.provider.bookings.list(`experience-status-${status}`)
      : queryKeys.provider.bookings.list("experiences"),
    queryFn: status
      ? () => providerBookingService.experiences.getByStatus(status)
      : providerBookingService.experiences.getAll,
  });
};

// Accommodation Bookings Hooks
export const useProviderAccommodationBookings = (status?: string) => {
  return useQuery({
    queryKey: status
      ? queryKeys.provider.bookings.list(`accommodation-status-${status}`)
      : queryKeys.provider.bookings.list("accommodations"),
    queryFn: status
      ? () => providerBookingService.accommodations.getByStatus(status)
      : providerBookingService.accommodations.getAll,
  });
};

// Keep backward compatibility
export const useProviderBookings = useProviderExperienceBookings;

export const useProviderExperienceBooking = (id: string) => {
  return useQuery({
    queryKey: queryKeys.provider.bookings.detail(`experience-${id}`),
    queryFn: () => providerBookingService.experiences.getById(id),
    enabled: !!id,
  });
};

export const useProviderAccommodationBooking = (id: string) => {
  return useQuery({
    queryKey: queryKeys.provider.bookings.detail(`accommodation-${id}`),
    queryFn: () => providerBookingService.accommodations.getById(id),
    enabled: !!id,
  });
};

export const useUpdateExperienceBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      providerBookingService.experiences.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.bookings.lists(),
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.error("Update experience booking status failed:", error);
    },
  });
};

export const useUpdateAccommodationBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      providerBookingService.accommodations.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.provider.bookings.lists(),
      });
    },
    onError: (error: ApiErrorResponse) => {
      console.error("Update accommodation booking status failed:", error);
    },
  });
};

// Keep backward compatibility
export const useProviderBooking = useProviderExperienceBooking;
export const useUpdateBookingStatus = useUpdateExperienceBookingStatus;
