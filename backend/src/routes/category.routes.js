const express = require('express');
const { body } = require('express-validator');
const {
  getCategories,
  getCategoryTree,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/auth.middleware');
const { cache } = require('../middleware/cache.middleware');

const router = express.Router();

// Validation middleware
const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('parentCategory')
    .optional()
    .isMongoId()
    .withMessage('Invalid parent category ID'),
];

const validateCategoryUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('parentCategory')
    .optional()
    .isMongoId()
    .withMessage('Invalid parent category ID'),
];

// Public routes (cached for 10 minutes)
router.get('/', cache(600), getCategories);
router.get('/tree', cache(600), getCategoryTree);
router.get('/:slug', cache(300), getCategory);

// Protected admin routes
router.post('/', protect, admin, validateCategory, createCategory);
router.put('/:id', protect, admin, validateCategoryUpdate, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
