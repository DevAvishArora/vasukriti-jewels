const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRevenueChart,
  getSalesByCategory,
  getCustomerInsights,
  getProductPerformance,
} = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/auth.middleware');

// All routes are protected and require admin access
router.use(protect);
router.use(admin);

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard overview statistics
// @access  Private/Admin
router.get('/dashboard', getDashboardStats);

// @route   GET /api/analytics/revenue
// @desc    Get revenue chart data
// @access  Private/Admin
router.get('/revenue', getRevenueChart);

// @route   GET /api/analytics/sales-by-category
// @desc    Get sales by category
// @access  Private/Admin
router.get('/sales-by-category', getSalesByCategory);

// @route   GET /api/analytics/customer-insights
// @desc    Get customer insights
// @access  Private/Admin
router.get('/customer-insights', getCustomerInsights);

// @route   GET /api/analytics/product-performance
// @desc    Get product performance
// @access  Private/Admin
router.get('/product-performance', getProductPerformance);

module.exports = router;
