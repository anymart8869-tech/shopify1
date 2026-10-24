import React from 'react';
import { 
  Palette, 
  ShoppingBag, 
  Globe2, 
  QrCode, 
  Truck, 
  BarChart3, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  CreditCard,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface FeaturesProps {
  onNavigate: (view: string, slug?: string) => void;
}

export const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: Palette,
      title: 'Visual Storefront Builder',
      description: 'Customize primary brand colors, banner hero imagery, custom taglines, logo, and announcement bar. See changes live with zero CSS coding.',
      badge: 'Zero Code',
      color: 'emerald'
    },
    {
      icon: ShoppingBag,
      title: 'Variant & Catalog Management',
      description: 'Manage unlimited products, SKU tracking, stock counts, size matrices (XS-XXL), hex color swatches, sale discount badges, and image galleries.',
      badge: 'Rich Products',
      color: 'indigo'
    },
    {
      icon: Globe2,
      title: 'Dedicated Public Storefront URLs',
      description: 'Every merchant gets an isolated, high-speed public store URL (e.g. /store/your-brand) with optimized SEO, category filter pills, and instant search.',
      badge: 'Instant Slug',
      color: 'teal'
    },
    {
      icon: QrCode,
      title: 'Merchant UPI & Cash on Delivery',
      description: 'Support direct merchant payments without middleman fees. Customers scan a dynamically generated UPI QR code or choose COD at checkout.',
      badge: 'Zero Platform Fee',
      color: 'cyan'
    },
    {
      icon: Truck,
      title: 'Full Order Fulfillment Lifecycle',
      description: 'Track orders across Pending, Processing, Shipped, Delivered, and Cancelled stages. View customer delivery addresses and print packing receipts.',
      badge: 'Fulfillment',
      color: 'blue'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Merchant Analytics',
      description: 'Monitor daily gross sales, order volume, average order value (AOV), top revenue-generating items, and customer acquisition metrics.',
      badge: 'Live Insights',
      color: 'violet'
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Built For Independent Merchants</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need To Sell Online Like A Pro
          </h2>
          <p className="text-slate-600 text-base">
            StoreNova combines the flexibility of Shopify with the autonomy of an open multi-tenant architecture. Built with React, Tailwind, and Supabase RLS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-800 group-hover:text-emerald-700 flex items-center justify-center transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                  <span>Explore Feature</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Multi-Tenant Security Highlight Banner */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Multi-Tenant Row Level Security (RLS)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Ironclad Tenant Isolation at Database Level
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Every merchant's catalogs, order records, and private customer databases are protected by PostgreSQL RLS policies. Users can never view or manipulate another merchant's sensitive business operations.
            </p>
          </div>

          <button
            onClick={() => onNavigate('admin')}
            className="whitespace-nowrap px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <span>View Super Admin Architecture</span>
          </button>
        </div>
      </div>
    </section>
  );
};
