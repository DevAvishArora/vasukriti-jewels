const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const { cache } = require('../middleware/cache.middleware');

// Import controllers
const {
  getActivePromotionalBar,
  getAllPromotionalBars,
  getPromotionalBarById,
  createPromotionalBar,
  updatePromotionalBar,
  deletePromotionalBar,
  publishPromotionalBar,
  getBrandStory,
  updateBrandStory,
} = require('../controllers/cmsController');

const {
  getActiveHeroSections,
  getAllHeroSections,
  getHeroSectionById,
  createHeroSection,
  updateHeroSection,
  deleteHeroSection,
  publishHeroSection,
  getStaticContentByKey,
  getAllStaticContent,
  upsertStaticContent,
  publishStaticContent,
  getActiveFAQs,
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  updateFAQOrder,
  publishFAQ,
} = require('../controllers/contentController');

// ============= (cached for 5 minutes)
router.get('/promotional-bar/active', cache(300), getActivePromotionalBar);

// Admin routes
router.get('/promotional-bar', protect, admin, getAllPromotionalBars);
router.get('/promotional-bar/:id', protect, admin, getPromotionalBarById);
router.post('/promotional-bar', protect, admin, createPromotionalBar);
router.put('/promotional-bar/:id', protect, admin, updatePromotionalBar);
router.delete('/promotional-bar/:id', protect, admin, deletePromotionalBar);
router.post('/promotional-bar/:id/publish', protect, admin, publishPromotionalBar);

// ==================== HERO SECTION ROUTES ====================
// Public routes (cached for 5 minutes)
router.get('/hero/active', cache(300), getActiveHeroSections);

// Admin routes
router.get('/hero', protect, admin, getAllHeroSections);
router.get('/hero/:id', protect, admin, getHeroSectionById);
router.post('/hero', protect, admin, createHeroSection);
router.put('/hero/:id', protect, admin, updateHeroSection);
router.delete('/hero/:id', protect, admin, deleteHeroSection);
router.post('/hero/:id/publish', protect, admin, publishHeroSection);

// ==================== STATIC CONTENT ROUTES ====================
// Public routes (cached for 10 minutes)
router.get('/static/:key', cache(600), getStaticContentByKey);

// Admin routes
router.get('/static', protect, admin, getAllStaticContent);
router.put('/static/:sectionKey', protect, admin, upsertStaticContent);
router.post('/static/:sectionKey/publish', protect, admin, publishStaticContent);

// ==================== FAQ ROUTES ====================
// Public routes (cached for 10 minutes)
router.get('/faq/active', cache(600), getActiveFAQs);

// Admin routes
router.get('/faq', protect, admin, getAllFAQs);
router.get('/faq/:id', protect, admin, getFAQById);
router.post('/faq', protect, admin, createFAQ);
router.put('/faq/:id', protect, admin, updateFAQ);
router.delete('/faq/:id', protect, admin, deleteFAQ);
router.post('/faq/order', protect, admin, updateFAQOrder);
router.post('/faq/:id/publish', protect, admin, publishFAQ);

// ==================== BRAND STORY ROUTES ====================
// Public route (cached for 10 minutes)
router.get('/brand-story', cache(600), getBrandStory);

// Admin route
router.post('/brand-story', protect, admin, updateBrandStory);

module.exports = router;
