const express = require('express');
const router = express.Router();
const subscriptionController = require('../Controller/subscription-controller');
const { authMiddleware } = require('../Middleware/auth-middleware');

// Get all subscriptions for the authenticated user
router.get('/', authMiddleware, subscriptionController.getSubscriptions);

// Create a new subscription
router.post('/', authMiddleware, subscriptionController.createSubscription);

// Update subscription
router.put('/:id', authMiddleware, subscriptionController.updateSubscription);

// Pause subscription
router.post('/:id/pause', authMiddleware, subscriptionController.pauseSubscription);

// Resume subscription
router.post('/:id/resume', authMiddleware, subscriptionController.resumeSubscription);

// Skip next delivery
router.post('/:id/skip', authMiddleware, subscriptionController.skipNextDelivery);

// Cancel subscription
router.post('/:id/cancel', authMiddleware, subscriptionController.cancelSubscription);

module.exports = router;

