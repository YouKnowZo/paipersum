const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
require('dotenv').config();

const app = express();

// Security Middleware (Order matters!)
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Speed limiting
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: 100
});

app.use(limiter);
app.use(speedLimiter);

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// Remove Auth0 middleware for dev
// const { auth } = require('express-openid-connect');
// Auth0 Configuration (with enhanced security)
// const authConfig = {
//   authRequired: false,
//   auth0Logout: true,
//   secret: process.env.AUTH0_SECRET,
//   baseURL: process.env.BASE_URL,
//   clientID: process.env.AUTH0_CLIENT_ID,
//   clientSecret: process.env.AUTH0_CLIENT_SECRET, // Added for client_secret_basic
//   issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
//   authorizationParams: {
//     response_type: 'code',
//     audience: process.env.AUTH0_AUDIENCE,
//     scope: 'openid profile email'
//   },
//   routes: {
//     callback: '/api/auth/callback', // Explicit callback path
//     login: false // Disable default login route
//   },
//   session: {
//     cookie: {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: "Lax" // Capital L, as required by express-openid-connect
//     }
//   }
// };

// if (process.env.NODE_ENV === 'production') {
//   authConfig.session.cookie.domain = process.env.COOKIE_DOMAIN;
// }

// app.use(auth(authConfig));

// API Routes (with versioning and improved routing)
const apiRouter = express.Router();
const routes = [
  'waitlist',
  'analyze',
  'scrape',
  'upload',
  'auth'
];

routes.forEach(route => {
  try {
    const routeModule = require(`./routes/${route}`);
    apiRouter.use(`/${route}`, routeModule);
  } catch (error) {
    console.error(`Failed to load route ${route}:`, error);
    // Consider more robust error handling here, like a custom error middleware
  }
});

app.use('/api/v1', apiRouter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Static Files (if needed)
app.use('/static', express.static(path.join(__dirname, 'public')));

// 404 Error Page
app.use((req, res, next) => {
  if (req.accepts('html')) {
    return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Enhanced Error Handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.stack);
  // Audit log for compliance
  if (req.user) {
    // You could call an audit logging service here
    // e.g., AuditLog.create({ user: req.user.id, error: err.message, ... })
  }
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'An unexpected error occurred';
  if (req.accepts('html')) {
    return res.status(statusCode).sendFile(path.join(__dirname, 'public', '500.html'));
  }
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;