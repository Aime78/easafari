export interface Experience {
  id: number;
  name: string;
  description: string;
  address: string;
  price: number;
  duration: string;
  latitude: string;
  longitude: string;
  rating: number;
  thumbnail: string;
  images: string[] | null;
  whats_included: string;
  excluded: string;
  experience_category_id: number;
  attraction_id?: number; // Added for attraction association
  tour_provider_id?: number;
  created_at: string;
  updated_at: string;
  reviews_count: number;
}

export interface ExperienceCategory {
  id: number;
  name: string;
  code?: string | null;
  image?: string | null;
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

export interface CreateExperienceData {
  name: string;
  description: string;
  address: string;
  price: string;
  duration: string;
  latitude: string;
  longitude: string;
  rating: string;
  whats_included: string;
  excluded: string;
  experience_category_id: string;
  attraction_id?: string; // Added for attraction association
  thumbnail?: File;
  images?: FileList;
}

export interface ExperienceSearchParams {
  query?: string;
  categoryId?: number;
  rating?: number;
  priceMin?: number;
  priceMax?: number;
  duration?: string;
  sortBy?: "name" | "rating" | "price" | "duration" | "created_at";
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
