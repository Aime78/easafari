export interface ProviderSettings {
  name: string;
  description: string;
  address: string;
  rating: string;
  user_id: string;
  thumbnail?: File | null;
  mobile: string;
  phone: string;
  tour_provider_category_id: string;
}

export interface ProviderFormData {
  name: string;
  description: string;
  address: string;
  rating: string;
  user_id: string;
  thumbnail?: FileList | null;
  mobile: string;
  phone: string;
  tour_provider_category_id: string;
}
