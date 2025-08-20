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
  tour_provider_id?: number;
  created_at: string;
  updated_at: string;
  reviews_count: number;
}

export interface AccommodationCategory {
  id: number;
  name: string;
  code?: string | null;
  image?: string | null;
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
  thumbnail?: File;
  images?: FileList;
}

export interface AccommodationSearchParams {
  query?: string;
  categoryId?: number;
  rating?: number;
  priceMin?: number;
  priceMax?: number;
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
