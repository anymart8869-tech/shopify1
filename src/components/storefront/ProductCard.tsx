import React from 'react';
import { Product, Store } from '../../types';
import { ShoppingBag, Eye, Heart, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  store: Store;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, store, onQuickView }) => {
  const { addItem } = useCart();

  const isSale = Boolean(product.discount_price && product.discount_price < product.price);
  const discountPercent = isSale
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(
      product,
      1,
      product.sizes[0] || undefined,
      product.colors[0] || undefined
    );
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isSale && (
              <span
                style={{ backgroundColor: store.primary_color }}
                className="text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md"
              >
                -{discountPercent}% OFF
              </span>
            )}
            {product.is_featured && (
              <span className="bg-slate-900 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-md">
                Featured
              </span>
            )}
          </div>

          {/* Stock badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
              <span className="text-white text-xs font-bold uppercase px-3 py-1 bg-black/80 rounded-full">
                Sold Out
              </span>
            </div>
          )}

          {/* Hover Quick View overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={e => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="p-2.5 rounded-full bg-white text-slate-900 hover:scale-110 transition-transform shadow-lg"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="uppercase tracking-wider font-semibold">{product.category}</span>
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center -space-x-1">
                {product.colors.slice(0, 3).map((c, i) => (
                  <span
                    key={i}
                    className="w-3 h-3 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>

          <h3 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Card Footer Price & Add Button */}
      <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
        <div className="pt-2">
          {isSale ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900">
                {store.currency_symbol}{product.discount_price}
              </span>
              <span className="text-xs text-slate-400 line-through">
                {store.currency_symbol}{product.price}
              </span>
            </div>
          ) : (
            <span className="text-base font-extrabold text-slate-900">
              {store.currency_symbol}{product.price}
            </span>
          )}
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={product.stock === 0}
          style={{ backgroundColor: product.stock > 0 ? store.primary_color : undefined }}
          className={`p-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-sm ${
            product.stock > 0
              ? 'hover:opacity-90 hover:scale-105'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
          title="Add to cart"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
