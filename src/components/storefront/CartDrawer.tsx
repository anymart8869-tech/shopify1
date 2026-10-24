import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Store } from '../../types';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  store: Store;
  onProceedToCheckout: (appliedDiscount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ store, onProceedToCheckout }) => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'AURORAFREE' || code === 'NOVA10' || code === 'SAVE10') {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try "NOVA10" for 10% off.');
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-800" />
              <h2 className="text-base font-bold text-slate-900">Your Cart ({totalItems})</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Discover curated items in {store.name}'s storefront and add them to your bag.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{ backgroundColor: store.primary_color }}
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold mt-2 shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map(item => {
                const itemPrice = item.product.discount_price ?? item.product.price;
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                          {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong></span>}
                          {item.selectedColor && (
                            <span className="flex items-center gap-1">
                              Color: <strong>{item.selectedColor.name}</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-black text-slate-900">
                          {store.currency_symbol}{(itemPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Order Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    placeholder="Coupon code (e.g. NOVA10)"
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none uppercase font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[10px] text-emerald-600 font-bold">✓ Coupon NOVA10 applied: 10% discount!</p>
                )}
                {promoError && (
                  <p className="text-[10px] text-rose-500 font-medium">{promoError}</p>
                )}
              </form>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{store.currency_symbol}{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-{store.currency_symbol}{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span>{store.currency_symbol}{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onProceedToCheckout(discountAmount);
                }}
                style={{ backgroundColor: store.primary_color }}
                className="w-full py-3.5 px-4 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:opacity-95 flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant Merchant UPI QR & Cash on Delivery Accepted</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
