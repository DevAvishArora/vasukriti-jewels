const express = require('express');
const router = express.Router();
const { getBrandStory, updateBrandStory } = require('../controllers/cmsController');
const { protect, admin } = require('../middleware/auth.middleware');

// Public route
router.get('/brand-story', getBrandStory);

// Admin routes
router.post('/brand-story', protect, admin, updateBrandStory);

module.exports = router;
