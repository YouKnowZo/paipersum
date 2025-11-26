const rateLimit = require('express-rate-limit');

// Authentication middleware - extracts user from Auth0 session
const protect = (req, res, next) => {
  // Check if user is authenticated via Auth0
  if (req.oidc && req.oidc.user) {
    // Auth0 user is available
    req.user = {
      sub: req.oidc.user.sub,
      email: req.oidc.user.email,
      name: req.oidc.user.name || req.oidc.user.nickname || req.oidc.user.email,
      picture: req.oidc.user.picture
    };
    return next();
  }

  // For development: allow bypass with header
  if (process.env.NODE_ENV === 'development' && req.headers['x-bypass-auth'] === 'true') {
    req.user = {
      sub: 'dev-user-123',
      email: 'dev@paipersum.com',
      name: 'Dev User',
      picture: null
    };
    return next();
  }

  // Not authenticated
  return res.status(401).json({
    success: false,
    error: 'Authentication required',
    message: 'Please log in to access this resource'
  });
};

// Optional auth - doesn't fail if not authenticated
const optionalAuth = (req, res, next) => {
  if (req.oidc && req.oidc.user) {
    req.user = {
      sub: req.oidc.user.sub,
      email: req.oidc.user.email,
      name: req.oidc.user.name || req.oidc.user.nickname || req.oidc.user.email,
      picture: req.oidc.user.picture
    };
  }
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

module.exports = { protect, optionalAuth, apiLimiter };