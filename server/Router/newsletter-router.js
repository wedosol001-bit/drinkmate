const express = require('express');
const router = express.Router();
const newsletterController = require('../Controller/newsletter-controller');
const { authMiddleware } = require('../Middleware/auth-middleware');

// Public routes
router.post('/subscribe', newsletterController.subscribe);
router.post('/unsubscribe', newsletterController.unsubscribe);

// Authenticated routes
router.get('/status', authMiddleware, newsletterController.getStatus);

module.exports = router;

