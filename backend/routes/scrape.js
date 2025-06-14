const express = require('express');
const { scrapeAndAnalyze } = require('../controllers/scrapeController');

const router = express.Router();

router.post('/', scrapeAndAnalyze);

module.exports = router;