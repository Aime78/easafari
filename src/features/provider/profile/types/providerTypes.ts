export interface Service {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProviderProfile {
  id?: string;
  name: string;
  description: string;
  address: string;
  thumbnail?: string;
  phone: string;
  mobile: string;
  services: {
    attractions: boolean;
    experiences: boolean;
    events: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export interface ProviderProfileFormData {
  name: string;
  description: string;
  address: string;
  thumbnail?: File | null;
  phone: string;
  mobile: string;
  services: {
    attractions: boolean;
    experiences: boolean;
    events: boolean;
  };
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}
