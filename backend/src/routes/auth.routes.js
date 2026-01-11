const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');

const router = express.Router();

// Validation middleware
const validateRegister = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid phone number'),
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const validateForgotPassword = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
];

const validateResetPassword = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Routes
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.get('/me', protect, getMe);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', authLimiter, validateForgotPassword, forgotPassword);
router.post('/reset-password', authLimiter, validateResetPassword, resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', protect, authLimiter, resendVerificationEmail);

module.exports = router;
