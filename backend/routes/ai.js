const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.get('/summary/:id', auth, aiController.generateSummary);

module.exports = router;
