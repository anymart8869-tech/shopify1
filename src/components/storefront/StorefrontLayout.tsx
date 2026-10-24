import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { Store, Product, Order } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { OrderSuccessModal } from './OrderSuccessModal';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  QrCode, 
  Truck, 
  Mail, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  ExternalLink, 
  Layers,
  ArrowRight,
  Star,
  Check
} from 'lucide-react';

interface StorefrontLayoutProps {
  storeSlug: string;
  onNavigate: (view: string, slug?: string) => void;
}

export const StorefrontLayout: React.FC<StorefrontLayoutProps> = ({ storeSlug, onNavigate }) => {
  const { getStoreBySlug, getStoreProducts } = useStore();
  const { setStoreScope, totalItems, setIsOpen } = useCart();

  const store = getStoreBySlug(storeSlug);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Sync cart scope to this store
  useEffect(() => {
    if (storeSlug) {
      setStoreScope(storeSlug);
    }
  }, [storeSlug, setStoreScope]);

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Store Not Found</h2>
          <p className="text-xs text-slate-500">
            The store "/store/{storeSlug}" does not exist or may have been suspended.
          </p>
          <button
            onClick={() => onNavigate('landing')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            Return to StoreNova Home
          </button>
        </div>
      </div>
    );
  }

  const products = getStoreProducts(store.id);
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Filtering & Sorting
  let filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return p.is_active && matchesSearch && matchesCategory;
  });

  if (sortBy === 'price-asc') {
    filteredProducts.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price));
  } else if (sortBy === 'price-desc') {
    filteredProducts.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price));
  } else {
    // Featured first
    filteredProducts.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  const { layout_settings, payment_settings } = store;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-slate-900 selection:text-white">
      <div>
        {/* 1. Announcement Bar */}
        {layout_settings.show_announcement && (
          <div
            style={{ backgroundColor: store.primary_color }}
            className="text-white text-xs font-semibold py-2 px-4 text-center tracking-wide shadow-xs"
          >
            {layout_settings.announcement_text}
          </div>
        )}

        {/* 2. Branded Storefront Navigation Header */}
        <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-18">
              {/* Logo & Store Identity */}
              <div className="flex items-center gap-3">
                <img
                  src={store.logo_url}
                  alt={store.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h1 className="font-extrabold text-lg text-slate-900 tracking-tight leading-snug">
                    {store.name}
                  </h1>
                  <p className="text-[10px] text-slate-400 hidden sm:block line-clamp-1">{store.tagline}</p>
                </div>
              </div>

              {/* Middle Search Bar */}
              <div className="hidden md:flex items-center relative w-72 lg:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={`Search in ${store.name}...`}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Right: Cart Button & Platform Pill */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(true)}
                  style={{ backgroundColor: store.primary_color }}
                  className="relative flex items-center gap-2 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all hover:opacity-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Cart</span>
                  <span className="w-5 h-5 rounded-full bg-white text-slate-900 flex items-center justify-center text-[10px] font-black shadow-xs">
                    {totalItems}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* 3. Hero Section */}
        <section className="relative overflow-hidden bg-slate-950 text-white min-h-[380px] sm:min-h-[440px] flex items-center">
          <img
            src={store.banner_url}
            alt={store.name}
            className="absolute inset-0 w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
            <div className="max-w-2xl space-y-4">
              <span
                style={{ backgroundColor: `${store.primary_color}40`, borderColor: store.primary_color }}
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white border backdrop-blur-xs"
              >
                Official Online Store
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md">
                {layout_settings.hero_title}
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed drop-shadow-sm max-w-xl">
                {layout_settings.hero_subtitle}
              </p>
              <div className="pt-2">
                <a
                  href="#catalog"
                  style={{ backgroundColor: store.primary_color }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-xs shadow-lg transition-all hover:scale-105"
                >
                  <span>{layout_settings.hero_button_text}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Catalog & Product Filters Section */}
        <main id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    backgroundColor: selectedCategory === cat ? store.primary_color : undefined,
                    color: selectedCategory === cat ? '#ffffff' : undefined
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort & Count */}
            <div className="flex items-center justify-between w-full md:w-auto gap-3 text-xs">
              <span className="text-slate-500 font-medium">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Available
              </span>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No items match your search</h3>
              <p className="text-xs text-slate-500">Try selecting another category or clear your search query.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  store={store}
                  onQuickView={p => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}

          {/* 5. Payment Methods Highlights */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Instant UPI QR Pay</h4>
                <p className="text-[11px] text-slate-500">Direct merchant settlement with zero transaction fees</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Cash on Delivery (COD)</h4>
                <p className="text-[11px] text-slate-500">Convenient payment on physical courier handover</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Verified Merchant</h4>
                <p className="text-[11px] text-slate-500">Autonomous store powered by StoreNova Multi-Tenant SaaS</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 6. Branded Storefront Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-100">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img src={store.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                <h3 className="font-bold text-base text-slate-900">{store.name}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                {store.description}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Customer Support</h4>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{store.contact_email}</span>
              </p>
              {store.contact_phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{store.contact_phone}</span>
                </p>
              )}
              {store.address && (
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{store.address}</span>
                </p>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">StoreNova Platform</h4>
              <p className="text-xs text-slate-500">
                Want to build your own online brand without code? Launch in 60 seconds with StoreNova.
              </p>
              <button
                onClick={() => onNavigate('landing')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>Launch Your Store Like {store.name}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <p>© {new Date().getFullYear()} {store.name}. Powered by StoreNova SaaS Platform.</p>
            <button
              onClick={() => onNavigate('merchant-dashboard', 'builder')}
              className="text-slate-500 hover:text-slate-800 font-medium"
            >
              Merchant Admin Login
            </button>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer
        store={store}
        onProceedToCheckout={discountVal => {
          setAppliedDiscount(discountVal);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        store={store}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={() => {
          setSelectedProduct(null);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        store={store}
        discount={appliedDiscount}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={order => {
          setIsCheckoutOpen(false);
          setCompletedOrder(order);
        }}
      />

      {/* Order Success Confetti Modal */}
      <OrderSuccessModal
        order={completedOrder}
        store={store}
        onClose={() => setCompletedOrder(null)}
        onViewInMerchant={() => onNavigate('merchant-dashboard', 'orders')}
      />
    </div>
  );
};
