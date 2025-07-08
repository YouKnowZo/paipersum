const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const ApiKey = require('../models/ApiKey');
const crypto = require('crypto');
const ApiUsage = require('../models/ApiUsage');

// Dummy analyzeContent function (replace with real implementation)
async function analyzeContent(content) {
  // Example analysis logic
  return { wordCount: content.split(/\s+/).length };
}

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: async (req) => {
    const key = await ApiKey.findOne({ key: req.headers['x-api-key'] });
    return key?.tier === 'enterprise' ? 1000 : 100;
  }
});

// Remove Auth0 and JWT middleware for dev
router.post('/analyze', apiLimiter, async (req, res) => {
  try {
    const { content } = req.body;
    const analysis = await analyzeContent(content);
    
    // Log API call for billing
    await ApiUsage.create({
      key: req.apiKey?._id,
      endpoint: '/analyze',
      charsProcessed: content.length
    });

    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Key generation endpoint (no auth for dev)
router.post('/keys', async (req, res) => {
  const { tier } = req.body;
  const key = new ApiKey({
    key: crypto.randomBytes(32).toString('hex'),
    tier,
    user: req.user?.id || 'dev-user'
  });
  await key.save();
  res.json({ key: key.key });
});

// Consent Logging Endpoint
router.post('/consent', async (req, res) => {
  try {
    const { consent, userAgent } = req.body;
    // Log consent to DB or file (stubbed for now)
    console.log(`[CONSENT] ${new Date().toISOString()} | ${consent} | ${userAgent || req.headers['user-agent']}`);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Consent logging failed' });
  }
});

// OpenAPI/Swagger Docs Endpoint (stub)
router.get('/openapi', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'PaiperSum API',
      version: '1.0.0',
      description: 'API documentation coming soon.'
    },
    paths: {}
  });
});

// Stripe Billing Endpoints (stub)
router.post('/billing/checkout', (req, res) => {
  res.json({ url: 'https://checkout.stripe.com/pay/test' });
});
router.post('/billing/webhook', (req, res) => {
  // Stripe webhook handler stub
  res.status(200).send('ok');
});

// Admin Audit Log Endpoint (stub)
router.get('/admin/audit-logs', (req, res) => {
  // No auth for dev
  res.json({ logs: [] });
});

// Monitoring/Health Endpoints
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', time: new Date().toISOString() });
});
router.get('/monitor', (req, res) => {
  res.json({ uptime: process.uptime(), memory: process.memoryUsage() });
});

module.exports = router;