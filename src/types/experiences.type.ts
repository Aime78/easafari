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
  included: string;
  excluded: string;
  experience_category_id: number;
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
