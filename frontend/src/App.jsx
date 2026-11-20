import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import Filters from './components/Filters';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Pagination from './components/Pagination';
import Toast from './components/Toast';
import {
  fetchProducts,
  fetchInventoryStats,
  createProduct,
  updateProduct,
  deleteProduct,
  getErrorMessage,
} from './api/productService';
import { AlertCircle } from 'lucide-react';

export default function App() {
  // Inventory state
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 8;

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [stockStatus, setStockStatus] = useState('ALL');
  const [sort, setSort] = useState('createdAt-desc');

  // Loading & network state
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [serverError, setServerError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (type, message, title = '') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ type, message, title });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await fetchInventoryStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch stats:', err.message);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Load products
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setServerError(null);

      const [sortBy, order] = sort.split('-');

      const res = await fetchProducts({
        page,
        limit,
        search: debouncedSearch,
        category,
        stockStatus,
        sortBy,
        order,
      });

      if (res.success) {
        setProducts(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      setServerError(msg);
      showToast('error', msg, 'Connection Issue');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [page, debouncedSearch, category, stockStatus, sort]);

  // Initial and reactive load
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadProducts();
    loadStats();
    showToast('info', 'Refreshing inventory data...', 'Updating');
  };

  // Filter change handlers that reset page
  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
  };

  const handleStockStatusChange = (val) => {
    setStockStatus(val);
    setPage(1);
  };

  const handleSortChange = (val) => {
    setSort(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All');
    setStockStatus('ALL');
    setSort('createdAt-desc');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search || category !== 'All' || stockStatus !== 'ALL' || sort !== 'createdAt-desc'
  );

  // Modal openers
  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Submit product (Create or Edit)
  const handleSubmitProduct = async (formData) => {
    try {
      setIsSubmitting(true);
      if (selectedProduct) {
        // Edit existing
        const res = await updateProduct(selectedProduct._id, formData);
        if (res.success) {
          showToast('success', `"${formData.name}" was updated successfully.`, 'Product Updated');
        }
      } else {
        // Create new
        const res = await createProduct(formData);
        if (res.success) {
          showToast('success', `"${formData.name}" has been added to inventory.`, 'Product Created');
        }
      }

      setIsModalOpen(false);
      setSelectedProduct(null);
      loadProducts();
      loadStats();
    } catch (err) {
      showToast('error', getErrorMessage(err), 'Action Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product confirmation
  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      setIsDeleting(true);
      const res = await deleteProduct(selectedProduct._id);
      if (res.success) {
        showToast('success', `"${selectedProduct.name}" was permanently removed.`, 'Deleted');
      }
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      // If we're on a page that becomes empty after deletion, step back
      if (products.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        loadProducts();
      }
      loadStats();
    } catch (err) {
      showToast('error', getErrorMessage(err), 'Deletion Failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <Navbar
        onAddProduct={handleOpenAddModal}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Backend Connection Warning Banner if offline */}
        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold">Unable to connect to Backend Server</p>
              <p className="mt-0.5 text-amber-700">
                Please make sure the backend server is running on port 5000 (<code className="px-1 py-0.5 bg-amber-100 rounded text-xs">npm run dev</code> inside <code className="px-1 py-0.5 bg-amber-100 rounded text-xs">backend/</code>) and MongoDB is active.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Metric Overview Cards */}
        <StatsCards stats={stats} loading={statsLoading} />

        {/* Search, Filter & Sort Controls */}
        <Filters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={handleCategoryChange}
          stockStatus={stockStatus}
          setStockStatus={handleStockStatusChange}
          sort={sort}
          setSort={handleSortChange}
          onReset={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Inventory Data Table */}
        <ProductTable
          products={products}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onClearFilters={handleClearFilters}
        />

        {/* Pagination Bar */}
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <p>ProStock Inventory Operations &copy; {new Date().getFullYear()} &bull; Built with MERN Stack (MongoDB, Express, React, Node.js)</p>
      </footer>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitProduct}
        product={selectedProduct}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        product={selectedProduct}
        isDeleting={isDeleting}
      />

      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

