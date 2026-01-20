const express = require('express');
const router = express.Router();
const whyChooseUsController = require('../controllers/whyChooseUsController');
const { protect, admin } = require('../middleware/auth.middleware');

// Admin routes (put these first to avoid conflicts)
router.get('/admin', protect, admin, whyChooseUsController.getAllAdmin);
router.post('/apply-template', protect, admin, whyChooseUsController.applyTemplate);
router.post('/', protect, admin, whyChooseUsController.create);
router.put('/:id', protect, admin, whyChooseUsController.update);
router.delete('/:id', protect, admin, whyChooseUsController.deleteFeature);

// Public routes
router.get('/', whyChooseUsController.getAll);

module.exports = router;
