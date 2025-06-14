// backend/middlewares/rateLimiter.js
// Dummy rate limiter middleware for development
module.exports = (req, res, next) => {
  // In production, implement real rate limiting logic
  next();
};
