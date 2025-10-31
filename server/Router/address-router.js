const express = require('express');
const router = express.Router();
const addressController = require('../Controller/address-controller');
const { authMiddleware } = require('../Middleware/auth-middleware');

// All routes require authentication
router.get('/', authMiddleware, addressController.getUserAddresses);
router.post('/', authMiddleware, addressController.createAddress);
router.put('/:id', authMiddleware, addressController.updateAddress);
router.delete('/:id', authMiddleware, addressController.deleteAddress);
router.patch('/:id/default', authMiddleware, addressController.setDefaultAddress);

module.exports = router;

