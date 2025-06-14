const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Authentication middleware
const protect = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'No token, authorization denied' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false,
      error: 'Token is not valid' 
    });
  }
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