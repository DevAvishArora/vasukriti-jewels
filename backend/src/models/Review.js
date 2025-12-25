const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true,
    },
    images: [String],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    helpfulBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
    },
    adminResponse: {
      message: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      respondedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ status: 1 });

// Update product rating when review is saved
reviewSchema.post('save', async function () {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);

  if (product) {
    const Review = mongoose.model('Review');
    const reviews = await Review.find({ product: this.product, status: 'approved' });

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      product.rating.average = totalRating / reviews.length;
      product.rating.count = reviews.length;
      await product.save();
    }
  }
});

// Update product rating when review is deleted
reviewSchema.post('remove', async function () {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);

  if (product) {
    const Review = mongoose.model('Review');
    const reviews = await Review.find({ product: this.product, status: 'approved' });

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      product.rating.average = totalRating / reviews.length;
      product.rating.count = reviews.length;
    } else {
      product.rating.average = 0;
      product.rating.count = 0;
    }
    await product.save();
  }
});

// Static method to calculate average rating for a product
reviewSchema.statics.calcAverageRating = async function(productId) {
  const Product = mongoose.model('Product');
  const product = await Product.findById(productId);

  if (product) {
    const reviews = await this.find({ product: productId, status: 'approved' });

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      product.rating = product.rating || {};
      product.rating.average = totalRating / reviews.length;
      product.rating.count = reviews.length;
      await product.save();
    } else {
      product.rating = product.rating || {};
      product.rating.average = 0;
      product.rating.count = 0;
      await product.save();
    }
  }
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
