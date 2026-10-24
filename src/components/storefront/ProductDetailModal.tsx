import React, { useState } from 'react';
import { Product, Store } from '../../types';
import { useCart } from '../../context/CartContext';
import { X, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  store: Store;
  onClose: () => void;
  onBuyNow: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  store,
  onClose,
  onBuyNow
}) => {
  if (!product) return null;

  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(
    product.colors[0] || { name: 'Default', hex: '#000000' }
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [addedAnim, setAddedAnim] = useState(false);

  const price = product.discount_price ?? product.price;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize, selectedColor);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const handleDirectBuy = () => {
    addItem(product, quantity, selectedSize, selectedColor);
    onClose();
    onBuyNow();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Images */}
        <div className="md:w-1/2 bg-slate-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-emerald-600 scale-105' : 'border-slate-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="mt-4 pt-4 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fast Tracked Dispatch</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>UPI & COD Protected</span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Variant Pickers */}
        <div className="md:w-1/2 p-6 overflow-y-auto space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="uppercase tracking-wider font-bold">{product.category}</span>
                <span className="font-mono text-[10px]">SKU: {product.sku}</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-snug">{product.name}</h2>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 pb-3 border-b border-slate-100">
              <span className="text-2xl font-black text-slate-900">
                {store.currency_symbol}{price}
              </span>
              {product.discount_price && (
                <span className="text-sm text-slate-400 line-through">
                  {store.currency_symbol}{product.price}
                </span>
              )}
              <span className="ml-auto text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                In Stock ({product.stock} available)
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Size: <span className="font-normal text-slate-500">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        borderColor: selectedSize === size ? store.primary_color : undefined,
                        backgroundColor: selectedSize === size ? `${store.primary_color}15` : undefined,
                        color: selectedSize === size ? store.primary_color : undefined
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        selectedSize === size
                          ? 'border-2'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Color: <span className="font-normal text-slate-500">{selectedColor.name}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedColor.name === color.name
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xl bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:text-slate-900"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:text-slate-900"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-slate-500">
                  Subtotal: <strong className="text-slate-900 font-bold">{store.currency_symbol}{(price * quantity).toFixed(2)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={handleAddToCart}
              style={{ backgroundColor: store.primary_color }}
              className="w-full py-3 px-4 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:opacity-95 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addedAnim ? '✓ Added To Cart!' : 'Add To Cart'}</span>
            </button>

            <button
              onClick={handleDirectBuy}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
            >
              Buy Now with 1-Click Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
