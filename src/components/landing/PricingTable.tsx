import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Check, Zap, Sparkles, ArrowRight, Shield } from 'lucide-react';

interface PricingTableProps {
  onNavigate: (view: string, slug?: string) => void;
  onSelectPlan?: (planId: string, billingCycle: 'monthly' | 'yearly') => void;
}

export const PricingTable: React.FC<PricingTableProps> = ({ onNavigate, onSelectPlan }) => {
  const { plans, currentSubscription, upgradeSubscription } = useStore();
  const { isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [upgradedPlanId, setUpgradedPlanId] = useState<string | null>(null);

  const handleChoosePlan = (planId: string) => {
    if (onSelectPlan) {
      onSelectPlan(planId, billingCycle);
      return;
    }

    if (!isAuthenticated) {
      onNavigate('register');
      return;
    }

    upgradeSubscription(planId, billingCycle);
    setUpgradedPlanId(planId);
    setTimeout(() => {
      onNavigate('merchant-dashboard', 'subscription');
    }, 600);
  };

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Transparent SaaS Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simple, Predictable Pricing For Every Stage
          </h2>
          <p className="text-slate-600 text-base">
            Start free, scale as your sales skyrocket. No hidden transaction fees on your customer orders.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center pt-4">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Yearly Billing</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-extrabold">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map(plan => {
            const isPopular = plan.is_popular;
            const price = billingCycle === 'monthly' ? plan.price_monthly : Math.round(plan.price_yearly / 12);
            const isCurrent = currentSubscription?.plan_id === plan.id;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-7 flex flex-col justify-between transition-all relative ${
                  isPopular
                    ? 'bg-slate-900 text-white ring-2 ring-emerald-500 shadow-2xl scale-105 z-10'
                    : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-lg'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    {isCurrent && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isPopular ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-100 text-emerald-800'}`}>
                        Current Plan
                      </span>
                    )}
                  </div>

                  <p className={`text-xs mb-6 ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                    {plan.slug === 'starter' && 'Ideal for emerging creators launching their first online storefront.'}
                    {plan.slug === 'growth' && 'Best for growing brands requiring custom branding, UPI QR, and analytics.'}
                    {plan.slug === 'scale' && 'For high-volume merchants managing multiple stores & custom domains.'}
                  </p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold tracking-tight">
                      ${price}
                    </span>
                    <span className={`text-xs ${isPopular ? 'text-slate-400' : 'text-slate-500'}`}>
                      / month {billingCycle === 'yearly' && '(billed annually)'}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl mb-6 text-xs font-medium ${isPopular ? 'bg-slate-800/80 text-emerald-300' : 'bg-slate-50 text-emerald-800'}`}>
                    <span>Limits: </span>
                    <strong className="font-bold">{plan.product_limit} Products</strong>
                    <span> · </span>
                    <strong className="font-bold">{plan.store_limit} Storefront(s)</strong>
                  </div>

                  <ul className="space-y-3 text-xs mb-8">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        <span className={isPopular ? 'text-slate-300' : 'text-slate-600'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleChoosePlan(plan.id)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-slate-700/50 text-slate-400 cursor-default'
                      : isPopular
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isCurrent ? (
                    <span>Active Subscription</span>
                  ) : upgradedPlanId === plan.id ? (
                    <span>Activating...</span>
                  ) : (
                    <>
                      <span>Choose {plan.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
