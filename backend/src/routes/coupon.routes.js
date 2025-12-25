const express = require('express');
const router = express.Router();
const {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  validateCoupon,
  getCouponStats,
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/auth.middleware');

// Public route for validating coupons
router.post('/validate', protect, validateCoupon);

// Admin routes
router.use(protect);
router.use(admin);

router.get('/stats', getCouponStats);
router.route('/').get(getAllCoupons).post(createCoupon);
router
  .route('/:id')
  .get(getCouponById)
  .put(updateCoupon)
  .delete(deleteCoupon);
router.patch('/:id/toggle', toggleCouponStatus);

module.exports = router;
