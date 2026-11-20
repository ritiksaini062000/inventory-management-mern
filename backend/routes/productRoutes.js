const express = require('express');
const router = express.Router();
const {
  getProducts,
  getInventoryStats,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Aggregate statistics route (must be above /:id to avoid matching :id='stats')
router.get('/stats', getInventoryStats);

// Base resource routes
router.route('/').get(getProducts).post(createProduct);

// Parameterized item routes
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

module.exports = router;
