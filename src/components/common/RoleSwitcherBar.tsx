import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Shield, Store as StoreIcon, User, RefreshCw, Database, Code, ChevronRight, X, ExternalLink } from 'lucide-react';
import { UserRole } from '../../types';

interface RoleSwitcherBarProps {
  onNavigate: (view: string, slug?: string) => void;
  currentView: string;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({ onNavigate, currentView }) => {
  const { user, role, switchRole } = useAuth();
  const { stores, activeStore, resetToDemoData } = useStore();
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const roles: { role: UserRole; label: string; icon: any; email: string; desc: string }[] = [
    {
      role: 'super_admin',
      label: 'Super Admin',
      icon: Shield,
      email: 'admin@storenova.io',
      desc: 'Platform metrics, manage stores, plans & users'
    },
    {
      role: 'store_owner',
      label: 'Store Owner',
      icon: StoreIcon,
      email: 'sarah@aurorastores.com',
      desc: 'Catalog, store builder, orders & analytics'
    },
    {
      role: 'customer',
      label: 'Customer',
      icon: User,
      email: 'david.miller@example.com',
      desc: 'Shop storefronts, cart & order history'
    }
  ];

  const handleRoleSelect = (targetRole: UserRole) => {
    switchRole(targetRole);
    if (targetRole === 'super_admin') {
      onNavigate('admin');
    } else if (targetRole === 'store_owner') {
      onNavigate('merchant-dashboard');
    } else {
      // Go to demo storefront or landing
      const firstStore = stores[0];
      if (firstStore) {
        onNavigate('storefront', firstStore.slug);
      } else {
        onNavigate('landing');
      }
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data (stores, products, orders, subscriptions) to clean initial state?')) {
      resetToDemoData();
      alert('Demo data restored successfully!');
    }
  };

  return (
    <>
      <div className="bg-slate-900 border-b border-slate-800 text-white text-xs px-3 sm:px-6 py-2 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Role Badges */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1.5 mr-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Switch Perspective:
            </span>

            {roles.map(r => {
              const Icon = r.icon;
              const isActive = role === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => handleRoleSelect(r.role)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  title={`${r.label}: ${r.desc}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{r.label}</span>
                  {isActive && <span className="text-[10px] bg-emerald-700/80 px-1 rounded ml-0.5">Active</span>}
                </button>
              );
            })}
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-2 sm:gap-3 text-slate-300">
            {activeStore && (
              <button
                onClick={() => onNavigate('storefront', activeStore.slug)}
                className="hidden md:flex items-center gap-1 hover:text-emerald-400 font-medium transition-colors"
                title="View live storefront"
              >
                <span>Live Store:</span>
                <span className="text-white underline decoration-emerald-500 font-semibold">{activeStore.name}</span>
                <ExternalLink className="w-3 h-3 text-emerald-400" />
              </button>
            )}

            <button
              onClick={() => setShowSqlModal(true)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="View Supabase PostgreSQL Schema & RLS Policies"
            >
              <Database className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Supabase</span> SQL
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors"
              title="Restore default test products & orders"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Schema Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center">
                  <Database className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base">Supabase PostgreSQL Schema & RLS Policies</h3>
                  <p className="text-xs text-slate-400">Multi-tenant isolation, profiles, stores, products, orders & subscriptions</p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 overflow-y-auto flex-1 font-mono text-xs text-emerald-300 select-all leading-relaxed">
              <pre className="whitespace-pre-wrap">
{`-- StoreNova PostgreSQL & Row Level Security Schema
-- File located at: src/sql/supabase_schema.sql

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table & RLS
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('super_admin', 'store_owner', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Stores Table (Multi-Tenant Core)
CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  primary_color TEXT DEFAULT '#008060',
  currency TEXT DEFAULT 'USD',
  layout_settings JSONB DEFAULT '{}',
  payment_settings JSONB DEFAULT '{"cod_enabled": true, "upi_enabled": true}',
  status TEXT DEFAULT 'active'
);
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- 4. Products Table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  discount_price NUMERIC(10, 2),
  stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  sizes JSONB DEFAULT '[]',
  colors JSONB DEFAULT '[]'
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 5. Orders Table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cod', 'upi')),
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'))
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 6. Strict Tenant Isolation Policies
CREATE POLICY "Store owners can manage their own stores"
  ON public.stores FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Store owners can manage their products"
  ON public.products FOR ALL
  USING (EXISTS (SELECT 1 FROM public.stores WHERE stores.id = products.store_id AND stores.owner_id = auth.uid()));

CREATE POLICY "Store owners can view orders for their stores"
  ON public.orders FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.stores WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid()));
`}
              </pre>
            </div>

            <div className="px-5 py-3 border-t border-slate-800 flex justify-between items-center bg-slate-900/60">
              <span className="text-xs text-slate-400">Schema file ready to run directly in Supabase SQL Editor.</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('-- Run src/sql/supabase_schema.sql in your Supabase SQL Editor');
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2000);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
              >
                {copiedSql ? '✓ Path Copied' : 'Copy File Path'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
