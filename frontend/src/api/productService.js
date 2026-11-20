import axios from 'axios';

// Base API URL configuration: uses Vite proxy in dev (/api), or custom env var in prod
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Fetch products list with filtering, searching, sorting and pagination
 */
export const fetchProducts = async (params = {}) => {
  const response = await apiClient.get('/products', { params });
  return response.data;
};

/**
 * Fetch overview dashboard metrics
 */
export const fetchInventoryStats = async () => {
  const response = await apiClient.get('/products/stats');
  return response.data;
};

/**
 * Fetch a single product by ID
 */
export const fetchProductById = async (id) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

/**
 * Create a new product
 */
export const createProduct = async (productData) => {
  const response = await apiClient.post('/products', productData);
  return response.data;
};

/**
 * Update an existing product by ID
 */
export const updateProduct = async (id, productData) => {
  const response = await apiClient.put(`/products/${id}`, productData);
  return response.data;
};

/**
 * Delete a product by ID
 */
export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};

/**
 * Helper to extract human-readable error messages from Axios responses
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors.map((e) => e.message).join(', ');
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};
