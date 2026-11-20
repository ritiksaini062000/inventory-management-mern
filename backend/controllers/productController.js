const Product = require('../models/Product');

/**
 * @desc    Get all products with pagination, search, filter and sort
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 8,
      search = '',
      category = 'All',
      stockStatus = 'ALL',
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    // Keyword search across Name and SKU
    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { sku: searchRegex }, { supplier: searchRegex }];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Stock status filter
    if (stockStatus === 'IN_STOCK') {
      query.$expr = { $gt: ['$stock', '$lowStockThreshold'] };
    } else if (stockStatus === 'LOW_STOCK') {
      query.$expr = {
        $and: [{ $gt: ['$stock', 0] }, { $lte: ['$stock', '$lowStockThreshold'] }],
      };
    } else if (stockStatus === 'OUT_OF_STOCK') {
      query.stock = 0;
    }

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean({ virtuals: true }),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics & inventory summary
 * @route   GET /api/products/stats
 * @access  Public
 */
const getInventoryStats = async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $facet: {
          metrics: [
            {
              $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalStockUnits: { $sum: '$stock' },
                totalInventoryValue: { $sum: { $multiply: ['$price', '$stock'] } },
                outOfStockCount: {
                  $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] },
                },
                lowStockCount: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gt: ['$stock', 0] },
                          { $lte: ['$stock', '$lowStockThreshold'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
          categories: [
            {
              $group: {
                _id: '$category',
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
        },
      },
    ]);

    const resultMetrics = stats[0].metrics[0] || {
      totalProducts: 0,
      totalStockUnits: 0,
      totalInventoryValue: 0,
      outOfStockCount: 0,
      lowStockCount: 0,
    };

    res.status(200).json({
      success: true,
      data: {
        totalProducts: resultMetrics.totalProducts,
        totalStockUnits: resultMetrics.totalStockUnits,
        totalInventoryValue: Number(resultMetrics.totalInventoryValue.toFixed(2)),
        outOfStockCount: resultMetrics.outOfStockCount,
        lowStockCount: resultMetrics.lowStockCount,
        categories: stats[0].categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Public
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, sku, category, price, stock, lowStockThreshold, supplier, description } = req.body;

    const normalizedSku = sku ? sku.trim().toUpperCase() : '';

    // Check if SKU already exists early for cleaner response
    if (normalizedSku) {
      const existingProduct = await Product.findOne({ sku: normalizedSku });
      if (existingProduct) {
        return res.status(409).json({
          success: false,
          message: `SKU '${normalizedSku}' is already assigned to '${existingProduct.name}'.`,
          field: 'sku',
        });
      }
    }

    const product = await Product.create({
      name,
      sku: normalizedSku,
      category,
      price: Number(price),
      stock: Number(stock),
      lowStockThreshold: lowStockThreshold !== undefined ? Number(lowStockThreshold) : 10,
      supplier,
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Public
 */
const updateProduct = async (req, res, next) => {
  try {
    const { name, sku, category, price, stock, lowStockThreshold, supplier, description } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id: ${req.params.id}`,
      });
    }

    // If SKU is being updated, verify it doesn't conflict with another product
    if (sku) {
      const normalizedSku = sku.trim().toUpperCase();
      if (normalizedSku !== product.sku) {
        const existingSku = await Product.findOne({
          sku: normalizedSku,
          _id: { $ne: req.params.id },
        });

        if (existingSku) {
          return res.status(409).json({
            success: false,
            message: `SKU '${normalizedSku}' is already assigned to '${existingSku.name}'.`,
            field: 'sku',
          });
        }
        product.sku = normalizedSku;
      }
    }

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (lowStockThreshold !== undefined) product.lowStockThreshold = Number(lowStockThreshold);
    if (supplier !== undefined) product.supplier = supplier;
    if (description !== undefined) product.description = description;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Public
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Product '${product.name}' (${product.sku}) deleted successfully`,
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getInventoryStats,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
