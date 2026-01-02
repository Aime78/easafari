export interface RoomBooking {
  qty: number;
  price: number;
  room_id: number;
}

export interface AccommodationBooking {
  id: number;
  user_id: number;
  accommodation_id: number;
  check_in: string;
  check_out: string;
  guest_count: number;
  total_price: string;
  rooms: RoomBooking[];
  status: "pending" | "confirmed" | "completed" | "cancelled" | "refunded";
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
