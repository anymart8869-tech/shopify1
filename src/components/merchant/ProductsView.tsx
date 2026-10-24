import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { ProductModal } from './ProductModal';
import { Plus, Search, Filter, Edit2, Trash2, Tag, Layers, CheckCircle, AlertCircle, ArrowUpRight, Zap } from 'lucide-react';

interface ProductsViewProps {
  onNavigateToSubscription: () => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ onNavigateToSubscription }) => {
  const { activeStore, getStoreProducts, addProduct, updateProduct, deleteProduct, canAddProduct, currentPlan } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [limitWarning, setLimitWarning] = useState<string | null>(null);

  if (!activeStore) return null;

  const products = getStoreProducts(activeStore.id);
  const check = canAddProduct(activeStore.id);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    if (!check.allowed) {
      setLimitWarning(check.reason || 'Product limit reached');
      return;
    }
    setLimitWarning(null);
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setLimitWarning(null);
    setEditingProduct(p);
    setModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from this store's catalog?`)) {
      deleteProduct(id);
    }
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      const res = addProduct(productData);
      if (!res.success) {
        alert(res.error);
        return;
      }
    }
    setModalOpen(false);
  };

  const handleToggleActive = (p: Product) => {
    updateProduct(p.id, { is_active: !p.is_active });
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Plan Limit Meter & Add Action */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Product Catalog Management</h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <span>Store: <strong>{activeStore.name}</strong></span>
            <span>•</span>
            <span>Plan: <strong className="text-emerald-700">{currentPlan?.name}</strong></span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          {/* Usage Meter */}
          <div className="text-xs bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl flex items-center gap-3 w-full sm:w-auto justify-between">
            <div>
              <span className="text-slate-500">Catalog Limit: </span>
              <strong className="text-slate-900 font-bold">{check.currentCount} / {check.maxLimit} items</strong>
            </div>
            <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  check.currentCount >= check.maxLimit ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (check.currentCount / check.maxLimit) * 100)}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Plan limit warning banner */}
      {limitWarning && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{limitWarning}</span>
          </div>
          <button
            onClick={onNavigateToSubscription}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 shrink-0"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Upgrade Subscription</span>
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by title, SKU, or tag..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <p className="text-sm font-semibold">No products found matching filters</p>
            <button
              onClick={handleOpenAdd}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Add your first product to this collection →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Inventory</th>
                  <th className="px-5 py-3">Variants</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate max-w-[200px]">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium">
                        {p.category}
                      </span>
                    </td>

                    <td className="px-5 py-3 font-semibold">
                      {p.discount_price ? (
                        <div>
                          <span className="text-emerald-700 font-bold">${p.discount_price}</span>
                          <span className="line-through text-slate-400 ml-1.5 text-[10px]">${p.price}</span>
                        </div>
                      ) : (
                        <span className="text-slate-900">${p.price}</span>
                      )}
                    </td>

                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        p.stock > 10 ? 'text-emerald-700' : p.stock > 0 ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-medium">
                          {p.sizes.length} sizes
                        </span>
                        <span>·</span>
                        <div className="flex -space-x-1">
                          {p.colors.slice(0, 3).map((c, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                          p.is_active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {p.is_active ? 'Active' : 'Draft'}
                      </button>
                    </td>

                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Edit / Add Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        storeId={activeStore.id}
      />
    </div>
  );
};
