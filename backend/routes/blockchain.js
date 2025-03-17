const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchainController');
const auth = require('../middleware/auth');

router.post('/verify', auth, blockchainController.verifyDocument);
router.get('/status/:id', auth, blockchainController.getVerificationStatus);

module.exports = router;
