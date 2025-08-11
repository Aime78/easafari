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
