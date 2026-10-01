export type Role = "admin" | "staff" | "customer";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: Role;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image_url: string;
  display_order: number;
  parts_count?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  description: string;
  parts_count?: number;
}

export interface VehicleMake {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
}

export interface VehicleModel {
  id: string;
  make_id: string;
  make?: VehicleMake;
  name: string;
  slug: string;
  year_start: number;
  year_end: number | null;
}

export interface VehicleVariant {
  id: string;
  model_id: string;
  model?: VehicleModel;
  name: string;
  fuel_type: "Petrol" | "Diesel" | "Hybrid" | "Electric" | "CNG";
  engine_capacity: string;
  transmission: "Manual" | "Automatic" | "CVT" | "DCT";
}

export interface ProductImage {
  id?: string;
  product_id?: string;
  url: string;
  alt: string;
  display_order: number;
  is_primary: boolean;
}

export interface ProductCompatibility {
  id: string;
  product_id: string;
  variant_id: string;
  variant?: VehicleVariant;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  part_number: string;
  oem_number: string;
  brand_id: string;
  brand?: Brand;
  category_id: string;
  category?: Category;
  description: string;
  specifications: Record<string, string>;
  price: number | null;
  discount_price: number | null;
  currency: string;
  stock: number;
  is_available: boolean;
  is_featured: boolean;
  is_archived: boolean;
  payment_enabled: boolean;
  tags: string[];
  images: ProductImage[];
  compatibilities?: ProductCompatibility[];
  created_at: string;
  updated_at: string;
}

export type EnquiryStatus = "new" | "contacted" | "resolved";

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  product_id?: string;
  product_name?: string;
  product_part_number?: string;
  vehicle_details?: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "dispatched" | "delivered" | "cancelled";
export type PaymentMethod = "card" | "cod" | "bank_wire" | "whatsapp";

export interface ShippingAddress {
  full_name: string;
  phone: string;
  country: string; // UAE, Saudi Arabia, Qatar, etc.
  emirate_city: string; // Dubai, Abu Dhabi, Riyadh, etc.
  street_address: string;
  building_villa?: string;
  area_district?: string;
  notes?: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  part_number: string;
  brand_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  image_url?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  vat_amount: number; // 5% VAT
  shipping_fee: number;
  total: number;
  currency: string; // AED
  payment_method: PaymentMethod;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  business_name: string;
  business_tagline: string;
  headline: string;
  hero_description: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  business_hours: string;
  announcement: string;
  default_currency: string;
  social_links: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface ProductFilterParams {
  query?: string;
  categoryId?: string;
  brandId?: string;
  makeId?: string;
  modelId?: string;
  variantId?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  sortBy?: "newest" | "name_asc" | "name_desc" | "price_low" | "price_high";
  limit?: number;
  offset?: number;
}
