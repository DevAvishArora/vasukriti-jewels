const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

/**
 * Upload single image to Cloudinary
 * @route POST /api/upload/image
 * @access Private
 */
exports.uploadImage = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select an image file.',
      });
    }

    // Upload to Cloudinary using stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: req.body.folder || 'vasukriti-jewels',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({
            success: false,
            message: 'Failed to upload image',
            error: error.message,
          });
        }

        res.status(200).json({
          success: true,
          data: {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          },
        });
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
};

/**
 * Upload multiple images to Cloudinary
 * @route POST /api/upload/images
 * @access Private
 */
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: req.body.folder || 'vasukriti-jewels',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
              });
            }
          }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message,
    });
  }
};

/**
 * Delete image from Cloudinary
 * @route DELETE /api/upload/image/:publicId
 * @access Private
 */
exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete image',
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message,
    });
  }
};

// Export multer middleware
exports.uploadMiddleware = upload;
