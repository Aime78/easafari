export interface Booking {
  id: number;
  start_date: string;
  end_date: string;
  adults: number;
  child: number;
  infant: number;
  payment_method: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "refunded";
  total: number;
  service_fee: number;
  experience_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  experience: BookingExperience;
  user: BookingUser;
}

export interface BookingExperience {
  id: number;
  name: string;
  description: string;
  price: number;
  address: string;
  rating: number;
  thumbnail: string;
  images: string[] | null;
  duration: string;
  whats_included: string | null;
  experience_category_id: number;
  tour_provider_id: number;
  created_at: string;
  updated_at: string;
}

export interface BookingUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  email_verified_at: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  avatar: string | null;
  google_id: string | null;
  reset_code: string | null;
  tour_provider_id: number | null;
  is_following: boolean;
}

export interface BookingSearchParams {
  query?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  sortBy?: "created_at" | "start_date" | "total" | "status";
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
