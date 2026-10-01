-- Supabase Schema Migration: 0001_initial_schema.sql
-- Premium Automotive Spare Parts E-Commerce Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Disc',
  image_url TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Brands Table
CREATE TABLE IF NOT EXISTS public.brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Vehicle Makes
CREATE TABLE IF NOT EXISTS public.vehicle_makes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Vehicle Models
CREATE TABLE IF NOT EXISTS public.vehicle_models (
  id TEXT PRIMARY KEY,
  make_id TEXT REFERENCES public.vehicle_makes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  year_start INT NOT NULL,
  year_end INT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Vehicle Variants
CREATE TABLE IF NOT EXISTS public.vehicle_variants (
  id TEXT PRIMARY KEY,
  model_id TEXT REFERENCES public.vehicle_models(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  engine_capacity TEXT NOT NULL DEFAULT '',
  transmission TEXT NOT NULL DEFAULT 'Manual',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  part_number TEXT NOT NULL,
  oem_number TEXT DEFAULT '',
  brand_id TEXT REFERENCES public.brands(id) ON DELETE RESTRICT NOT NULL,
  category_id TEXT REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
  description TEXT NOT NULL,
  specifications JSONB DEFAULT '{}'::jsonb,
  price NUMERIC(12,2),
  discount_price NUMERIC(12,2),
  currency TEXT NOT NULL DEFAULT 'INR',
  stock INT NOT NULL DEFAULT 10,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_archived BOOLEAN NOT NULL DEFAULT false,
  payment_enabled BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  display_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Product Compatibility Table
CREATE TABLE IF NOT EXISTS public.product_compatibility (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  variant_id TEXT REFERENCES public.vehicle_variants(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(product_id, variant_id)
);

-- 10. Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT,
  product_part_number TEXT,
  vehicle_details TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- INDEXES for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_part_no ON public.products(part_number);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(is_available, is_archived);
CREATE INDEX IF NOT EXISTS idx_models_make ON public.vehicle_models(make_id);
CREATE INDEX IF NOT EXISTS idx_variants_model ON public.vehicle_variants(model_id);
CREATE INDEX IF NOT EXISTS idx_comp_product ON public.product_compatibility(product_id);
CREATE INDEX IF NOT EXISTS idx_comp_variant ON public.product_compatibility(variant_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT USING (is_archived = false);

CREATE POLICY "Public can view product images" ON public.product_images
  FOR SELECT USING (true);

CREATE POLICY "Public can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Public can view brands" ON public.brands
  FOR SELECT USING (true);

CREATE POLICY "Public can view vehicle makes" ON public.vehicle_makes
  FOR SELECT USING (true);

CREATE POLICY "Public can view vehicle models" ON public.vehicle_models
  FOR SELECT USING (true);

CREATE POLICY "Public can view vehicle variants" ON public.vehicle_variants
  FOR SELECT USING (true);

CREATE POLICY "Public can view compatibility" ON public.product_compatibility
  FOR SELECT USING (true);

CREATE POLICY "Public can view site settings" ON public.site_settings
  FOR SELECT USING (true);

-- Public Enquiry Insert Policy
CREATE POLICY "Public can submit enquiries" ON public.enquiries
  FOR INSERT WITH CHECK (true);

-- Admin Full Access Policies (Checked against profile role = 'admin' or 'staff')
CREATE POLICY "Admin full access on products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admin full access on enquiries" ON public.enquiries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admin full access on settings" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')
    )
  );
