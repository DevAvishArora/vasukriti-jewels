const mongoose = require('mongoose');

const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'heading', 'paragraph', 'image', 'list', 'stats', 'quote', 'image-text'],
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Can be string, array, or object
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  design: {
    style: {
      type: String,
      enum: ['default', 'gradient', 'bordered', 'minimal', 'bold'],
      default: 'default',
    },
    alignment: {
      type: String,
      enum: ['left', 'center', 'right'],
      default: 'left',
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },
    color: {
      type: String,
      enum: ['blue', 'purple', 'gold', 'rose', 'emerald'],
      default: 'gold',
    },
  },
  layout: {
    imagePosition: {
      type: String,
      enum: ['left', 'right', 'top', 'bottom'],
      default: 'left',
    },
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const pageContentSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    unique: true,
    enum: ['about', 'brand-story', 'why-choose-us', 'testimonials', 'hero', 'newsletter'],
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  sections: [contentBlockSchema],
  metadata: {
    seoTitle: String,
    seoDescription: String,
    keywords: [String],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes
pageContentSchema.index({ page: 1 });
pageContentSchema.index({ isActive: 1 });

// Virtual for formatted date
pageContentSchema.virtual('formattedUpdatedAt').get(function() {
  return this.updatedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Ensure virtuals are included in JSON
pageContentSchema.set('toJSON', { virtuals: true });
pageContentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('PageContent', pageContentSchema);
