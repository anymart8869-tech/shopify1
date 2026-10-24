import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Lock, Mail, ArrowRight, Shield, Store, User, Sparkles, Check } from 'lucide-react';
import { UserRole } from '../../types';

interface LoginFormProps {
  onNavigate: (view: string, slug?: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('sarah@aurorastores.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('store_owner');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, selectedRole);
    setLoading(false);

    if (selectedRole === 'super_admin' || email.includes('admin')) {
      onNavigate('admin');
    } else if (selectedRole === 'store_owner') {
      onNavigate('merchant-dashboard');
    } else {
      onNavigate('landing');
    }
  };

  const handleQuickDemo = (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setSelectedRole(demoRole);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-600 text-white items-center justify-center shadow-lg shadow-emerald-500/20 mb-1">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
          <p className="text-xs text-slate-500">Sign in to manage your online store or platform</p>
        </div>

        {/* Quick Demo Credentials Switcher */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Quick Demo Autofill:
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@storenova.io', 'super_admin')}
              className={`p-2 rounded-lg text-left border transition-all text-xs ${
                email === 'admin@storenova.io'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-purple-600" />
                <span className="truncate">Admin</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('sarah@aurorastores.com', 'store_owner')}
              className={`p-2 rounded-lg text-left border transition-all text-xs ${
                email === 'sarah@aurorastores.com'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1">
                <Store className="w-3 h-3 text-emerald-600" />
                <span className="truncate">Merchant</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('david.miller@example.com', 'customer')}
              className={`p-2 rounded-lg text-left border transition-all text-xs ${
                email === 'david.miller@example.com'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-blue-600" />
                <span className="truncate">Customer</span>
              </div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="you@domain.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Role Permission</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value as UserRole)}
              className="w-full py-2 px-3 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="store_owner">Store Owner (Merchant)</option>
              <option value="super_admin">Super Admin (Platform Owner)</option>
              <option value="customer">Customer (Shopper)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Don't have an online store yet?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-emerald-600 hover:text-emerald-700 font-bold ml-1"
          >
            Create your store free
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your email and we'll send a password recovery reset link.
            </p>

            {resetSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Password reset link sent to {email}! Check inbox.</span>
              </div>
            ) : (
              <input
                type="email"
                defaultValue={email}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter registered email"
              />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForgot(false);
                  setResetSuccess(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              {!resetSuccess && (
                <button
                  type="button"
                  onClick={() => setResetSuccess(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
