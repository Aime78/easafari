export type Store = {
  tour_provider_id: number;
  name: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  opening_hours: string;
  updated_at: string;
  created_at: string;
  id: number;
  products?: Product[];
  orders?: Order[];
  products_count?: number;
  orders_count?: number;
};

export type Product = {
  tour_provider_id: number;
  store_id: string;
  name: string;
  description: string;
  quantity: string;
  price: string;
  discount_price: string;
  thumbnail: string;
  sub_category_id: number;
  category_id: number;
  colors: string[] | null;
  sizes: null;
  updated_at: string;
  created_at: string;
  id: number;
};

export type Category = {
  name: string;
  image: string | null;
  updated_at: string;
  created_at: string;
  id: number;
  sub_categories: SubCategory[];
  tour_provider_id: number;
};

export type SubCategory = {
  name: string;
  category_id: string;
  image: string;
  updated_at: string;
  created_at: string;
  id: number;
};

export type OrderItem = {
  size: string;
  color: string;
  quantity: number;
  product_id: number;
};

export type Order = {
  id: number;
  user_id: number;
  items: OrderItem[];
  address: string;
  delivery_fee: number;
  subtotal: number;
  payment_method: "Mobile Money" | "Cash" | "Card" | string; // union + fallback
  status: "NEW" | "PROCESSING" | "DELIVERED" | "CANCELLED" | string; // union + fallback
  created_at: string;
  updated_at: string;
  store_id: number;
  tour_provider_id: number;
  order_number: string;
};
