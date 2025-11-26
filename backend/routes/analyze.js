// routes/analyze.js
const express = require('express');
const multer = require('multer');
const { apiLimiter } = require('../middlewares/rateLimiter');
const { protect } = require('../middlewares/auth');
const { 
  analyzeText, 
  analyzePdf, 
  analyzeDocx 
} = require('../controllers/analyzeController');

const router = express.Router();
const upload = multer();
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/text', protect, apiLimiter, asyncHandler(analyzeText));
router.post('/pdf', protect, apiLimiter, upload.single('file'), asyncHandler(analyzePdf));
router.post('/docx', protect, apiLimiter, upload.single('file'), asyncHandler(analyzeDocx));

module.exports = router;