import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Store, Order, PaymentMethod } from '../../types';
import { X, ShieldCheck, QrCode, Truck, Check, Lock, ArrowRight, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  store: Store;
  discount: number;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  store,
  discount,
  onClose,
  onOrderSuccess
}) => {
  const { items, subtotal, clearCart } = useCart();
  const { createOrder } = useStore();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || 'David Miller');
  const [email, setEmail] = useState(user?.email || 'david.miller@example.com');
  const [phone, setPhone] = useState('+1 (555) 741-8529');
  const [street, setStreet] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('Springfield');
  const [state, setState] = useState('OR');
  const [postalCode, setPostalCode] = useState('97477');
  const [country, setCountry] = useState('United States');
  const [notes, setNotes] = useState('');

  // Payment selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    store.payment_settings.upi_enabled ? 'upi' : 'cod'
  );
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalAmount = Math.max(0, subtotal - discount);

  // Merchant dynamic UPI string
  const upiId = store.payment_settings.upi_id || 'merchant@upi';
  const upiName = store.payment_settings.upi_name || store.name;
  const upiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${encodeURIComponent(upiId)}%26pn=${encodeURIComponent(upiName)}%26am=${totalAmount}%26cu=INR`;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderPayload = {
        store_id: store.id,
        customer_id: user?.id,
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        shipping_address: {
          fullName,
          email,
          phone,
          street,
          city,
          state,
          postalCode,
          country
        },
        items: items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          product_image: item.product.images[0],
          price: item.product.discount_price ?? item.product.price,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor?.name
        })),
        subtotal,
        discount,
        total: totalAmount,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'upi' ? ('paid' as const) : ('pending' as const),
        status: 'processing' as const,
        transaction_id: transactionId || (paymentMethod === 'upi' ? `UPI-REF-${Math.floor(10000000 + Math.random() * 90000000)}` : ''),
        notes
      };

      const newOrder = createOrder(orderPayload);
      clearCart();
      setIsSubmitting(false);

      // Trigger Celebration Confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      onOrderSuccess(newOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Secure Checkout · {store.name}</h3>
              <p className="text-[11px] text-slate-500">Order directly from verified merchant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          {/* 1. Customer Information */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
              1. Customer & Shipping Contact
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
              2. Delivery Address
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-4">
                <label className="block text-slate-600 font-semibold mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  placeholder="Street name, house number, apartment/suite"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-semibold mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">State / Province</label>
                <input
                  type="text"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Postal Code *</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method Selection */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
              3. Payment Method
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: UPI */}
              {store.payment_settings.upi_enabled && (
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-purple-500 bg-purple-50/50 ring-1 ring-purple-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-purple-600" />
                      <span className="font-bold text-slate-900">Merchant UPI Instant</span>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                      Zero Fees
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Scan merchant QR code with GPay, PhonePe, Paytm, or BHIM.
                  </p>
                </div>
              )}

              {/* Option B: COD */}
              {store.payment_settings.cod_enabled && (
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-slate-900">Cash on Delivery (COD)</span>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                      Pay on Arrival
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Pay delivery courier in cash upon receiving package.
                  </p>
                </div>
              )}
            </div>

            {/* Merchant UPI QR code display when UPI is active */}
            {paymentMethod === 'upi' && (
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in">
                <img
                  src={upiQrUrl}
                  alt="Merchant UPI QR Code"
                  className="w-28 h-28 rounded-xl bg-white p-1.5 border border-purple-200 shadow-sm shrink-0"
                />
                <div className="space-y-1.5 text-center sm:text-left">
                  <p className="font-bold text-slate-900 text-xs">
                    Scan to Pay {store.currency_symbol}{totalAmount.toFixed(2)} directly to Merchant
                  </p>
                  <p className="text-[11px] text-slate-600 font-mono">
                    Merchant UPI ID: <strong className="text-purple-700">{upiId}</strong>
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Payee: <strong>{upiName}</strong>
                  </p>
                  <div className="pt-1">
                    <input
                      type="text"
                      value={transactionId}
                      onChange={e => setTransactionId(e.target.value)}
                      placeholder="Enter UPI Ref / Transaction ID (Optional)"
                      className="px-3 py-1.5 text-xs border border-purple-300 rounded-lg bg-white w-full max-w-xs font-mono outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Order Summary Overview */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Items Total ({items.length})</span>
              <span className="font-semibold text-slate-900">{store.currency_symbol}{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Promotional Discount</span>
                <span>-{store.currency_symbol}{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Standard Express Shipping</span>
              <span className="text-emerald-700 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>Amount Payable</span>
              <span>{store.currency_symbol}{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: store.primary_color }}
              className="w-full py-3.5 px-4 text-white font-bold text-xs rounded-xl shadow-lg transition-all hover:opacity-95 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <span>{isSubmitting ? 'Finalizing Order...' : `Place Order · ${store.currency_symbol}${totalAmount.toFixed(2)}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
