export type UserRole = 'super_admin' | 'store_owner' | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface StoreLayoutSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_button_text: string;
  show_featured_products: boolean;
  show_announcement: boolean;
  announcement_text: string;
  show_newsletter: boolean;
  show_reviews: boolean;
  show_categories: boolean;
}

export interface StorePaymentSettings {
  cod_enabled: boolean;
  upi_enabled: boolean;
  upi_id?: string;
  upi_name?: string;
  qr_code_url?: string;
}

export interface Store {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo_url: string;
  banner_url: string;
  primary_color: string;
  accent_color: string;
  background_color: string;
  currency: string;
  currency_symbol: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  status: 'active' | 'suspended' | 'draft';
  layout_settings: StoreLayoutSettings;
  payment_settings: StorePaymentSettings;
  created_at: string;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  discount_price?: number;
  sku: string;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  created_at: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'upi';

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  store_id: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  transaction_id?: string;
  notes?: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: 'starter' | 'growth' | 'scale';
  price_monthly: number;
  price_yearly: number;
  product_limit: number;
  store_limit: number;
  features: string[];
  is_popular?: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  store_id?: string;
  plan_id: string;
  billing_cycle: 'monthly' | 'yearly';
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

export interface CartItem {
  id: string; // unique combo of product.id + size + color
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: { name: string; hex: string };
}
