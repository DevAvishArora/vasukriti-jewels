const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  getReviewById,
  createReview,
  updateReviewStatus,
  respondToReview,
  deleteReview,
  getProductReviews,
  getReviewStats,
  markHelpful,
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth.middleware');

// Public routes
router.get('/product/:productId', getProductReviews);

// Customer routes
router.use(protect);
router.post('/', createReview);
router.post('/:id/helpful', markHelpful);

// Admin routes
router.get('/stats', admin, getReviewStats);
router.get('/', admin, getAllReviews);
router.get('/:id', admin, getReviewById);
router.patch('/:id/status', admin, updateReviewStatus);
router.patch('/:id/respond', admin, respondToReview);
router.delete('/:id', admin, deleteReview);

module.exports = router;
