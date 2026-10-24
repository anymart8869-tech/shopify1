import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { RoleSwitcherBar } from './components/common/RoleSwitcherBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Hero } from './components/landing/Hero';
import { Features } from './components/landing/Features';
import { PricingTable } from './components/landing/PricingTable';
import { LiveStoresShowcase } from './components/landing/LiveStoresShowcase';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { MerchantDashboard } from './components/merchant/MerchantDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { StorefrontLayout } from './components/storefront/StorefrontLayout';

export function StoreNovaApp() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [storeSlug, setStoreSlug] = useState<string>('aurora-apparel');
  const [merchantTab, setMerchantTab] = useState<string>('analytics');

  // Handle Hash or programmatic navigation
  const navigate = (view: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (view === 'storefront') {
      if (param) setStoreSlug(param);
      setCurrentView('storefront');
      window.location.hash = `/store/${param || storeSlug}`;
    } else if (view === 'merchant-dashboard') {
      if (param) setMerchantTab(param);
      setCurrentView('merchant-dashboard');
      window.location.hash = `/merchant/${param || merchantTab}`;
    } else {
      setCurrentView(view);
      window.location.hash = `/${view}`;
    }
  };

  // Listen to hash changes on initial load
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash.startsWith('store/')) {
        const slug = hash.split('/')[1];
        if (slug) {
          setStoreSlug(slug);
          setCurrentView('storefront');
        }
      } else if (hash.startsWith('merchant')) {
        const tab = hash.split('/')[1] || 'analytics';
        setMerchantTab(tab);
        setCurrentView('merchant-dashboard');
      } else if (hash === 'admin') {
        setCurrentView('admin');
      } else if (hash === 'login') {
        setCurrentView('login');
      } else if (hash === 'register') {
        setCurrentView('register');
      } else if (hash === 'pricing') {
        setCurrentView('pricing');
      } else if (hash === 'features') {
        setCurrentView('features');
      } else if (hash === 'stores-showcase') {
        setCurrentView('stores-showcase');
      } else if (!hash) {
        setCurrentView('landing');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      {/* 1. Quick Role Switcher Banner (Super Admin / Store Owner / Customer) */}
      <RoleSwitcherBar onNavigate={navigate} currentView={currentView} />

      {/* 2. Platform Navbar (shown on landing, platform views, auth, and admin) */}
      {currentView !== 'storefront' && (
        <Navbar onNavigate={navigate} currentView={currentView} />
      )}

      {/* 3. Main Dynamic Content */}
      <main className="flex-1">
        {/* Landing View */}
        {currentView === 'landing' && (
          <>
            <Hero onNavigate={navigate} />
            <Features onNavigate={navigate} />
            <LiveStoresShowcase onNavigate={navigate} />
            <PricingTable onNavigate={navigate} />
          </>
        )}

        {/* Features View */}
        {currentView === 'features' && (
          <div className="pt-6">
            <Features onNavigate={navigate} />
            <PricingTable onNavigate={navigate} />
          </div>
        )}

        {/* Pricing View */}
        {currentView === 'pricing' && (
          <div className="pt-6">
            <PricingTable onNavigate={navigate} />
          </div>
        )}

        {/* Stores Showcase View */}
        {currentView === 'stores-showcase' && (
          <div className="pt-6">
            <LiveStoresShowcase onNavigate={navigate} />
          </div>
        )}

        {/* Auth Views */}
        {currentView === 'login' && <LoginForm onNavigate={navigate} />}
        {currentView === 'register' && <RegisterForm onNavigate={navigate} />}

        {/* Merchant Dashboard */}
        {currentView === 'merchant-dashboard' && (
          <MerchantDashboard initialTab={merchantTab} onNavigate={navigate} />
        )}

        {/* Super Admin Control Panel */}
        {currentView === 'admin' && (
          <SuperAdminDashboard onNavigate={navigate} />
        )}

        {/* Public Tenant Storefront (/store/:slug) */}
        {currentView === 'storefront' && (
          <StorefrontLayout storeSlug={storeSlug} onNavigate={navigate} />
        )}
      </main>

      {/* 4. Platform Footer (hidden inside customer storefront to maintain tenant immersion) */}
      {currentView !== 'storefront' && (
        <Footer onNavigate={navigate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <StoreNovaApp />
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
