const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const {
  uploadImage,
  uploadImages,
  deleteImage,
  uploadMiddleware,
} = require('../controllers/uploadController');

// @route   POST /api/upload/image
// @desc    Upload single image
// @access  Private
router.post('/image', protect, uploadMiddleware.single('image'), uploadImage);

// @route   POST /api/upload/images
// @desc    Upload multiple images
// @access  Private
router.post('/images', protect, uploadMiddleware.array('images', 10), uploadImages);

// @route   DELETE /api/upload/image/:publicId
// @desc    Delete image from Cloudinary
// @access  Private/Admin
router.delete('/image/:publicId', protect, admin, deleteImage);

module.exports = router;
