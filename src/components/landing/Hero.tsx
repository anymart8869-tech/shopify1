import React from 'react';
import { Sparkles, ArrowRight, CheckCircle, ShieldCheck, Zap, Store, QrCode, TrendingUp, Layers } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HeroProps {
  onNavigate: (view: string, slug?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { stores } = useStore();
  const demoStore = stores[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -top-32 right-10 w-80 h-80 bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Next-Generation Shopify-grade Multi-Tenant SaaS</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Build, Brand & Scale Your Online Store{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Without Code
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            StoreNova gives every merchant an autonomous branded storefront, custom domain/slug, product management with size & color variants, real-time UPI QR & COD checkout, and automated order fulfillment.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('merchant-dashboard', 'builder')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
            >
              <span>Launch Your Store Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {demoStore && (
              <button
                onClick={() => onNavigate('storefront', demoStore.slug)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4 text-emerald-400" />
                <span>Visit Live Demo Storefront</span>
              </button>
            )}
          </div>

          {/* Value Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-y-3 gap-x-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Instant UPI QR & COD Payments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Dedicated Public Storefront URLs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>PostgreSQL Tenant Isolation (RLS)</span>
            </div>
          </div>
        </div>

        {/* Floating Preview Card Graphic */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          <div className="relative rounded-2xl border border-slate-700/80 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-4 sm:p-6 overflow-hidden">
            {/* Top browser-like bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <div className="ml-4 px-3 py-1 rounded-md bg-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                  <span className="text-emerald-400">https://</span>
                  <span>storenova.io/store/aurora-apparel</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  Tenant Live
                </span>
              </div>
            </div>

            {/* Dashboard & Store Preview Dual split */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
              {/* Left: Merchant Admin Teaser */}
              <div className="md:col-span-5 bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Merchant Live Pulse
                  </span>
                  <span className="text-[10px] text-slate-400">Aurora Wear</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <p className="text-[10px] text-slate-400">Today's Revenue</p>
                    <p className="text-base font-bold text-white">$1,428.50</p>
                    <p className="text-[9px] text-emerald-400">+18.4% vs last week</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <p className="text-[10px] text-slate-400">Orders Processed</p>
                    <p className="text-base font-bold text-white">38 orders</p>
                    <p className="text-[9px] text-cyan-400">100% fulfilled</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-slate-300 font-medium">Recent Order #ORD-98214</span>
                    <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded">UPI Paid</span>
                  </div>
                  <p className="text-[10px] text-slate-400">David Miller · Heavyweight Boxy Hoodie</p>
                </div>
              </div>

              {/* Right: Public Storefront Teaser */}
              <div className="md:col-span-7 bg-white text-slate-900 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">
                        A
                      </div>
                      <span className="font-bold text-xs text-slate-900">Aurora Minimalist Wear</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                        Curated Collection
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="border border-slate-100 rounded-lg p-2 bg-slate-50 flex items-center gap-2.5">
                      <img
                        src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=120&auto=format&fit=crop&q=80"
                        alt="Hoodie"
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="text-left text-xs">
                        <p className="font-semibold text-slate-800 line-clamp-1">Relaxed Boxy Hoodie</p>
                        <p className="text-emerald-700 font-bold">$69 <span className="line-through text-slate-400 text-[10px]">$89</span></p>
                      </div>
                    </div>
                    <div className="border border-slate-100 rounded-lg p-2 bg-slate-50 flex items-center gap-2.5">
                      <img
                        src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=120&auto=format&fit=crop&q=80"
                        alt="Tote"
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="text-left text-xs">
                        <p className="font-semibold text-slate-800 line-clamp-1">Structured Leather Tote</p>
                        <p className="text-emerald-700 font-bold">$115 <span className="line-through text-slate-400 text-[10px]">$135</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px] flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    Accepts Merchant UPI & COD
                  </span>
                  <button
                    onClick={() => onNavigate('storefront', 'aurora-apparel')}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    Enter Live Storefront →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
