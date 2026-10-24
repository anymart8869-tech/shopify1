import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Lock, Mail, User, Store, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types';

interface RegisterFormProps {
  onNavigate: (view: string, slug?: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onNavigate }) => {
  const { signup } = useAuth();
  const { createStore } = useStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('store_owner');
  const [storeName, setStoreName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#008060');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await signup(email, fullName, role);

    if (role === 'store_owner') {
      const created = createStore({
        name: storeName || `${fullName.split(' ')[0]}'s Boutique`,
        contact_email: email,
        primary_color: primaryColor
      });

      setLoading(false);
      onNavigate('merchant-dashboard', 'builder');
    } else {
      setLoading(false);
      onNavigate('landing');
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-600 text-white items-center justify-center shadow-lg shadow-emerald-500/20 mb-1">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create your StoreNova account</h2>
          <p className="text-xs text-slate-500">Launch your branded online storefront in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. Elena Rostova"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="elena@mybrand.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('store_owner')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  role === 'store_owner'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Store Owner</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Build & sell products</p>
              </button>

              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  role === 'customer'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Customer</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Shop storefronts</p>
              </button>
            </div>
          </div>

          {/* Additional fields for Store Owner */}
          {role === 'store_owner' && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Initial Store Details
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Store Name</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  placeholder="e.g. Velvet & Oak Atelier"
                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                {storeName && (
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    URL: /store/{storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={e => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                  />
                  <span className="text-xs font-mono text-slate-600 uppercase">{primaryColor}</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            <span>{loading ? 'Creating Account & Store...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-emerald-600 hover:text-emerald-700 font-bold ml-1"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
