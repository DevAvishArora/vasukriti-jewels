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
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth.middleware');

// All routes require authentication and admin role
router.use(protect);
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
