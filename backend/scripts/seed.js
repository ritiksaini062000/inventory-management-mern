const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();

const sampleProducts = [
  {
    name: 'Dell UltraSharp 27" 4K Monitor',
    sku: 'ELEC-2701',
    category: 'Electronics',
    price: 549.99,
    stock: 24,
    lowStockThreshold: 8,
    supplier: 'Dell Technologies',
    description: 'High-precision IPS 4K UHD display with 99% sRGB color gamut and USB-C hub connectivity.',
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    sku: 'ELEC-3802',
    category: 'Electronics',
    price: 99.0,
    stock: 6,
    lowStockThreshold: 10,
    supplier: 'Logitech Int.',
    description: 'Ergonomic performance mouse with quiet clicks and 8K DPI any-surface sensor.',
  },
  {
    name: 'Keychron K2 Mechanical Keyboard',
    sku: 'ELEC-4410',
    category: 'Electronics',
    price: 79.99,
    stock: 0,
    lowStockThreshold: 10,
    supplier: 'Keychron Co.',
    description: '75% compact wireless mechanical keyboard with hot-swappable Gateron G Pro switches.',
  },
  {
    name: 'Herman Miller Aeron Ergonomic Chair',
    sku: 'FURN-1020',
    category: 'Furniture',
    price: 1295.0,
    stock: 5,
    lowStockThreshold: 5,
    supplier: 'Herman Miller',
    description: 'Iconic ergonomic mesh office chair engineered with lumbar PostureFit support.',
  },
  {
    name: 'Standing Desk Dual-Motor Pro (60x30)',
    sku: 'FURN-2045',
    category: 'Furniture',
    price: 499.0,
    stock: 14,
    lowStockThreshold: 5,
    supplier: 'DeskCraft Solutions',
    description: 'Electric adjustable height standing desk with memory presets and anti-collision sensor.',
  },
  {
    name: 'Anker 737 GaN 140W Power Bank',
    sku: 'ACC-8812',
    category: 'Accessories',
    price: 109.99,
    stock: 3,
    lowStockThreshold: 10,
    supplier: 'Anker Innovations',
    description: 'High-speed 24,000mAh external battery pack with smart digital display and Power Delivery 3.1.',
  },
  {
    name: 'CalDigit TS4 Thunderbolt 4 Dock',
    sku: 'ACC-9921',
    category: 'Accessories',
    price: 399.95,
    stock: 18,
    lowStockThreshold: 6,
    supplier: 'CalDigit Inc.',
    description: '18-port flagship workstation dock with 98W charging, dual display support, and 2.5GbE.',
  },
  {
    name: 'Heavy-Duty Laptop Cooling Stand',
    sku: 'ACC-3120',
    category: 'Accessories',
    price: 45.5,
    stock: 42,
    lowStockThreshold: 15,
    supplier: 'General Supplier',
    description: 'Foldable aluminum riser with dual silent cooling fans and 6 angle tilt adjustments.',
  },
  {
    name: 'Pilot G2 Premium Gel Pens (Pack of 12)',
    sku: 'OFF-1102',
    category: 'Office Supplies',
    price: 18.25,
    stock: 120,
    lowStockThreshold: 25,
    supplier: 'Pilot Pen Corp.',
    description: 'Smooth writing 0.7mm fine point gel ink pens with comfortable contoured rubber grip.',
  },
  {
    name: 'Moleskine Classic Hardcover Notebook',
    sku: 'OFF-5501',
    category: 'Office Supplies',
    price: 22.0,
    stock: 8,
    lowStockThreshold: 12,
    supplier: 'Moleskine SpA',
    description: 'Ruled journal with ribbon bookmark, expandable inner pocket, and acid-free paper.',
  },
  {
    name: 'Developer Tech Hoodie (Black, Large)',
    sku: 'APP-7001',
    category: 'Apparel',
    price: 65.0,
    stock: 0,
    lowStockThreshold: 10,
    supplier: 'ThreadOps Studio',
    description: '100% organic heavyweight cotton hoodie with reinforced kangaroo pocket and minimal embroidery.',
  },
  {
    name: 'Cable Management Organizer Sleeve (4-Pack)',
    sku: 'OFF-9124',
    category: 'Office Supplies',
    price: 15.99,
    stock: 35,
    lowStockThreshold: 10,
    supplier: 'General Supplier',
    description: 'Flexible neoprene zipper cord organizers for decluttering desk and entertainment setups.',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing product records...');
    await Product.deleteMany({});

    console.log(`[Seed] Inserting ${sampleProducts.length} sample inventory items...`);
    const created = await Product.insertMany(sampleProducts);

    console.log(`[Seed] Successfully seeded ${created.length} products!`);
    console.log('[Seed] Categories seeded:', [...new Set(created.map((p) => p.category))].join(', '));

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
