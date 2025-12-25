const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  getMyOrders,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  addTrackingInfo,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth.middleware');
const { body, param } = require('express-validator');

// Public routes
router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
    body('items.*.product').isMongoId().withMessage('Invalid product ID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
    body('shippingAddress.phone').trim().notEmpty().withMessage('Phone is required'),
    body('shippingAddress.addressLine1').trim().notEmpty().withMessage('Address is required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
    body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
    body('shippingAddress.pincode').trim().notEmpty().withMessage('Pincode is required'),
    body('paymentMethod')
      .isIn(['razorpay', 'cod'])
      .withMessage('Payment method must be razorpay or cod'),
  ],
  createOrder
);

router.get('/my-orders', protect, getMyOrders);
router.get('/stats', protect, admin, getOrderStats);

router.get(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid order ID')],
  getOrder
);

// Admin routes
router.get('/', protect, admin, getOrders);

router.put(
  '/:id/status',
  protect,
  admin,
  [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('status')
      .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Invalid status'),
  ],
  updateOrderStatus
);

router.put(
  '/:id/payment',
  protect,
  admin,
  [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('paymentStatus')
      .isIn(['pending', 'completed', 'failed', 'refunded'])
      .withMessage('Invalid payment status'),
  ],
  updatePaymentStatus
);

router.put(
  '/:id/tracking',
  protect,
  admin,
  [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('trackingNumber').trim().notEmpty().withMessage('Tracking number is required'),
    body('courier').trim().notEmpty().withMessage('Courier is required'),
  ],
  addTrackingInfo
);

module.exports = router;
