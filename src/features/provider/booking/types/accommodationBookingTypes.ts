export interface AccommodationBooking {
  id: number;
  check_in_date: string;
  check_out_date: string;
  adults: number;
  children: number;
  rooms: number;
  nights: number;
  payment_method: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "refunded";
  total: number;
  service_fee: number;
  accommodation_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  accommodation: BookingAccommodation;
  user: BookingUser;
}

export interface BookingAccommodation {
  id: number;
  name: string;
  description: string;
  price: number;
  address: string;
  rating: number;
  thumbnail: string;
  images: string[] | null;
  amenities: string;
  accommodation_category_id: number;
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

export interface AccommodationBookingSearchParams {
  query?: string;
  status?: string;
  checkInDate?: string;
  checkOutDate?: string;
  paymentMethod?: string;
  sortBy?: "created_at" | "check_in_date" | "total" | "status";
  sortOrder?: "asc" | "desc";
}
