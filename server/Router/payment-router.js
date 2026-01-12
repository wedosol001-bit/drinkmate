const express = require('express');
const router = express.Router();
const arbController = require('../Controller/arb-controller');
const { authenticateToken } = require('../Middleware/auth-middleware');

// ===========================================
// ARB (AL RAJHI BANK) PAYMENT GATEWAY ROUTES
// ===========================================
// Process ARB payment (authenticated)
router.post('/arb/create', authenticateToken, arbController.createPayment);

// Process ARB payment (public - for guest checkout)
router.post('/arb/create/guest', arbController.createPayment);

// Verify ARB payment (POST with encrypted trandata)
router.post('/arb/verify', arbController.verifyPayment);

// Get ARB payment details
router.get('/arb/details/:transactionId', arbController.getPaymentDetails);

// Handle ARB callback/webhook (can be POST or GET)
router.post('/arb/callback', arbController.handleCallback);
router.get('/arb/callback', arbController.handleCallback);

// Handle ARB merchant notification/webhook (must acknowledge quickly)
router.post('/arb/notify', arbController.handleNotification);

// Inquiry ARB payment status
router.post('/arb/inquiry', authenticateToken, arbController.inquiryPayment);

// Refund ARB payment
router.post('/arb/refund', authenticateToken, arbController.refundPayment);

// Void ARB purchase
router.post('/arb/void', authenticateToken, arbController.voidPurchase);

// Void ARB authorization
router.post('/arb/void-auth', authenticateToken, arbController.voidAuthorization);

// Capture ARB authorization
router.post('/arb/capture', authenticateToken, arbController.captureAuthorization);

module.exports = router;