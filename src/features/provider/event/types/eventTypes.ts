export interface Event {
  id: number;
  name: string;
  description: string;
  location: string; // Changed from address to location
  organizer: string | null; // Can be null based on API response
  thumbnail: string;
  start_date: string;
  end_date: string;
  price: number | null; // Can be null based on API response
  total_seats: number | null; // From API response
  event_category_id?: number; // Added back for category filtering
  tour_provider_id: number;
  is_active: number;
  tickets: unknown[]; // From API response
  tour_provider?: TourProvider; // Optional, only present in details
  created_at: string;
  updated_at: string;
}

export interface EventCategory {
  id: number;
  name: string;
  code?: string | null;
  thumbnail?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TourProvider {
  id: number;
  name: string;
  description: string;
  address: string;
  is_verified: number;
  rating: number | null;
  thumbnail: string;
  mobile: string;
  phone: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  // Add other review properties when available
}

export interface EventDetails {
  id: number;
  name: string;
  description: string;
  address: string;
  price: number;
  latitude: string;
  longitude: string;
  rating: number;
  thumbnail: string;
  images: string[] | null;
  amenities: string;
  event_category_id: number;
  tour_provider_id?: number;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  available_spots: number;
  created_at: string;
  updated_at: string;
  reviews_count: number;
  tour_provider: TourProvider;
  reviews: Review[];
}

export interface EventDetailsResponse {
  event: EventDetails;
  similar: Event[];
}

// Temporary attraction type for the dropdown
export interface Attraction {
  id: number;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  name: string;
  description: string;
  address: string;
  price: string;
  latitude: string;
  longitude: string;
  rating: string;
  amenities: string;
  event_category_id: string;
  attraction_id?: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  capacity: string;
  thumbnail?: File;
  images?: FileList;
}

export interface EventSearchParams {
  query?: string;
  categoryId?: number;
  rating?: number;
  priceMin?: number;
  priceMax?: number;
  amenities?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "name" | "rating" | "price" | "start_date" | "created_at";
  sortOrder?: "asc" | "desc";
}

export interface ApiError {
  response?: {
    status: number;
    statusText: string;
    data?: {
      message?: string;
    };
  };
  message?: string;
  code?: string;
}

export interface ApiErrorResponse extends Error {
  response?: {
    status: number;
    statusText: string;
    data?: {
      message?: string;
    };
  };
  code?: string;
}
