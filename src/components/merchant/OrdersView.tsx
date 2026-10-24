import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { 
  Package, 
  Search, 
  Filter, 
  Printer, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  X,
  CreditCard,
  QrCode,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { activeStore, getStoreOrders, updateOrderStatus, updatePaymentStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!activeStore) return null;

  const orders = getStoreOrders(activeStore.id);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
    { value: 'pending', label: 'Pending', color: 'bg-slate-100 text-slate-800' },
    { value: 'processing', label: 'Processing', color: 'bg-amber-100 text-amber-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-cyan-100 text-cyan-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-rose-100 text-rose-800' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Order Management & Fulfillment</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage incoming orders, update shipping progress, and generate customer receipts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl">
            {orders.length} Storefront Orders Recorded
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search order ID, customer name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto py-1 text-xs">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Package className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No orders found</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or place an order from the storefront.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Customer & Address</th>
                  <th className="px-5 py-3">Items Ordered</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Fulfillment Status</th>
                  <th className="px-5 py-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3 font-mono font-bold text-slate-900">
                      {order.id}
                    </td>

                    <td className="px-5 py-3 text-slate-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-3">
                      <p className="font-semibold text-slate-900">{order.customer_name}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{order.customer_email}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {order.shipping_address.city}, {order.shipping_address.state}
                      </p>
                    </td>

                    <td className="px-5 py-3">
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                            <span className="font-semibold text-slate-800">{item.quantity}x</span>
                            <span className="text-slate-600 truncate max-w-[120px]">{item.product_name}</span>
                            {item.size && <span className="text-[10px] bg-slate-100 px-1 rounded">{item.size}</span>}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-5 py-3 font-extrabold text-slate-900">
                      {activeStore.currency_symbol}{order.total}
                    </td>

                    <td className="px-5 py-3">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          order.payment_method === 'upi' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.payment_method}
                        </span>
                        <div>
                          <select
                            value={order.payment_status}
                            onChange={e => updatePaymentStatus(order.id, e.target.value as PaymentStatus)}
                            className="text-[10px] font-semibold border border-slate-200 rounded px-1.5 py-0.5 bg-white cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border border-slate-200 outline-none cursor-pointer ${
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          order.status === 'shipped' ? 'bg-cyan-50 text-cyan-800 border-cyan-300' :
                          order.status === 'processing' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                          order.status === 'cancelled' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                          'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice & Receipt Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:p-0">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Packing Slip & Invoice</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                >
                  Print Invoice
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Body */}
            <div className="space-y-6">
              {/* Brand & Store Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{activeStore.name}</h2>
                  <p className="text-xs text-slate-500 font-mono">/store/{activeStore.slug}</p>
                  <p className="text-xs text-slate-500 mt-1">{activeStore.address}</p>
                  <p className="text-xs text-slate-500">{activeStore.contact_email}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Order Invoice</span>
                  <p className="text-lg font-mono font-bold text-slate-900">{selectedOrder.id}</p>
                  <p className="text-xs text-slate-500">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Billed & Shipped To:</h4>
                  <p className="font-semibold text-slate-900">{selectedOrder.customer_name}</p>
                  <p className="text-slate-600">{selectedOrder.shipping_address.street}</p>
                  <p className="text-slate-600">
                    {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postalCode}
                  </p>
                  <p className="text-slate-600">{selectedOrder.shipping_address.country}</p>
                  <p className="text-slate-600 mt-1">📞 {selectedOrder.customer_phone || selectedOrder.shipping_address.phone}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Payment & Status:</h4>
                  <p className="text-slate-700">
                    Method: <strong className="uppercase">{selectedOrder.payment_method}</strong>
                  </p>
                  <p className="text-slate-700">
                    Payment Status: <strong className="capitalize">{selectedOrder.payment_status}</strong>
                  </p>
                  {selectedOrder.transaction_id && (
                    <p className="text-slate-700 font-mono text-[11px] truncate">
                      Ref: {selectedOrder.transaction_id}
                    </p>
                  )}
                  <p className="text-slate-700 mt-1">
                    Fulfillment: <strong className="capitalize text-emerald-700">{selectedOrder.status}</strong>
                  </p>
                </div>
              </div>

              {/* Line Items */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Item</th>
                      <th className="px-4 py-2.5">Options</th>
                      <th className="px-4 py-2.5 text-center">Qty</th>
                      <th className="px-4 py-2.5 text-right">Price</th>
                      <th className="px-4 py-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2.5 font-medium text-slate-900">
                          {item.product_name}
                        </td>
                        <td className="px-4 py-2.5 text-slate-500">
                          {item.size && <span className="mr-2">Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </td>
                        <td className="px-4 py-2.5 text-center text-slate-700 font-bold">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right text-slate-600">{activeStore.currency_symbol}{item.price}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-slate-900">
                          {activeStore.currency_symbol}{item.price * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-right font-bold text-slate-600">Total:</td>
                      <td className="px-4 py-2 text-right font-extrabold text-base text-slate-900">
                        {activeStore.currency_symbol}{selectedOrder.total}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {selectedOrder.notes && (
                <div className="p-3 bg-amber-50 rounded-lg text-amber-900 text-xs">
                  <strong>Customer Delivery Note:</strong> {selectedOrder.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
