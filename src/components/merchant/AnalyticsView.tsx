import React from 'react';
import { useStore } from '../../context/StoreContext';
import { DollarSign, ShoppingCart, TrendingUp, Package, Users, ArrowUpRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { activeStore, getStoreOrders, getStoreProducts } = useStore();

  if (!activeStore) return null;

  const orders = getStoreOrders(activeStore.id);
  const products = getStoreProducts(activeStore.id);

  const totalRevenue = orders.reduce((sum, o) => o.payment_status === 'paid' ? sum + o.total : sum, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? (orders.reduce((sum, o) => sum + o.total, 0) / totalOrders).toFixed(2) : '0';
  const totalInStock = products.reduce((sum, p) => sum + p.stock, 0);

  // 7-day revenue trend simulation
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dailyData = [
    { day: 'Mon', revenue: 140, orders: 2 },
    { day: 'Tue', revenue: 260, orders: 3 },
    { day: 'Wed', revenue: 190, orders: 2 },
    { day: 'Thu', revenue: 380, orders: 4 },
    { day: 'Fri', revenue: 520, orders: 6 },
    { day: 'Sat', revenue: 640, orders: 7 },
    { day: 'Sun', revenue: totalRevenue > 0 ? Math.round(totalRevenue * 0.35) : 410, orders: 5 }
  ];
  const maxRevenue = Math.max(...dailyData.map(d => d.revenue), 700);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Paid Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {activeStore.currency_symbol}{totalRevenue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.8% vs last week</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalOrders}</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8 new this week</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Order Value (AOV)</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {activeStore.currency_symbol}{avgOrderValue}
          </p>
          <div className="text-[11px] text-slate-500 mt-1">
            Across all processed orders
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Stock Health</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalInStock} units</p>
          <div className="text-[11px] text-slate-500 mt-1">
            {products.length} live active products
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">7-Day Sales Volume</h3>
              <p className="text-xs text-slate-500">Gross revenue generated through StoreNova storefront</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Revenue ({activeStore.currency_symbol})</span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {dailyData.map((d, i) => {
              const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {activeStore.currency_symbol}{d.revenue}
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[42px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg group-hover:from-emerald-500 group-hover:to-teal-300 transition-all shadow-sm"
                  />
                  <span className="text-[11px] font-medium text-slate-600 mt-1">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
            Top Performing Catalog
          </h3>

          <div className="space-y-3">
            {products.slice(0, 4).map(prod => (
              <div key={prod.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-11 h-11 rounded-lg object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{prod.name}</p>
                  <p className="text-[11px] text-slate-500">
                    Stock: <span className={prod.stock > 10 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{prod.stock} left</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">
                    {activeStore.currency_symbol}{prod.discount_price || prod.price}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-medium">In Catalog</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Recent Storefront Orders</h3>
            <p className="text-xs text-slate-500">Latest transactions placed on this store</p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
            {orders.length} Total Orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No orders placed yet. Visit your storefront to place a test order!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3 font-mono font-bold text-slate-900">{order.id}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-900">{order.customer_name}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{order.customer_email}</p>
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-700">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="px-5 py-3 font-bold text-slate-900">
                      {activeStore.currency_symbol}{order.total}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        order.payment_method === 'upi' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.payment_method} · {order.payment_status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'shipped' ? 'bg-cyan-100 text-cyan-800' :
                        order.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
