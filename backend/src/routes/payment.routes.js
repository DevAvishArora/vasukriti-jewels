const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createOrder,
  verifyPayment,
  getPaymentStatus,
  handleWebhook,
} = require('../controllers/paymentController');

// @route   POST /api/payment/create-order
// @desc    Create a Razorpay order
// @access  Private
router.post('/create-order', protect, createOrder);

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature
// @access  Private
router.post('/verify', protect, verifyPayment);

// @route   GET /api/payment/status/:orderId
// @desc    Get payment status for an order
// @access  Private
router.get('/status/:orderId', protect, getPaymentStatus);

// @route   POST /api/payment/webhook
// @desc    Handle Razorpay webhooks
// @access  Public (signature verified)
router.post('/webhook', handleWebhook);

module.exports = router;
