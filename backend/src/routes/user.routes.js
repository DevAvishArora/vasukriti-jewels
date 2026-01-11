const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserStatus,
  deleteUser,
  getUserStats,
  updateProfile,
  getProfile,
  changePassword,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth.middleware');

// All routes require authentication and admin role
router.use(protect);

// Profile routes (for authenticated users, must be before admin middleware)
router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

// Change password route
router.put('/change-password', changePassword);

// Admin-only routes
router.use(admin);

// Stats route (must be before :id routes)
router.get('/stats', getUserStats);

// Main CRUD routes
router.route('/').get(getAllUsers).post(createUser);

router
  .route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Toggle active status
router.patch('/:id/toggle-status', toggleUserStatus);

module.exports = router;
