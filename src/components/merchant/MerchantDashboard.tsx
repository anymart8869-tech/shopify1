import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { AnalyticsView } from './AnalyticsView';
import { ProductsView } from './ProductsView';
import { OrdersView } from './OrdersView';
import { StoreBuilderView } from './StoreBuilderView';
import { SubscriptionView } from './SubscriptionView';
import { StoreSettingsView } from './StoreSettingsView';
import { 
  BarChart3, 
  ShoppingBag, 
  Package, 
  Palette, 
  CreditCard, 
  Settings, 
  Store, 
  ExternalLink, 
  Plus, 
  ChevronDown,
  Sparkles,
  X
} from 'lucide-react';

interface MerchantDashboardProps {
  initialTab?: string;
  onNavigate: (view: string, slug?: string) => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ initialTab = 'analytics', onNavigate }) => {
  const { stores, activeStore, activeStoreId, setActiveStoreId, createStore } = useStore();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [storeDropdown, setStoreDropdown] = useState(false);
  const [showNewStoreModal, setShowNewStoreModal] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');

  if (!activeStore) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-slate-600">No stores found. Let's create your first store!</p>
          <button
            onClick={() => setShowNewStoreModal(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            Create Store
          </button>
        </div>
      </div>
    );
  }

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) return;

    const created = createStore({
      name: newStoreName.trim(),
      contact_email: user?.email || 'contact@store.com'
    });

    setNewStoreName('');
    setShowNewStoreModal(false);
    setActiveStoreId(created.id);
    setActiveTab('builder');
  };

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'builder', label: 'Store Builder', icon: Palette },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'settings', label: 'Settings & Payments', icon: Settings },
  ];

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-50/50 pb-20">
      {/* Merchant Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-[65px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
            {/* Store Switcher & Branding */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setStoreDropdown(!storeDropdown)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left bg-white shadow-xs"
                >
                  <img
                    src={activeStore.logo_url}
                    alt={activeStore.name}
                    className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">{activeStore.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">/store/{activeStore.slug}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </button>

                {storeDropdown && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Active Store
                    </div>
                    {stores.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setActiveStoreId(s.id);
                          setStoreDropdown(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-50 ${
                          s.id === activeStore.id ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <div className="truncate">
                          <p className="truncate">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">/{s.slug}</p>
                        </div>
                        {s.id === activeStore.id && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        )}
                      </button>
                    ))}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setStoreDropdown(false);
                          setShowNewStoreModal(true);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-emerald-700 hover:bg-emerald-50 font-bold flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Another Store</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Tenant Live</span>
              </div>
            </div>

            {/* Quick Preview Public Storefront Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('storefront', activeStore.slug)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                <span>Visit Public Storefront</span>
                <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-100 pt-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'products' && (
          <ProductsView onNavigateToSubscription={() => setActiveTab('subscription')} />
        )}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'builder' && (
          <StoreBuilderView onNavigateToStorefront={slug => onNavigate('storefront', slug)} />
        )}
        {activeTab === 'subscription' && <SubscriptionView />}
        {activeTab === 'settings' && <StoreSettingsView />}
      </div>

      {/* New Store Creation Modal */}
      {showNewStoreModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Create A New Store</h3>
              </div>
              <button
                onClick={() => setShowNewStoreModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStore} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Store Name</label>
                <input
                  type="text"
                  required
                  value={newStoreName}
                  onChange={e => setNewStoreName(e.target.value)}
                  placeholder="e.g. Neo Tokyo Apparel"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {newStoreName && (
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    Public Slug: /store/{newStoreName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewStoreModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20"
                >
                  Launch Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
