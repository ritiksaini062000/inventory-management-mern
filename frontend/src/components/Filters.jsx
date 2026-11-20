import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';

export const CATEGORIES = [
  'All',
  'Electronics',
  'Furniture',
  'Apparel',
  'Office Supplies',
  'Accessories',
  'Other',
];

export const STOCK_STATUSES = [
  { value: 'ALL', label: 'All Stock Status' },
  { value: 'IN_STOCK', label: 'In Stock' },
  { value: 'LOW_STOCK', label: 'Low Stock' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
];

export const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'stock-asc', label: 'Stock: Low to High' },
  { value: 'stock-desc', label: 'Stock: High to Low' },
  { value: 'name-asc', label: 'Name (A - Z)' },
];

export default function Filters({
  search,
  setSearch,
  category,
  setCategory,
  stockStatus,
  setStockStatus,
  sort,
  setSort,
  onReset,
  hasActiveFilters,
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU, or supplier..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg text-sm text-slate-700 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Dropdown */}
        <div className="md:col-span-2">
          <select
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg text-sm text-slate-700 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
          >
            {STOCK_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="md:col-span-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg text-sm text-slate-700 transition-colors focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters Button */}
        <div className="md:col-span-1 flex justify-end">
          <button
            onClick={onReset}
            disabled={!hasActiveFilters}
            title="Reset Filters"
            className="w-full md:w-auto px-3 py-2 flex items-center justify-center space-x-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-sm transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="md:hidden text-xs">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}

