const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9-]+$/, 'SKU can only contain uppercase letters, numbers, and hyphens (e.g. ELEC-1001)'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Electronics', 'Furniture', 'Apparel', 'Office Supplies', 'Accessories', 'Other'],
        message: '{VALUE} is not a valid category',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value for stock',
      },
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, 'Low stock threshold cannot be negative'],
    },
    supplier: {
      type: String,
      trim: true,
      default: 'General Supplier',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for calculating current stock status on the fly
productSchema.virtual('stockStatus').get(function () {
  if (this.stock === 0) return 'OUT_OF_STOCK';
  if (this.stock <= this.lowStockThreshold) return 'LOW_STOCK';
  return 'IN_STOCK';
});

// Indexes for fast lookup and filtering
productSchema.index({ category: 1, stock: 1 });
productSchema.index({ name: 'text', sku: 'text' });

module.exports = mongoose.model('Product', productSchema);
