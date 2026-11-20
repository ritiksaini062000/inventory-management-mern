// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for developers in non-production
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error Handler] ${req.method} ${req.originalUrl}:`, err);
  }

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    return res.status(404).json({
      success: false,
      message,
    });
  }

  // Mongoose Duplicate Key Error (e.g., unique SKU collision)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `A product with ${field} '${value}' already exists. Please choose a unique ${field}.`;
    return res.status(409).json({
      success: false,
      message,
      field,
    });
  }

  // Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check the submitted fields.',
      errors,
    });
  }

  // Generic internal server error fallback
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
};

// 404 Route Not Found handler
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
