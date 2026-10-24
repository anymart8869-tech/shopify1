import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { X, Plus, Trash2, Image, Sparkles, Check } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => void;
  product?: Product | null;
  storeId: string;
}

const PRESET_IMAGES = [
  { label: 'Oversized Hoodie', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80' },
  { label: 'Leather Tote Bag', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80' },
  { label: 'Linen Shirt', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80' },
  { label: 'Aero Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80' },
  { label: 'Wireless ANC Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80' },
  { label: 'Minimalist Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80' }
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  storeId
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Apparel');
  const [price, setPrice] = useState('49.00');
  const [discountPrice, setDiscountPrice] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('25');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L']);
  const [newSizeInput, setNewSizeInput] = useState('');
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Black', hex: '#111827' },
    { name: 'Sand', hex: '#d9cdb8' }
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#008060');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSlug(product.slug);
      setDescription(product.description);
      setCategory(product.category);
      setPrice(product.price.toString());
      setDiscountPrice(product.discount_price ? product.discount_price.toString() : '');
      setSku(product.sku);
      setStock(product.stock.toString());
      setIsActive(product.is_active);
      setIsFeatured(product.is_featured);
      setSizes(product.sizes || []);
      setColors(product.colors || []);
      setImageUrl(product.images[0] || PRESET_IMAGES[0].url);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setCategory('Apparel');
      setPrice('49.00');
      setDiscountPrice('');
      setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      setStock('25');
      setIsActive(true);
      setIsFeatured(false);
      setSizes(['S', 'M', 'L', 'XL']);
      setColors([
        { name: 'Onyx Black', hex: '#111827' },
        { name: 'Alabaster', hex: '#f3f4f6' }
      ]);
      setImageUrl(PRESET_IMAGES[0].url);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!product) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  };

  const handleAddSize = () => {
    if (newSizeInput.trim() && !sizes.includes(newSizeInput.trim())) {
      setSizes([...sizes, newSizeInput.trim().toUpperCase()]);
      setNewSizeInput('');
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(sizes.filter(s => s !== sizeToRemove));
  };

  const handleAddColor = () => {
    if (newColorName.trim()) {
      setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
      setNewColorName('');
    }
  };

  const handleRemoveColor = (idx: number) => {
    setColors(colors.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      store_id: storeId,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      category,
      price: parseFloat(price) || 0,
      discount_price: discountPrice ? parseFloat(discountPrice) : undefined,
      sku: sku || `SKU-${Date.now()}`,
      stock: parseInt(stock, 10) || 0,
      is_active: isActive,
      is_featured: isFeatured,
      sizes,
      colors,
      images: [imageUrl]
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p className="text-xs text-slate-500">Configure catalog details, pricing, variants, and stock</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. Heavyweight Organic Cotton Crewneck"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">URL Slug</label>
              <input
                type="text"
                required
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="organic-cotton-crewneck"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Apparel">Apparel</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Footwear">Footwear</option>
                <option value="Bags & Accessories">Bags & Accessories</option>
                <option value="Wearables">Wearables & Tech</option>
                <option value="Home & Living">Home & Living</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Highlight craftsmanship, materials, sizing fit, and unique features..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="49.00"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sale Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={discountPrice}
                onChange={e => setDiscountPrice(e.target.value)}
                placeholder="Optional discount"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SKU</label>
              <input
                type="text"
                value={sku}
                onChange={e => setSku(e.target.value)}
                placeholder="AUR-001"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Count</label>
              <input
                type="number"
                required
                min={0}
                value={stock}
                onChange={e => setStock(e.target.value)}
                placeholder="25"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Sizes Variants */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block text-xs font-semibold text-slate-700 mb-2">Available Sizes</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {sizes.map(s => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(s)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSizeInput}
                onChange={e => setNewSizeInput(e.target.value)}
                placeholder="Add size (e.g. S, M, L, XL, 32, US 10)"
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSize(); } }}
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Add Size
              </button>
            </div>
          </div>

          {/* Color Variants */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block text-xs font-semibold text-slate-700 mb-2">Color Swatches</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {colors.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(i)}
                    className="text-slate-400 hover:text-red-500 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newColorHex}
                onChange={e => setNewColorHex(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5"
              />
              <input
                type="text"
                value={newColorName}
                onChange={e => setNewColorName(e.target.value)}
                placeholder="Color Name (e.g. Olive Green)"
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddColor(); } }}
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Add Color
              </button>
            </div>
          </div>

          {/* Image URL & Sample Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Product Image URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="https://images.unsplash.com/..."
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-10 h-10 rounded-lg object-cover border border-slate-300"
                />
              )}
            </div>

            <div className="pt-1">
              <p className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Or Pick a High-Res Photography Preset:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_IMAGES.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(p.url)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                      imageUrl === p.url
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{p.label}</span>
                    {imageUrl === p.url && <Check className="w-3 h-3 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span>Publish in Storefront (Active)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span>Feature on Storefront Homepage</span>
            </label>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20"
            >
              {product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
