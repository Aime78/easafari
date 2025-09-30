export interface Attraction {
  id: number;
  name: string;
  description: string;
  address: string;
  rating: number;
  thumbnail: string;
  images: string[] | null;
  attraction_category_id: number;
  created_at: string;
  updated_at: string;
  latitude: string;
  longitude: string;
  reviews_count: number;
}

export interface AttractionCategory {
  id: number;
  name: string;
  code: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAttractionData {
  name: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  attraction_category_id: number;
  thumbnail?: File;
  images?: FileList;
}

export interface UpdateAttractionData {
  name?: string;
  description?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  attraction_category_id?: number;
  thumbnail?: File;
  images?: FileList;
}

export interface AttractionSearchParams {
  query?: string;
  categoryId?: number;
  rating?: number;
  sortBy?: "name" | "rating" | "created_at";
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
