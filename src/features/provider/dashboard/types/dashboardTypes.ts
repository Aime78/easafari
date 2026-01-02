export interface DashboardStats {
  total_accommodations: number;
  total_experiences: number;
  total_products: number;
  total_accommodation_bookings: number;
  total_experiences_bookings: number;
  total_orders: number;
}

export interface ApiErrorResponse {
  message: string;
  status?: number;
}
