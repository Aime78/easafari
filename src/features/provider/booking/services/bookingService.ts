import { api } from "@/lib/api";
import type { Booking } from "../types/bookingTypes";
import type { AccommodationBooking } from "../types/accommodationBookingTypes";

export const providerBookingService = {
  // Experience Bookings
  experiences: {
    // Get all experience bookings for the provider
    getAll: (): Promise<Booking[]> => api.get("/provider/experiences-bookings"),

    // Get booking by ID
    getById: (id: string): Promise<Booking> =>
      api.get(`/provider/experiences-bookings/${id}`),

    // Get bookings by status
    getByStatus: (status: string): Promise<Booking[]> =>
      api.get(`/provider/experiences-bookings?status=${status}`),

    // Search bookings
    search: (query: string): Promise<Booking[]> =>
      api.get<Booking[]>(
        `/provider/experiences-bookings/search?query=${encodeURIComponent(
          query
        )}`
      ),

    // Update booking status
    updateStatus: (id: string, status: string): Promise<Booking> =>
      api.patch(`/provider/experiences-bookings/${id}/status`, { status }),

    // Get bookings with date range filter
    getByDateRange: (startDate: string, endDate: string): Promise<Booking[]> =>
      api.get(
        `/provider/experiences-bookings?start_date=${startDate}&end_date=${endDate}`
      ),
  },

  // Accommodation Bookings
  accommodations: {
    // Get all accommodation bookings for the provider
    getAll: (): Promise<AccommodationBooking[]> =>
      api.get("/provider/accommodations-bookings"),

    // Get booking by ID
    getById: (id: string): Promise<AccommodationBooking> =>
      api.get(`/provider/accommodations-bookings/${id}`),

    // Get bookings by status
    getByStatus: (status: string): Promise<AccommodationBooking[]> =>
      api.get(`/provider/accommodations-bookings?status=${status}`),

    // Search bookings
    search: (query: string): Promise<AccommodationBooking[]> =>
      api.get<AccommodationBooking[]>(
        `/provider/accommodations-bookings/search?query=${encodeURIComponent(
          query
        )}`
      ),

    // Update booking status
    updateStatus: (id: string, status: string): Promise<AccommodationBooking> =>
      api.patch(`/provider/accommodations-bookings/${id}/status`, { status }),

    // Get bookings with date range filter
    getByDateRange: (
      startDate: string,
      endDate: string
    ): Promise<AccommodationBooking[]> =>
      api.get(
        `/provider/accommodations-bookings?check_in_date=${startDate}&check_out_date=${endDate}`
      ),
  },
};
