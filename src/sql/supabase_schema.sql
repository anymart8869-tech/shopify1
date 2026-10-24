-- ====================================================================
-- StoreNova: Multi-Tenant E-commerce SaaS Platform Schema
-- PostgreSQL & Supabase Row Level Security (RLS) Specification
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('super_admin', 'store_owner', 'customer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('cod', 'upi');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role user_role NOT NULL DEFAULT 'store_owner',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SUBSCRIPTION PLANS TABLE
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price_monthly NUMERIC(10, 2) NOT NULL DEFAULT 0,
  price_yearly NUMERIC(10, 2) NOT NULL DEFAULT 0,
  product_limit INTEGER NOT NULL DEFAULT 10,
  store_limit INTEGER NOT NULL DEFAULT 1,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. STORES TABLE (Multi-Tenant Hub)
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  banner_url TEXT DEFAULT '',
  primary_color TEXT DEFAULT '#008060',
  accent_color TEXT DEFAULT '#004c3f',
  background_color TEXT DEFAULT '#ffffff',
  currency TEXT DEFAULT 'USD',
  currency_symbol TEXT DEFAULT '$',
  contact_email TEXT NOT NULL,
  contact_phone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'draft')),
  layout_settings JSONB NOT NULL DEFAULT '{
    "hero_title": "Welcome to our store",
    "hero_subtitle": "Discover hand-picked curated collections",
    "hero_button_text": "Shop Now",
    "show_featured_products": true,
    "show_announcement": true,
    "announcement_text": "Enjoy Free Shipping on orders over $50!",
    "show_newsletter": true,
    "show_reviews": true,
    "show_categories": true
  }'::jsonb,
  payment_settings JSONB NOT NULL DEFAULT '{
    "cod_enabled": true,
    "upi_enabled": true,
    "upi_id": "merchant@upi",
    "upi_name": "Store Merchant"
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('active', 'trial', 'expired', 'cancelled')),
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'General',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount_price NUMERIC(10, 2),
  sku TEXT DEFAULT '',
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  sizes JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (store_id, slug)
);

-- 8. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT DEFAULT '',
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payment_method payment_method NOT NULL DEFAULT 'cod',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  status order_status NOT NULL DEFAULT 'pending',
  transaction_id TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies:
CREATE POLICY "Users can read their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_super_admin());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_super_admin());

-- Subscription Plans: Public can view available plans
CREATE POLICY "Anyone can view subscription plans"
  ON public.subscription_plans FOR SELECT
  USING (true);

CREATE POLICY "Super admins can manage subscription plans"
  ON public.subscription_plans FOR ALL
  USING (public.is_super_admin());

-- Stores Policies:
CREATE POLICY "Public can view active stores"
  ON public.stores FOR SELECT
  USING (status = 'active' OR auth.uid() = owner_id OR public.is_super_admin());

CREATE POLICY "Store owners can insert their store"
  ON public.stores FOR INSERT
  WITH CHECK (auth.uid() = owner_id OR public.is_super_admin());

CREATE POLICY "Store owners can update their store"
  ON public.stores FOR UPDATE
  USING (auth.uid() = owner_id OR public.is_super_admin());

CREATE POLICY "Store owners can delete their store"
  ON public.stores FOR DELETE
  USING (auth.uid() = owner_id OR public.is_super_admin());

-- Products Policies:
CREATE POLICY "Public can view active products of active stores"
  ON public.products FOR SELECT
  USING (
    is_active = true 
    OR EXISTS (SELECT 1 FROM public.stores WHERE stores.id = products.store_id AND stores.owner_id = auth.uid())
    OR public.is_super_admin()
  );

CREATE POLICY "Store owners can insert products to their store"
  ON public.products FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.stores WHERE stores.id = products.store_id AND stores.owner_id = auth.uid())
    OR public.is_super_admin()
  );

CREATE POLICY "Store owners can update their store products"
  ON public.products FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.stores WHERE stores.id = products.store_id AND stores.owner_id = auth.uid())
    OR public.is_super_admin()
  );

CREATE POLICY "Store owners can delete their store products"
  ON public.products FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.stores WHERE stores.id = products.store_id AND stores.owner_id = auth.uid())
    OR public.is_super_admin()
  );

-- Orders Policies:
CREATE POLICY "Store owners can view orders for their stores"
  ON public.orders FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.stores WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid())
    OR customer_id = auth.uid()
    OR public.is_super_admin()
  );

CREATE POLICY "Customers and guests can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Store owners can update their store orders"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.stores WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid())
    OR public.is_super_admin()
  );

-- Subscriptions Policies:
CREATE POLICY "Users can view their subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id OR public.is_super_admin());

CREATE POLICY "Users can manage their subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.uid() = user_id OR public.is_super_admin());
