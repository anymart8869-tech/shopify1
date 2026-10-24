import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Store, Shield, LayoutDashboard, LogOut, ChevronDown, Sparkles, User, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: string, slug?: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const { user, isAuthenticated, logout, role } = useAuth();
  const { activeStore, stores } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-[41px] z-40 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Store<span className="text-emerald-600">Nova</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                    SaaS
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 hidden sm:block">Multi-Tenant E-Commerce</p>
              </div>
            </button>

            {/* Nav links */}
            <div className="hidden md:flex items-center space-x-1 text-sm font-medium text-slate-600">
              <button
                onClick={() => onNavigate('landing')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'landing' ? 'text-emerald-700 bg-emerald-50' : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => onNavigate('features')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'features' ? 'text-emerald-700 bg-emerald-50' : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Features
              </button>
              <button
                onClick={() => onNavigate('pricing')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'pricing' ? 'text-emerald-700 bg-emerald-50' : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Pricing Plans
              </button>
              <button
                onClick={() => onNavigate('stores-showcase')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'stores-showcase' ? 'text-emerald-700 bg-emerald-50' : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Explore Stores
              </button>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Quick Link to Merchant / Admin dashboard */}
            {role === 'super_admin' ? (
              <button
                onClick={() => onNavigate('admin')}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Super Admin Panel</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('merchant-dashboard')}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-700" />
                <span>Merchant Dashboard</span>
              </button>
            )}

            {/* Visit Active Storefront */}
            {activeStore && (
              <button
                onClick={() => onNavigate('storefront', activeStore.slug)}
                className="hidden lg:flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                title="Preview public storefront"
              >
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                <span>Storefront</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            )}

            {/* Auth Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
                >
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                    alt={user.full_name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500/40"
                  />
                  <div className="hidden sm:block text-left text-xs leading-tight">
                    <p className="font-semibold text-slate-900 truncate max-w-[120px]">{user.full_name}</p>
                    <p className="text-[10px] text-emerald-600 capitalize font-medium">{user.role.replace('_', ' ')}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                    </div>

                    <div className="py-1 text-xs">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onNavigate('merchant-dashboard');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
                        Merchant Dashboard
                      </button>

                      {role === 'super_admin' && (
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            onNavigate('admin');
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                        >
                          <Shield className="w-3.5 h-3.5 text-purple-600" />
                          Super Admin Portal
                        </button>
                      )}

                      {activeStore && (
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            onNavigate('storefront', activeStore.slug);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                        >
                          <Store className="w-3.5 h-3.5 text-cyan-600" />
                          View Storefront ({activeStore.name})
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                          onNavigate('landing');
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-xs flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="text-xs font-semibold px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="text-xs font-semibold px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm shadow-emerald-500/20"
                >
                  Sign up free
                </button>
              </div>
            )}

            {/* Launch Store CTA */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onNavigate('register');
                } else {
                  onNavigate('merchant-dashboard', 'builder');
                }
              }}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Store</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
