import React from 'react';
import { Order, Store } from '../../types';
import { CheckCircle, Package, ArrowRight, Printer, Store as StoreIcon } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  store: Store;
  onClose: () => void;
  onViewInMerchant?: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  store,
  onClose,
  onViewInMerchant
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center">
        {/* Animated Check Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Order Confirmed & Placed!
          </span>
          <h2 className="text-2xl font-black text-slate-900">Thank you for your order!</h2>
          <p className="text-xs text-slate-500">
            A confirmation receipt has been generated. The merchant has received your order request.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Order ID:</span>
            <span className="font-mono font-bold text-slate-900">{order.id}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Payment:</span>
            <span className="font-bold uppercase text-slate-900">
              {order.payment_method} · {order.payment_status}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Shipping To:</span>
            <span className="font-medium text-slate-900 truncate max-w-[200px]">
              {order.shipping_address.street}, {order.shipping_address.city}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1 font-extrabold text-sm text-slate-900">
            <span>Total Amount:</span>
            <span>{store.currency_symbol}{order.total}</span>
          </div>
        </div>

        {/* Items List */}
        <div className="text-left space-y-1.5 max-h-36 overflow-y-auto">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Order Items</p>
          {order.items.map((it, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
              <span className="text-slate-800 font-medium">
                {it.quantity}x {it.product_name}
              </span>
              <span className="font-bold text-slate-900">
                {store.currency_symbol}{it.price * it.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onClose}
            style={{ backgroundColor: store.primary_color }}
            className="w-full py-3 rounded-xl text-white font-bold text-xs shadow-md transition-all hover:opacity-90 flex items-center justify-center gap-1.5"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onViewInMerchant && (
            <button
              onClick={() => {
                onClose();
                onViewInMerchant();
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <StoreIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Inspect Order in Merchant Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
