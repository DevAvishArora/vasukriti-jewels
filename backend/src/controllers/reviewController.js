const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * @desc    Get all reviews with filters
 * @route   GET /api/reviews
 * @access  Private/Admin
 */
exports.getAllReviews = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      rating,
      search,
      product,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    // Status filter
    if (status) {
      query.status = status;
    }

    // Rating filter
    if (rating) {
      query.rating = Number.parseInt(rating);
    }

    // Product filter
    if (product) {
      query.product = product;
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('user', 'fullName email')
        .populate('product', 'name images')
        .sort({ [sortBy]: sortOrder })
        .limit(Number.parseInt(limit))
        .skip(skip)
        .lean(),
      Review.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          current: Number.parseInt(page),
          pages: Math.ceil(total / Number.parseInt(limit)),
          total,
          limit: Number.parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get review by ID
 * @route   GET /api/reviews/:id
 * @access  Private/Admin
 */
exports.getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'fullName email phone')
      .populate('product', 'name images price')
      .populate('order', 'orderNumber')
      .populate('adminResponse.respondedBy', 'fullName')
      .lean();

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create review (for customers)
 * @route   POST /api/reviews
 * @access  Private
 */
exports.createReview = async (req, res, next) => {
  try {
    const { product, rating, title, comment, orderId } = req.body;

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product,
      user: req.user._id,
    });

    if (existingReview) {
      res.status(400);
      throw new Error('You have already reviewed this product');
    }

    // Check if verified purchase
    let isVerifiedPurchase = false;
    let order = null;

    if (orderId) {
      order = await Order.findOne({
        _id: orderId,
        user: req.user._id,
        'items.product': product,
        status: 'delivered',
      });

      if (order) {
        isVerifiedPurchase = true;
      }
    }

    const review = await Review.create({
      product,
      user: req.user._id,
      order: order?._id,
      rating,
      title,
      comment,
      isVerifiedPurchase,
    });

    await review.populate('user', 'fullName email');
    await review.populate('product', 'name images');

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update review status (approve/reject)
 * @route   PATCH /api/reviews/:id/status
 * @access  Private/Admin
 */
exports.updateReviewStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    const oldStatus = review.status;
    review.status = status;

    if (status === 'rejected' && rejectionReason) {
      review.rejectionReason = rejectionReason;
    }

    await review.save();

    // Recalculate product rating if status changed to/from approved
    if (oldStatus === 'approved' || status === 'approved') {
      await Review.calcAverageRating(review.product);
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add admin response to review
 * @route   PATCH /api/reviews/:id/respond
 * @access  Private/Admin
 */
exports.respondToReview = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400);
      throw new Error('Response message is required');
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    review.adminResponse = {
      message,
      respondedBy: req.user._id,
      respondedAt: new Date(),
    };

    await review.save();
    await review.populate('adminResponse.respondedBy', 'fullName');

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Private/Admin
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    const productId = review.product;
    await review.deleteOne();

    // Recalculate product rating
    await Review.calcAverageRating(productId);

    res.status(200).json({
      success: true,
      data: {
        message: 'Review deleted successfully',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get reviews for a specific product
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
exports.getProductReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ product: req.params.productId, status: 'approved' })
        .populate('user', 'fullName')
        .populate('adminResponse.respondedBy', 'fullName')
        .sort({ [sortBy]: -1 })
        .limit(Number.parseInt(limit))
        .skip(skip)
        .lean(),
      Review.countDocuments({
        product: req.params.productId,
        status: 'approved',
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          current: Number.parseInt(page),
          pages: Math.ceil(total / Number.parseInt(limit)),
          total,
          limit: Number.parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get review statistics
 * @route   GET /api/reviews/stats
 * @access  Private/Admin
 */
exports.getReviewStats = async (req, res, next) => {
  try {
    const stats = await Review.aggregate([
      {
        $facet: {
          totalReviews: [{ $count: 'count' }],
          pendingReviews: [
            { $match: { status: 'pending' } },
            { $count: 'count' },
          ],
          approvedReviews: [
            { $match: { status: 'approved' } },
            { $count: 'count' },
          ],
          rejectedReviews: [
            { $match: { status: 'rejected' } },
            { $count: 'count' },
          ],
          averageRating: [
            { $match: { status: 'approved' } },
            { $group: { _id: null, avg: { $avg: '$rating' } } },
          ],
          ratingDistribution: [
            { $match: { status: 'approved' } },
            { $group: { _id: '$rating', count: { $sum: 1 } } },
            { $sort: { _id: -1 } },
          ],
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: stats[0].totalReviews[0]?.count || 0,
        pending: stats[0].pendingReviews[0]?.count || 0,
        approved: stats[0].approvedReviews[0]?.count || 0,
        rejected: stats[0].rejectedReviews[0]?.count || 0,
        averageRating: stats[0].averageRating[0]?.avg || 0,
        ratingDistribution: stats[0].ratingDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark review as helpful
 * @route   POST /api/reviews/:id/helpful
 * @access  Private
 */
exports.markHelpful = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Check if user already marked as helpful
    const alreadyMarked = review.helpfulBy.includes(req.user._id);

    if (alreadyMarked) {
      // Remove from helpful
      review.helpfulBy = review.helpfulBy.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
      review.helpful = review.helpfulBy.length;
    } else {
      // Add to helpful
      review.helpfulBy.push(req.user._id);
      review.helpful = review.helpfulBy.length;
    }

    await review.save();

    res.status(200).json({
      success: true,
      data: {
        helpful: review.helpful,
        markedByUser: !alreadyMarked,
      },
    });
  } catch (error) {
    next(error);
  }
};
