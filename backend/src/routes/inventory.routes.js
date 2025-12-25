const express = require('express');
const router = express.Router();
const {
  getInventoryOverview,
  updateStock,
  bulkStockUpdate,
  getStockHistory,
  getLowStockAlerts,
  exportInventory,
} = require('../controllers/inventoryController');
const { protect, admin } = require('../middleware/auth.middleware');

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

// Inventory routes
router.get('/', getInventoryOverview);
router.get('/alerts', getLowStockAlerts);
router.get('/export', exportInventory);
router.get('/:id/history', getStockHistory);
router.put('/:id/stock', updateStock);
router.put('/bulk-update', bulkStockUpdate);

module.exports = router;
