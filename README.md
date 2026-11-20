# ProStock - Full-Stack MERN Inventory Management System

A production-ready, clean-architecture MERN stack application built for real-world inventory tracking, product cataloging, and stock management.

Designed to follow standard software engineering practices: clear separation of concerns (MVC architecture), robust input validation, centralized error handling, responsive UI with Tailwind CSS, and seamless RESTful API communication.

---

## Architecture Overview

```
inventory-management-mern/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection with retry & status listeners
│   ├── controllers/
│   │   └── productController.js  # CRUD logic, aggregation stats, pagination & search
│   ├── middleware/
│   │   └── errorHandler.js       # Centralized Mongoose & HTTP error handler
│   ├── models/
│   │   └── Product.js            # Mongoose schema, virtuals, and compound indexes
│   ├── routes/
│   │   └── productRoutes.js      # REST API route definitions
│   ├── scripts/
│   │   └── seed.js               # Database seeding script with realistic sample data
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies (Express, Mongoose, CORS, Morgan)
│   └── server.js                 # Express app initialization & graceful shutdown
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # Brand vector icon
│   ├── src/
│   │   ├── api/
│   │   │   └── productService.js # Axios API layer with error formatting
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Header with actions & refresh indicator
│   │   │   ├── StatsCards.jsx    # Real-time inventory metrics & valuation
│   │   │   ├── Filters.jsx       # Debounced search, category, status & sort
│   │   │   ├── ProductTable.jsx  # Responsive data table with dynamic stock badges
│   │   │   ├── ProductModal.jsx  # Create/Edit modal with client-side validation
│   │   │   ├── DeleteConfirmModal.jsx # Destructive action confirmation dialog
│   │   │   ├── Pagination.jsx    # Accessible multi-page navigation
│   │   │   └── Toast.jsx         # Custom floating status alerts
│   │   ├── App.jsx               # Main application controller
│   │   ├── index.css             # Tailwind base & custom scrollbar
│   │   └── main.jsx              # React 18 DOM mount
│   ├── index.html
│   ├── package.json              # Frontend dependencies (React, Vite, Tailwind, Lucide)
│   ├── tailwind.config.js
│   └── vite.config.js            # Vite setup with dev proxy to :5000
└── README.md
```

---

## Key Features

1. **Complete CRUD Capabilities**:
   - **Create**: Add new inventory items with auto-formatted SKU, category selection, unit price, stock count, and low-stock warning threshold.
   - **Read**: Fetch products with server-side pagination, debounced multi-field search (Name, SKU, Supplier), category filtering, stock level filtering, and dynamic sorting.
   - **Update**: Edit product details in a modal with pre-populated values and instant schema validation.
   - **Delete**: Soft-safe deletion flow with a confirmation dialog to prevent accidental data loss.

2. **Real-Time Aggregation Metrics**:
   - Total inventory items count
   - Total units in stock
   - Total valuation based on current unit pricing
   - Dynamic low stock alerts (items at or below threshold)
   - Out of stock warnings (items with 0 units)

3. **Production Engineering Quality**:
   - **Clean Code**: No boilerplate filler; clear variable and function naming.
   - **Database Indexing**: Compound index on `{ category: 1, stock: 1 }` and text indexes on name/SKU for high query throughput.
   - **Centralized Error Handling**: Normalizes Mongoose `CastError`, duplicate key `11000`, and validation errors into user-friendly JSON responses.
   - **Graceful Shutdown**: Node.js listener handles `SIGINT`/`SIGTERM` to close HTTP connections cleanly.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB running locally or a MongoDB Atlas connection string

---

### Step 1: Backend Setup

1. Open a terminal in the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   A `.env` file is already provided. If using MongoDB Atlas, replace `MONGODB_URI`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/inventory_db
   NODE_ENV=development
   ```

4. Seed the database with sample inventory items:
   ```bash
   npm run seed
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   # Server will run on http://localhost:5000
   ```

---

### Step 2: Frontend Setup

1. Open a new terminal in the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   # App will open at http://localhost:3000
   ```

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service uptime and health check |
| `GET` | `/api/products/stats` | Aggregated inventory metrics and valuation |
| `GET` | `/api/products` | Paginated product list with search/filter/sort |
| `GET` | `/api/products/:id` | Retrieve single product details |
| `POST` | `/api/products` | Register a new product item |
| `PUT` | `/api/products/:id` | Update an existing product |
| `DELETE` | `/api/products/:id` | Delete product by ID |

