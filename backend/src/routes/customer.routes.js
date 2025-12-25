const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const {
  getCustomers,
  getCustomer,
  getCustomerOrders,
  updateCustomerStatus,
  getCustomerStats,
  deleteCustomer,
} = require('../controllers/customerController');
const { protect, admin } = require('../middleware/auth.middleware');

// All routes are protected and require admin access
router.use(protect);
router.use(admin);

// @route   GET /api/customers/analytics/stats
// @desc    Get customer analytics and statistics
// @access  Private/Admin
router.get('/analytics/stats', getCustomerStats);

// @route   GET /api/customers
// @desc    Get all customers with filtering
// @access  Private/Admin
router.get('/', getCustomers);

// @route   GET /api/customers/:id
// @desc    Get single customer with detailed info
// @access  Private/Admin
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid customer ID')],
  getCustomer
);

// @route   GET /api/customers/:id/orders
// @desc    Get customer's order history
// @access  Private/Admin
router.get('/:id/orders', getCustomerOrders);

// @route   PUT /api/customers/:id/status
// @desc    Update customer status (active/inactive)
// @access  Private/Admin
router.put(
  '/:id/status',
  [
    param('id').isMongoId().withMessage('Invalid customer ID'),
    body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  ],
  updateCustomerStatus
);

// @route   DELETE /api/customers/:id
// @desc    Delete (deactivate) customer
// @access  Private/Admin
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid customer ID')],
  deleteCustomer
);

module.exports = router;
