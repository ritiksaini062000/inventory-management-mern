import React from 'react';
import { Edit2, Trash2, PackageOpen, AlertCircle } from 'lucide-react';

export default function ProductTable({ products, loading, onEdit, onDelete, onClearFilters }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-indigo-600 mb-3"></div>
          <p className="text-sm font-medium text-slate-600">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <PackageOpen className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No products found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          No inventory items match your current query or filter criteria. Try adjusting or clearing your filters.
        </p>
        <button
          onClick={onClearFilters}
          className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  const renderStockBadge = (product) => {
    const stock = product.stock;
    const threshold = product.lowStockThreshold || 10;

    if (stock === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-600/20">
          Out of Stock (0)
        </span>
      );
    }
    if (stock <= threshold) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-600/20">
          Low Stock ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
        In Stock ({stock})
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="px-6 py-3.5">Product</th>
              <th scope="col" className="px-6 py-3.5">SKU</th>
              <th scope="col" className="px-6 py-3.5">Category</th>
              <th scope="col" className="px-6 py-3.5 text-right">Price</th>
              <th scope="col" className="px-6 py-3.5 text-center">Status</th>
              <th scope="col" className="px-6 py-3.5">Supplier</th>
              <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {products.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50/60 transition-colors group">
                {/* Product Name & Description */}
                <td className="px-6 py-4 max-w-xs">
                  <div className="font-medium text-slate-900 line-clamp-1">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</div>
                  )}
                </td>

                {/* SKU */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono text-xs font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {item.sku}
                  </span>
                </td>

                {/* Category */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-slate-600">{item.category}</span>
                </td>

                {/* Price */}
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-slate-900">
                  ${Number(item.price).toFixed(2)}
                </td>

                {/* Stock Status */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {renderStockBadge(item)}
                </td>

                {/* Supplier */}
                <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs">
                  {item.supplier || 'N/A'}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(item)}
                      title="Edit Product"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      title="Delete Product"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

