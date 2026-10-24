import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, 
  Store as StoreIcon, 
  Users, 
  CreditCard, 
  DollarSign, 
  Activity, 
  Search, 
  ExternalLink, 
  Ban, 
  CheckCircle, 
  Settings, 
  Database,
  ArrowUpRight,
  TrendingUp,
  Package
} from 'lucide-react';
import { INITIAL_USERS } from '../../lib/mockData';

export const SuperAdminDashboard: React.FC<{ onNavigate: (view: string, slug?: string) => void }> = ({ onNavigate }) => {
  const { stores, products, orders, plans, subscriptions, toggleStoreStatus, setActiveStoreId } = useStore();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'stores' | 'subscriptions' | 'users' | 'settings'>('stores');
  const [searchTerm, setSearchTerm] = useState('');

  // Global Platform Metrics
  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0);
  const totalStores = stores.length;
  const activeStores = stores.filter(s => s.status === 'active').length;
  const totalProducts = products.length;
  const totalOrders = orders.length;

  // Platform MRR calculation from subscriptions
  const platformMRR = subscriptions.reduce((sum, sub) => {
    const plan = plans.find(p => p.id === sub.plan_id);
    if (!plan) return sum;
    return sum + (sub.billing_cycle === 'yearly' ? Math.round(plan.price_yearly / 12) : plan.price_monthly);
  }, 0);

  const filteredStores = stores.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-100px)] bg-slate-900 text-white pb-20">
      {/* Top Banner */}
      <div className="bg-slate-950 border-b border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">Super Admin Control Hub</h1>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                    Root Privileges
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Global multi-tenant governance, revenue metrics, subscriptions & security
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>PostgreSQL RLS Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Global KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-semibold">Total Platform GMV</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold text-white">${totalGMV.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Customer order volume</span>
            </p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-semibold">SaaS Monthly MRR</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-extrabold text-white">${platformMRR}/mo</p>
            <p className="text-[11px] text-purple-300 mt-1">From active merchant subscriptions</p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-semibold">Total Online Stores</span>
              <StoreIcon className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-extrabold text-white">{totalStores}</p>
            <p className="text-[11px] text-cyan-400 mt-1">{activeStores} active / 0 suspended</p>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs uppercase font-semibold">Catalog Items</span>
              <Package className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-extrabold text-white">{totalProducts} Products</p>
            <p className="text-[11px] text-slate-400 mt-1">{totalOrders} total orders processed</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('stores')}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === 'stores' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
          >
            <StoreIcon className="w-3.5 h-3.5" />
            <span>Stores Directory ({stores.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === 'subscriptions' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>SaaS Plans & Subscribers</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === 'users' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Platform Users & Roles</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
              activeTab === 'settings' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white bg-slate-800/50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>System Configuration</span>
          </button>
        </div>

        {/* TAB 1: STORES */}
        {activeTab === 'stores' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Filter stores by name or slug..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-700">
                  <tr>
                    <th className="px-5 py-3">Store Name & Slug</th>
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3">Theme Color</th>
                    <th className="px-5 py-3">Payments</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Super Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredStores.map(st => (
                    <tr key={st.id} className="hover:bg-slate-750 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.logo_url}
                            alt={st.name}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-600"
                          />
                          <div>
                            <p className="font-bold text-white">{st.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">/store/{st.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3 text-slate-400">
                        <p className="text-white font-medium">{st.contact_email}</p>
                        <p className="text-[10px]">{st.contact_phone}</p>
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: st.primary_color }}
                          />
                          <span className="font-mono text-[11px] uppercase">{st.primary_color}</span>
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          {st.payment_settings.upi_enabled && (
                            <span className="bg-purple-900/60 text-purple-300 px-1.5 py-0.5 rounded font-mono">UPI</span>
                          )}
                          {st.payment_settings.cod_enabled && (
                            <span className="bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded">COD</span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          st.status === 'active' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                        }`}>
                          {st.status}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onNavigate('storefront', st.slug)}
                            className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                            title="Visit Public Storefront"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleStoreStatus(st.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              st.status === 'active'
                                ? 'bg-amber-900/60 hover:bg-amber-800 text-amber-300'
                                : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300'
                            }`}
                            title={st.status === 'active' ? 'Suspend Store' : 'Reactivate Store'}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SUBSCRIPTIONS */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map(p => {
                const subsCount = subscriptions.filter(s => s.plan_id === p.id).length;
                return (
                  <div key={p.id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-base">{p.name}</h4>
                      <span className="text-xs bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                        {subsCount} Active
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold text-white">
                      ${p.price_monthly} <span className="text-xs text-slate-400">/mo</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Limits: {p.product_limit} products · {p.store_limit} store(s)
                    </p>
                    <ul className="text-xs text-slate-400 space-y-1">
                      {p.features.slice(0, 3).map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: USERS */}
        {activeTab === 'users' && (
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-700">
                <tr>
                  <th className="px-5 py-3">User Profile</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {INITIAL_USERS.map(u => (
                  <tr key={u.id} className="hover:bg-slate-750">
                    <td className="px-5 py-3 flex items-center gap-2.5">
                      <img
                        src={u.avatar_url}
                        alt={u.full_name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-600"
                      />
                      <span className="font-bold text-white">{u.full_name}</span>
                    </td>
                    <td className="px-5 py-3 font-mono">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'super_admin' ? 'bg-purple-900 text-purple-300' :
                        u.role === 'store_owner' ? 'bg-emerald-900 text-emerald-300' :
                        'bg-blue-900 text-blue-300'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-6 max-w-2xl">
            <h3 className="font-bold text-white text-base">Platform Multi-Tenant Governance</h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Platform Name</label>
                <input
                  type="text"
                  defaultValue="StoreNova Multi-Tenant SaaS"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Default Trial Period (Days)</label>
                <input
                  type="number"
                  defaultValue={14}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-700">
                <div>
                  <p className="font-bold text-white">Merchant UPI Transaction Fee</p>
                  <p className="text-slate-400 text-[11px]">Direct peer-to-peer merchant settlement</p>
                </div>
                <span className="font-extrabold text-emerald-400 text-sm">0% Free</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
