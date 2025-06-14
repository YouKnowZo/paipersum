const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
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

router.post('/analyze', apiLimiter, authenticate, authorize('api'), async (req, res) => {
  try {
    const { content } = req.body;
    const analysis = await analyzeContent(content);
    
    // Log API call for billing
    await ApiUsage.create({
      key: req.apiKey._id,
      endpoint: '/analyze',
      charsProcessed: content.length
    });

    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Key generation endpoint
router.post('/keys', authenticate, authorize('admin'), async (req, res) => {
  const { tier } = req.body;
  const key = new ApiKey({
    key: crypto.randomBytes(32).toString('hex'),
    tier,
    user: req.user.id
  });
  await key.save();
  res.json({ key: key.key });
});

module.exports = router;