import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Store as StoreIcon, ExternalLink, ArrowRight, ShieldCheck, Tag, ShoppingBag, Palette } from 'lucide-react';

interface LiveStoresShowcaseProps {
  onNavigate: (view: string, slug?: string) => void;
}

export const LiveStoresShowcase: React.FC<LiveStoresShowcaseProps> = ({ onNavigate }) => {
  const { stores, getStoreProducts, setActiveStoreId } = useStore();

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <StoreIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Multi-Tenant Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Real Live Stores Built On StoreNova
          </h2>
          <p className="text-slate-600 text-base">
            Every store operates on its own dedicated URL slug with unique brand colors, custom payment options, and responsive catalog browsing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {stores.map(store => {
            const storeProducts = getStoreProducts(store.id);

            return (
              <div
                key={store.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Store Banner & Brand Header */}
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={store.banner_url}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={store.logo_url}
                          alt={store.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md bg-white"
                        />
                        <div className="text-white text-left">
                          <h3 className="font-bold text-lg leading-snug drop-shadow-sm">{store.name}</h3>
                          <p className="text-xs text-slate-300 font-mono">/store/{store.slug}</p>
                        </div>
                      </div>

                      {/* Brand color preview dot */}
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-white border border-white/20">
                        <span
                          className="w-2.5 h-2.5 rounded-full ring-1 ring-white"
                          style={{ backgroundColor: store.primary_color }}
                        />
                        <span>Theme Color</span>
                      </div>
                    </div>
                  </div>

                  {/* Store Details */}
                  <div className="p-6">
                    <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                      {store.description}
                    </p>

                    {/* Storefront Feature Badges */}
                    <div className="flex flex-wrap gap-2 text-xs mb-6">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-medium px-2.5 py-1 rounded-md border border-emerald-100">
                        <ShoppingBag className="w-3 h-3 text-emerald-600" />
                        {storeProducts.length} Live Products
                      </span>

                      {store.payment_settings.upi_enabled && (
                        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 font-medium px-2.5 py-1 rounded-md border border-purple-100">
                          Merchant UPI QR Ready
                        </span>
                      )}

                      {store.payment_settings.cod_enabled && (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 font-medium px-2.5 py-1 rounded-md border border-blue-100">
                          Cash on Delivery
                        </span>
                      )}
                    </div>

                    {/* Featured items preview */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Featured Products</p>
                      <div className="grid grid-cols-3 gap-2">
                        {storeProducts.slice(0, 3).map(prod => (
                          <div key={prod.id} className="bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex items-center gap-2">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-9 h-9 rounded object-cover"
                            />
                            <div className="text-left overflow-hidden">
                              <p className="text-[11px] font-semibold text-slate-800 truncate">{prod.name}</p>
                              <p className="text-[10px] text-emerald-700 font-bold">${prod.discount_price || prod.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
                  <button
                    onClick={() => {
                      setActiveStoreId(store.id);
                      onNavigate('merchant-dashboard', 'builder');
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Palette className="w-3.5 h-3.5 text-slate-500" />
                    <span>Customize in Admin</span>
                  </button>

                  <button
                    onClick={() => onNavigate('storefront', store.slug)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Visit Public Storefront</span>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
