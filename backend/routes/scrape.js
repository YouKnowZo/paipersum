const express = require('express');
const { scrapeAndAnalyze } = require('../controllers/scrapeController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/', protect, scrapeAndAnalyze);

module.exports = router;