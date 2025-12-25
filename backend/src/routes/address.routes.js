const express = require('express');
const { body } = require('express-validator');
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require('../controllers/addressController');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const validateAddress = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please provide a valid 10-digit Indian phone number'),
  body('addressLine1')
    .trim()
    .notEmpty()
    .withMessage('Address line 1 is required'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('pincode')
    .trim()
    .notEmpty()
    .withMessage('Pincode is required')
    .matches(/^[1-9]\d{5}$/)
    .withMessage('Please provide a valid 6-digit pincode'),
  body('label')
    .optional()
    .isIn(['home', 'work', 'other'])
    .withMessage('Label must be home, work, or other'),
];

// All routes require authentication
router.use(protect);

// Routes
router.route('/')
  .get(getAddresses)
  .post(validateAddress, addAddress);

router.route('/:id')
  .put(updateAddress)
  .delete(deleteAddress);

router.patch('/:id/set-default', setDefaultAddress);

module.exports = router;
