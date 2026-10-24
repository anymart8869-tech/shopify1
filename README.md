# StoreNova: Multi-Tenant E-commerce SaaS Platform

> **Live Demo & Development Server:** `http://localhost:5173/`
> **Default Workspace Directory:** `C:\Users\User\.gemini\antigravity\scratch\storenova`

---

## 🌟 Overview

**StoreNova** is a multi-tenant E-commerce SaaS platform inspired by Shopify. It empowers anyone to register, choose a subscription plan, and launch their own online store without writing a single line of code.

Every merchant receives a dedicated public storefront (`/store/:slug`) with autonomous branding, dynamic theme accent colors, rich variant management (sizes & colors), merchant UPI QR code & Cash on Delivery (COD) checkout, and order fulfillment tracking.

---

## 🎯 10 Core Features Built & Verified

### 1. Multi-Tenant Role-Based Authentication
- **Roles:** Super Admin, Store Owner (Merchant), Customer.
- **Top Quick Switcher Bar:** 1-click switcher between **Super Admin** (`admin@storenova.io`), **Store Owner** (`sarah@aurorastores.com`), and **Customer** (`david.miller@example.com`).
- Secure signup, login, logout, and forgot password recovery flow.

### 2. Visual Store Builder & Live Customizer
- Custom store title, tagline, description, and unique URL slug (`/store/your-slug`).
- Dynamic primary brand theme colors (with Shopify presets: Emerald, Indigo, Royal Blue, Sunset Crimson, Obsidian, and hex color wheel).
- Custom logo & banner photography upload/picker.
- Customizable top announcement banner bar (e.g. *"Free express shipping over $75"*).
- Homepage section toggles: Hero banner, featured curations, newsletter capture.
- Real-time side-by-side interactive preview frame.

### 3. Product Catalog & Variant Management
- Add, edit, delete, duplicate, and toggle active/draft status.
- Support for regular price & promotional sale prices with auto-calculated percentage badges.
- SKU inventory tracking & low stock alerts.
- Multi-select size matrix (XS, S, M, L, XL, XXL, 32, US 10).
- Visual color swatches with hex color picker.
- One-click high-resolution product photography presets (Hoodie, Sneakers, Tote Bag, Linen Shirt, Earbuds, Watch).

### 4. Dedicated Public Storefronts (`/store/:slug`)
- Multi-tenant isolated storefronts (e.g. `/store/aurora-apparel`, `/store/volt-gear`).
- Branded header, search bar, and category filter pills.
- Sorting by Featured, Price (Low to High), Price (High to Low).
- Interactive product cards with hover zoom and quick view modal.
- Product detail modal with image gallery, size and color swatch selectors, and quantity steppers.

### 5. Order Management & Fulfillment
- Order lifecycle tracking: **Pending ➔ Processing ➔ Shipped ➔ Delivered (or Cancelled)**.
- Payment status updater: **Paid ➔ Pending ➔ Failed ➔ Refunded**.
- Customer delivery address details & customer notes.
- Printable packing slip & invoice viewer with store branding.

### 6. SaaS Subscription System
- **Starter (Free 14-day trial)**: Up to 10 products, 1 store, basic analytics.
- **Pro Merchant ($29/mo or $290/yr)**: Up to 100 products, 3 stores, custom branding, UPI QR, full analytics.
- **Enterprise Scale ($79/mo or $790/yr)**: Unlimited products, 10 stores, custom domains, 0% platform fee.
- Monthly & Yearly billing toggle with **20% savings badge**.
- Real-time catalog product quota meter with warning banner and 1-click upgrade checkout modal.

### 7. Super Admin Control Dashboard
- Platform GMV, total stores count, total products count, and total orders processed.
- Monthly Recurring Revenue (MRR) tracking from active subscriptions.
- Global stores directory with tenant suspension/reactivation toggle.
- Users & roles directory.
- Platform governance settings (trial length, platform fee, maintenance mode).

### 8. Payment Gateways: UPI QR & Cash on Delivery
- **Separation of Concerns:** Customer storefront order payments go directly to the merchant, completely separate from platform SaaS subscription fees.
- **Merchant Direct UPI Payments:** Store owners enter their VPA ID (e.g. `aurorawear@oksbi`) and store name to dynamically generate a scannable UPI QR code (`upi://pay?pa=...`) for instant settlement with GPay, PhonePe, Paytm, or BHIM.
- **Cash on Delivery (COD):** Toggleable option for buyers to pay the courier upon package delivery.

### 9. Real-Time Merchant Analytics
- Paid revenue, total order volume, average order value (AOV), and inventory health metrics.
- 7-day revenue bar chart visualization.
- Top revenue-generating products list.
- Recent orders transaction log.

### 10. Security & PostgreSQL Row Level Security (RLS)
- Dedicated database migration file at `src/sql/supabase_schema.sql`.
- Full schemas for `profiles`, `stores`, `products`, `orders`, and `subscriptions`.
- Strict RLS policies enforcing tenant isolation:
  - Merchants can only view and mutate their own stores, products, and orders.
  - Customers can only view their own orders and active public stores.
  - Super admins have global platform oversight via `is_super_admin()` security definer function.
- Resilient client fallback architecture so the app runs smoothly both offline and when connected to Supabase.

---

## 🚀 How to Run Locally

```bash
# Navigate to directory
cd C:\Users\User\.gemini\antigravity\scratch\storenova

# Start the dev server
npm run dev

# Open in browser
http://localhost:5173/
```

To connect your Supabase project:
1. Create a `.env` file in `C:\Users\User\.gemini\antigravity\scratch\storenova\.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Copy and execute `src/sql/supabase_schema.sql` inside your Supabase SQL Editor.
