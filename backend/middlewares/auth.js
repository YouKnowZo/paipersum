const rateLimit = require('express-rate-limit');

// Authentication middleware (DISABLED for development)
const protect = (req, res, next) => {
  // Skip authentication for all requests
  next();
};

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later'
  }
});

module.exports = { protect, apiLimiter };