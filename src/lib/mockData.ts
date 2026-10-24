import { UserProfile, Store, Product, Order, SubscriptionPlan, Subscription } from '../types';

export const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_starter',
    name: 'Starter',
    slug: 'starter',
    price_monthly: 0,
    price_yearly: 0,
    product_limit: 10,
    store_limit: 1,
    features: [
      'Up to 10 products',
      '1 Public storefront',
      'COD & Merchant UPI Payments',
      'Standard SSL & Mobile Storefront',
      'Basic Order Analytics',
      'Email Support'
    ],
    is_popular: false
  },
  {
    id: 'plan_growth',
    name: 'Pro Merchant',
    slug: 'growth',
    price_monthly: 29,
    price_yearly: 290,
    product_limit: 100,
    store_limit: 3,
    features: [
      'Up to 100 products',
      'Up to 3 Active Storefronts',
      '0% Platform Transaction Fee',
      'Full Theme Customizer & Brand Colors',
      'Merchant UPI QR Code Generator',
      'Advanced Sales & Revenue Analytics',
      'Inventory Stock Tracking & Alerts',
      'Priority 24/7 Support'
    ],
    is_popular: true
  },
  {
    id: 'plan_scale',
    name: 'Enterprise Scale',
    slug: 'scale',
    price_monthly: 79,
    price_yearly: 790,
    product_limit: 1000,
    store_limit: 10,
    features: [
      'Unlimited Products',
      'Up to 10 Online Stores',
      'Custom Domain Support',
      'Real-time Webhook Integrations',
      'Dedicated Account Manager',
      'Automated Order Invoicing',
      'Custom CSS & JavaScript Injection',
      '99.99% Guaranteed SLA Uptime'
    ],
    is_popular: false
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user_admin',
    email: 'admin@storenova.io',
    full_name: 'Alex Vance (Super Admin)',
    role: 'super_admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-10T00:00:00.000Z'
  },
  {
    id: 'user_merchant_1',
    email: 'sarah@aurorastores.com',
    full_name: 'Sarah Jenkins',
    role: 'store_owner',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-02-01T00:00:00.000Z'
  },
  {
    id: 'user_customer_1',
    email: 'david.miller@example.com',
    full_name: 'David Miller',
    role: 'customer',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-03-01T00:00:00.000Z'
  }
];

export const INITIAL_STORES: Store[] = [
  {
    id: 'store_aurora',
    owner_id: 'user_merchant_1',
    name: 'Aurora Minimalist Wear',
    slug: 'aurora-apparel',
    tagline: 'Timeless modern essentials crafted sustainably',
    description: 'Elevated, sustainable minimalist wardrobe staples for contemporary living. Responsibly sourced organic fabrics designed to last.',
    logo_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80',
    primary_color: '#008060', // Shopify Emerald Green
    accent_color: '#004c3f',
    background_color: '#fafafa',
    currency: 'USD',
    currency_symbol: '$',
    contact_email: 'hello@aurorawear.com',
    contact_phone: '+1 (555) 234-5678',
    address: '420 Broadway Suite 4B, New York, NY 10013',
    status: 'active',
    layout_settings: {
      hero_title: 'Pure Aesthetics. Uncompromising Comfort.',
      hero_subtitle: 'Discover our Autumn-Winter Capsule Collection engineered from 100% certified organic cotton.',
      hero_button_text: 'Explore Collection',
      show_featured_products: true,
      show_announcement: true,
      announcement_text: '✨ Free standard express shipping on all orders over $75 | Code: AURORAFREE',
      show_newsletter: true,
      show_reviews: true,
      show_categories: true
    },
    payment_settings: {
      cod_enabled: true,
      upi_enabled: true,
      upi_id: 'aurorawear@oksbi',
      upi_name: 'Aurora Minimalist Studio',
      qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=aurorawear@oksbi%26pn=Aurora%20Wear%26cu=INR'
    },
    created_at: '2026-02-05T00:00:00.000Z'
  },
  {
    id: 'store_volt',
    owner_id: 'user_merchant_1',
    name: 'Volt Urban Kicks',
    slug: 'volt-gear',
    tagline: 'Next-gen street footwear and tech wearables',
    description: 'High-performance athletic sneakers and cutting-edge urban tech accessories engineered for modern creators.',
    logo_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=200&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&auto=format&fit=crop&q=80',
    primary_color: '#6366f1', // Indigo / Electric Purple
    accent_color: '#4338ca',
    background_color: '#ffffff',
    currency: 'USD',
    currency_symbol: '$',
    contact_email: 'support@voltkicks.com',
    contact_phone: '+1 (555) 987-6543',
    address: '780 Mission St, San Francisco, CA 94103',
    status: 'active',
    layout_settings: {
      hero_title: 'Step Into The Future of Urban Motion',
      hero_subtitle: 'Limited release drops featuring dynamic cloud cushioning and ultra-breathable matrix knit.',
      hero_button_text: 'Shop Drop #04',
      show_featured_products: true,
      show_announcement: true,
      announcement_text: '⚡ Midnight Drop Alert: Volt HyperShift Pro is now live in limited quantities!',
      show_newsletter: true,
      show_reviews: true,
      show_categories: true
    },
    payment_settings: {
      cod_enabled: true,
      upi_enabled: true,
      upi_id: 'voltkicks@icici',
      upi_name: 'Volt Urban Lab',
      qr_code_url: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=voltkicks@icici%26pn=Volt%20Kicks%26cu=INR'
    },
    created_at: '2026-02-18T00:00:00.000Z'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // Aurora Apparel Products
  {
    id: 'prod_1',
    store_id: 'store_aurora',
    name: 'Heavyweight Relaxed Boxy Hoodie',
    slug: 'heavyweight-boxy-hoodie',
    description: 'Crafted from 480 GSM French Terry cotton. Features double-lined hood, ribbed cuffs, and seamless drop shoulders for maximum comfort and silhouette.',
    category: 'Outerwear',
    price: 89,
    discount_price: 69,
    sku: 'AUR-HD-001',
    stock: 42,
    is_active: true,
    is_featured: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Oatmeal Heather', hex: '#e3dcce' },
      { name: 'Washed Black', hex: '#1e1e1e' },
      { name: 'Sage Green', hex: '#879b83' }
    ],
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&auto=format&fit=crop&q=80'
    ],
    created_at: '2026-02-06T00:00:00.000Z'
  },
  {
    id: 'prod_2',
    store_id: 'store_aurora',
    name: 'Everyday Minimalist Structured Tote',
    slug: 'structured-tote-bag',
    description: 'Full-grain pebble leather tote with reinforced padded laptop sleeve, magnetic brass closure, and internal water bottle pocket.',
    category: 'Bags & Accessories',
    price: 135,
    discount_price: 115,
    sku: 'AUR-TT-002',
    stock: 18,
    is_active: true,
    is_featured: true,
    sizes: ['One Size'],
    colors: [
      { name: 'Saddle Tan', hex: '#965a38' },
      { name: 'Midnight Obsidian', hex: '#111827' }
    ],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80'
    ],
    created_at: '2026-02-08T00:00:00.000Z'
  },
  {
    id: 'prod_3',
    store_id: 'store_aurora',
    name: 'Tailored Linen Camp Collar Shirt',
    slug: 'tailored-linen-shirt',
    description: 'Pre-washed breathable Belgian flax linen shirt with mother-of-pearl buttons. Relaxed straight fit with side vents.',
    category: 'Shirts',
    price: 75,
    discount_price: 58,
    sku: 'AUR-SH-003',
    stock: 27,
    is_active: true,
    is_featured: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Natural Sand', hex: '#d9cdb8' },
      { name: 'Sky Mist', hex: '#c0d6df' }
    ],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80'
    ],
    created_at: '2026-02-10T00:00:00.000Z'
  },
  {
    id: 'prod_4',
    store_id: 'store_aurora',
    name: 'Wide-Leg Pleated Chino Trouser',
    slug: 'wide-leg-pleated-chino',
    description: 'High-waisted cotton twill trousers with deep double front pleats and tailored horn button waistband.',
    category: 'Bottoms',
    price: 95,
    sku: 'AUR-TR-004',
    stock: 14,
    is_active: true,
    is_featured: false,
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Khaki Beige', hex: '#c5b59f' },
      { name: 'Olive Drab', hex: '#5b6348' }
    ],
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80'
    ],
    created_at: '2026-02-12T00:00:00.000Z'
  },
  // Volt Gear Products
  {
    id: 'prod_5',
    store_id: 'store_volt',
    name: 'Volt HyperShift Aero Runner',
    slug: 'hypershift-aero-runner',
    description: 'Ultra-responsive nitrogen-infused foam midsole with carbon fiber propulsion plate. Engineered breathable mesh upper for marathon performance and city wear.',
    category: 'Footwear',
    price: 165,
    discount_price: 139,
    sku: 'VLT-RN-101',
    stock: 35,
    is_active: true,
    is_featured: true,
    sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    colors: [
      { name: 'Volt Cyber Neon', hex: '#39ff14' },
      { name: 'Stealth Carbon', hex: '#1a1a1a' },
      { name: 'Glacier White', hex: '#f0f4f8' }
    ],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80'
    ],
    created_at: '2026-02-19T00:00:00.000Z'
  },
  {
    id: 'prod_6',
    store_id: 'store_volt',
    name: 'Acoustic Core ANC Earbuds',
    slug: 'acoustic-core-anc-earbuds',
    description: '45dB Hybrid Active Noise Cancellation, Bluetooth 5.4 LE Audio, and 36-hour wireless battery case with fast wireless charging.',
    category: 'Wearables',
    price: 129,
    discount_price: 99,
    sku: 'VLT-AUD-102',
    stock: 50,
    is_active: true,
    is_featured: true,
    sizes: ['Standard'],
    colors: [
      { name: 'Matte Charcoal', hex: '#262626' },
      { name: 'Pure Platinum', hex: '#e5e7eb' }
    ],
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'
    ],
    created_at: '2026-02-21T00:00:00.000Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-98214',
    store_id: 'store_aurora',
    customer_id: 'user_customer_1',
    customer_name: 'David Miller',
    customer_email: 'david.miller@example.com',
    customer_phone: '+1 (555) 741-8529',
    shipping_address: {
      fullName: 'David Miller',
      email: 'david.miller@example.com',
      phone: '+1 (555) 741-8529',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      country: 'United States'
    },
    items: [
      {
        product_id: 'prod_1',
        product_name: 'Heavyweight Relaxed Boxy Hoodie',
        product_image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
        price: 69,
        quantity: 1,
        size: 'L',
        color: 'Oatmeal Heather'
      },
      {
        product_id: 'prod_2',
        product_name: 'Everyday Minimalist Structured Tote',
        product_image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
        price: 115,
        quantity: 1,
        size: 'One Size',
        color: 'Saddle Tan'
      }
    ],
    subtotal: 184,
    discount: 0,
    total: 184,
    payment_method: 'upi',
    payment_status: 'paid',
    status: 'processing',
    transaction_id: 'UPI-REF-89230192',
    notes: 'Please leave package at front door.',
    created_at: '2026-10-23T14:32:00.000Z'
  },
  {
    id: 'ORD-98215',
    store_id: 'store_aurora',
    customer_name: 'Sophia Chen',
    customer_email: 'sophia.chen@example.com',
    customer_phone: '+1 (555) 369-2581',
    shipping_address: {
      fullName: 'Sophia Chen',
      email: 'sophia.chen@example.com',
      phone: '+1 (555) 369-2581',
      street: '1288 California St Apt 5C',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94109',
      country: 'United States'
    },
    items: [
      {
        product_id: 'prod_3',
        product_name: 'Tailored Linen Camp Collar Shirt',
        product_image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
        price: 58,
        quantity: 2,
        size: 'M',
        color: 'Natural Sand'
      }
    ],
    subtotal: 116,
    discount: 10,
    total: 106,
    payment_method: 'cod',
    payment_status: 'pending',
    status: 'shipped',
    transaction_id: '',
    created_at: '2026-10-22T09:15:00.000Z'
  },
  {
    id: 'ORD-98216',
    store_id: 'store_aurora',
    customer_name: 'Marcus Williams',
    customer_email: 'marcus.w@example.com',
    customer_phone: '+1 (555) 852-9630',
    shipping_address: {
      fullName: 'Marcus Williams',
      email: 'marcus.w@example.com',
      phone: '+1 (555) 852-9630',
      street: '512 North Michigan Ave',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60611',
      country: 'United States'
    },
    items: [
      {
        product_id: 'prod_4',
        product_name: 'Wide-Leg Pleated Chino Trouser',
        product_image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80',
        price: 95,
        quantity: 1,
        size: '32',
        color: 'Khaki Beige'
      }
    ],
    subtotal: 95,
    discount: 0,
    total: 95,
    payment_method: 'cod',
    payment_status: 'paid',
    status: 'delivered',
    transaction_id: '',
    created_at: '2026-10-20T11:45:00.000Z'
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_sarah_1',
    user_id: 'user_merchant_1',
    store_id: 'store_aurora',
    plan_id: 'plan_growth',
    billing_cycle: 'monthly',
    status: 'active',
    current_period_start: '2026-10-01T00:00:00.000Z',
    current_period_end: '2026-11-01T00:00:00.000Z',
    created_at: '2026-02-01T00:00:00.000Z'
  }
];
