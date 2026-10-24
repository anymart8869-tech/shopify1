import React from 'react';
import { ShoppingBag, ShieldCheck, Zap, Heart, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, slug?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Store<span className="text-emerald-400">Nova</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering merchants globally to build, brand, and scale multi-tenant online storefronts with zero code and instant UPI + COD checkout.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Multi-Tenant RLS Architecture</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('merchant-dashboard', 'builder')} className="hover:text-emerald-400 transition-colors">
                  Visual Store Builder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('merchant-dashboard', 'products')} className="hover:text-emerald-400 transition-colors">
                  Product Catalog & Inventory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('merchant-dashboard', 'orders')} className="hover:text-emerald-400 transition-colors">
                  Order Management & Invoicing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('merchant-dashboard', 'analytics')} className="hover:text-emerald-400 transition-colors">
                  Sales & Revenue Analytics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-emerald-400 transition-colors">
                  Subscription Plans
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Live Demo Stores</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('storefront', 'aurora-apparel')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Aurora Minimalist Wear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('storefront', 'volt-gear')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  Volt Urban Kicks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-cyan-400">
                  <Zap className="w-3.5 h-3.5" />
                  Super Admin Management Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Payments & Security</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Merchant UPI QR Instant Pay
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Cash on Delivery (COD)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                PostgreSQL Row Level Security
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Supabase Cloud & Auth Ready
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} StoreNova Inc. All rights reserved. Crafted for modern creators & merchants.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> on React & Tailwind
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
