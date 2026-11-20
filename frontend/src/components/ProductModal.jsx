import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CATEGORIES } from './Filters';

export default function ProductModal({ isOpen, onClose, onSubmit, product, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Electronics',
    price: '',
    stock: '',
    lowStockThreshold: '10',
    supplier: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || 'Electronics',
        price: product.price !== undefined ? String(product.price) : '',
        stock: product.stock !== undefined ? String(product.stock) : '',
        lowStockThreshold: product.lowStockThreshold !== undefined ? String(product.lowStockThreshold) : '10',
        supplier: product.supplier || '',
        description: product.description || '',
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: 'Electronics',
        price: '',
        stock: '0',
        lowStockThreshold: '10',
        supplier: '',
        description: '',
      });
    }
    setErrors({});
  }, [product, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU identifier is required';
    } else if (!/^[A-Za-z0-9-]+$/.test(formData.sku.trim())) {
      newErrors.sku = 'SKU can only contain letters, numbers, and hyphens (e.g., ELEC-101)';
    }

    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Please enter a valid non-negative price';
    }

    if (formData.stock === '' || isNaN(formData.stock) || !Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative whole integer';
    }

    if (formData.lowStockThreshold !== '' && (isNaN(formData.lowStockThreshold) || Number(formData.lowStockThreshold) < 0)) {
      newErrors.lowStockThreshold = 'Threshold cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      lowStockThreshold: parseInt(formData.lowStockThreshold || '10', 10),
      supplier: formData.supplier.trim() || 'General Supplier',
      description: formData.description.trim(),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const selectableCategories = CATEGORIES.filter((c) => c !== 'All');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {product ? 'Edit Product' : 'Add New Inventory Item'}
            </h2>
            <p className="text-xs text-slate-500">
              {product ? 'Update existing item details and stock levels.' : 'Fill in the details to register a new product.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Product Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              className={`w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border rounded-lg transition-colors focus:outline-hidden focus:ring-2 ${
                errors.name
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* SKU & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                SKU <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. ELEC-9021"
                className={`w-full px-3.5 py-2 text-sm uppercase bg-slate-50 focus:bg-white border rounded-lg transition-colors focus:outline-hidden focus:ring-2 ${
                  errors.sku
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              {errors.sku && <p className="text-xs text-rose-500 mt-1">{errors.sku}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
              >
                {selectableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price, Stock & Low Stock Threshold */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Price ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border rounded-lg transition-colors focus:outline-hidden focus:ring-2 ${
                  errors.price
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Stock <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className={`w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border rounded-lg transition-colors focus:outline-hidden focus:ring-2 ${
                  errors.stock
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              {errors.stock && <p className="text-xs text-rose-500 mt-1">{errors.stock}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Min Alert Level
              </label>
              <input
                type="number"
                step="1"
                min="0"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                placeholder="10"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Supplier */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Supplier / Vendor
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              placeholder="e.g. Apex Distribution Ltd."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description / Notes
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add optional notes, specifications or warranty info..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

