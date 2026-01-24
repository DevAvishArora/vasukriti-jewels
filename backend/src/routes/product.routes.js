const express = require('express');
const { body, param, query } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  updateStock,
  searchProducts,
  bulkUploadProducts,
  cleanupDeletedProducts,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth.middleware');
const { cache } = require('../middleware/cache.middleware');

const router = express.Router();

// Validation middleware
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('material')
    .notEmpty()
    .withMessage('Material is required')
    .isIn(['Gold', 'Silver', 'Platinum', 'Diamond', 'Gemstone'])
    .withMessage('Invalid material type'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('stockQuantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required'),
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),
];

const validateProductUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),
];

const validateStock = [
  body('stockQuantity')
    .notEmpty()
    .withMessage('Stock quantity is required')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),
];

// Public routes (with caching)
router.get('/', cache(120), getProducts); // Cache for 2 minutes
router.get('/search/autocomplete', searchProducts); // Must be before /:slug
router.get('/featured', cache(300), getFeaturedProducts); // Cache for 5 minutes
router.get('/new-arrivals', cache(300), getNewArrivals); // Cache for 5 minutes
router.get('/best-sellers', cache(300), getBestSellers); // Cache for 5 minutes

// Protected admin routes
router.post('/', protect, admin, validateProduct, createProduct);
router.post('/bulk-upload', protect, admin, bulkUploadProducts);
router.post('/cleanup-deleted', protect, admin, cleanupDeletedProducts);
router.put('/:id', protect, admin, validateProductUpdate, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.patch('/:id/stock', protect, admin, validateStock, updateStock);

// Get single product (must be last to avoid matching specific routes)
router.get('/:slug', cache(300), getProduct); // Cache for 5 minutes

module.exports = router;
