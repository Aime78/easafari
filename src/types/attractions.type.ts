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
