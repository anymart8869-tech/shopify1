import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Check, Zap, Sparkles, CreditCard, Shield, Clock, ArrowRight, X } from 'lucide-react';
import { SubscriptionPlan } from '../../types';

export const SubscriptionView: React.FC = () => {
  const { currentPlan, currentSubscription, plans, upgradeSubscription, activeStore, getStoreProducts } = useStore();

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(currentPlan?.id || 'plan_growth');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!activeStore) return null;

  const products = getStoreProducts(activeStore.id);
  const productCount = products.length;
  const maxProducts = currentPlan ? currentPlan.product_limit : 10;
  const usagePercent = Math.min(100, Math.round((productCount / maxProducts) * 100));

  const renewalDate = currentSubscription
    ? new Date(currentSubscription.current_period_end).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'In 30 days';

  const handleConfirmUpgrade = () => {
    setIsProcessing(true);
    setTimeout(() => {
      upgradeSubscription(selectedPlanId, billingCycle);
      setIsProcessing(false);
      setUpgradeModalOpen(false);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Subscription & SaaS Billing</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your store plan limits, billing cycle, and feature access
          </p>
        </div>

        <button
          onClick={() => setUpgradeModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
        >
          <Zap className="w-4 h-4" />
          <span>Change / Upgrade Plan</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Subscription plan upgraded successfully! Your store limits have been expanded.</span>
        </div>
      )}

      {/* Current Plan Overview Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">Current Active Tier</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                Active
              </span>
            </div>
            <h3 className="text-3xl font-extrabold">{currentPlan?.name}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Billed {currentSubscription?.billing_cycle || 'monthly'} · Renews on <strong className="text-white">{renewalDate}</strong>
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-extrabold text-white">
              ${currentSubscription?.billing_cycle === 'yearly' ? currentPlan?.price_yearly : currentPlan?.price_monthly}
            </span>
            <span className="text-xs text-slate-400">/{currentSubscription?.billing_cycle === 'yearly' ? 'year' : 'month'}</span>
          </div>
        </div>

        {/* Limits & Gauges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Catalog Product Limit</span>
              <span className="text-emerald-400 font-bold">{productCount} / {maxProducts} Products Used</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  usagePercent >= 90 ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {maxProducts - productCount > 0
                ? `${maxProducts - productCount} product slots remaining`
                : 'Quota reached. Upgrade to Enterprise for unlimited products.'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Storefront Limit</span>
              <span className="text-cyan-400 font-bold">1 / {currentPlan?.store_limit || 1} Storefronts</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full"
                style={{ width: `${Math.min(100, (1 / (currentPlan?.store_limit || 1)) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Active Store: <strong className="text-white">{activeStore.name}</strong> (/store/{activeStore.slug})
            </p>
          </div>
        </div>
      </div>

      {/* Available Plans Comparison */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Compare Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => {
            const isCurrent = currentPlan?.id === plan.id;
            return (
              <div
                key={plan.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-400 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900 text-base">{plan.name}</h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 mb-3">
                    ${plan.price_monthly} <span className="text-xs font-normal text-slate-500">/mo</span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-100">
                    Max: {plan.product_limit} products · {plan.store_limit} store(s)
                  </p>

                  <ul className="space-y-2 text-xs text-slate-600 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    setUpgradeModalOpen(true);
                  }}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-slate-200 text-slate-500 cursor-default'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isCurrent ? 'Active Plan' : `Switch to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upgrade Modal */}
      {upgradeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Select Subscription Tier</h3>
              </div>
              <button
                onClick={() => setUpgradeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Billing Cycle Selector */}
            <div className="flex items-center justify-center">
              <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    billingCycle === 'monthly' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    billingCycle === 'yearly' ? 'bg-emerald-600 shadow text-white' : 'text-slate-600'
                  }`}
                >
                  <span>Yearly</span>
                  <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1 rounded font-black">SAVE 20%</span>
                </button>
              </div>
            </div>

            {/* Plan Options */}
            <div className="space-y-2">
              {plans.map(p => {
                const cost = billingCycle === 'monthly' ? p.price_monthly : Math.round(p.price_yearly / 12);
                const isSelected = selectedPlanId === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-500">Up to {p.product_limit} products · {p.store_limit} store(s)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-sm text-slate-900">${cost}/mo</p>
                      <span className="text-[10px] text-slate-400">{billingCycle}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setUpgradeModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUpgrade}
                disabled={isProcessing}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20"
              >
                {isProcessing ? 'Activating Plan...' : 'Confirm & Update Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
