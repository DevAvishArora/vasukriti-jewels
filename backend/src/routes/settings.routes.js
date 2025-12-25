const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  getPublicSettings,
  updateSettingsSection,
  resetSettings,
} = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/auth.middleware');

// Public route
router.get('/public', getPublicSettings);

// Admin routes
router.use(protect);
router.use(admin);

router.route('/').get(getSettings).put(updateSettings);
router.post('/reset', resetSettings);
router.patch('/:section', updateSettingsSection);

module.exports = router;
