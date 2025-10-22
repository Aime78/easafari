export interface Room {
  id: number;
  accommodation_id: number;
  name: string;
  description: string;
  capacity: number;
  price_per_night: number;
  is_available: number;
  images: string[];
  created_at: string;
  updated_at: string;
  quantity: number;
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

export interface AccommodationDetails {
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
  accommodation_category_id: number;
  tour_provider_id?: number;
  created_at: string;
  updated_at: string;
  reviews_count: number;
  rooms: Room[];
  tour_provider: TourProvider;
  reviews: Review[];
}

export interface AccommodationDetailsResponse {
  accommodation: AccommodationDetails;
  similar: Accommodation[];
}

export interface Accommodation {
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
  accommodation_category_id: number;
  attraction_id?: number; // Added for attraction association
  tour_provider_id?: number;
  created_at: string;
  updated_at: string;
  reviews_count: number;
}

export interface AccommodationCategory {
  id: number;
  name: string;
  code?: string | null;
  thumbnail?: string | null;
  created_at: string;
  updated_at: string;
}

// Temporary attraction type for the dropdown
export interface Attraction {
  id: number;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAccommodationData {
  name: string;
  description: string;
  address: string;
  price: string;
  latitude: string;
  longitude: string;
  rating: string;
  amenities: string;
  accommodation_category_id: string;
  attraction_id?: string; // Added for attraction association
  thumbnail?: File;
  images?: FileList;
}

export interface AccommodationSearchParams {
  query?: string;
  categoryId?: number;
  rating?: number;
  priceMin?: number;
  priceMax?: number;
  amenities?: string;
  sortBy?: "name" | "rating" | "price" | "created_at";
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
