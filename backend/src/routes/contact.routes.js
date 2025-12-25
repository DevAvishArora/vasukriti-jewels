const express = require('express');
const router = express.Router();
const {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats,
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth.middleware');

// Public route
router.post('/', submitContactForm);

// Admin routes
router.get('/', protect, admin, getAllContacts);
router.get('/stats', protect, admin, getContactStats);
router.get('/:id', protect, admin, getContactById);
router.patch('/:id/status', protect, admin, updateContactStatus);
router.delete('/:id', protect, admin, deleteContact);

module.exports = router;
