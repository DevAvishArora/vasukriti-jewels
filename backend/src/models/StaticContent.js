const mongoose = require('mongoose');

const staticContentSchema = new mongoose.Schema({
  sectionKey: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'about-hero',
      'about-story',
      'about-mission',
      'about-values',
      'brand-story',
      'features',
      'testimonials',
      'trust-badges',
      'contact-info',
      'footer-about',
    ],
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  richContent: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  images: [{
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
  }],
  items: [{
    icon: String,
    title: String,
    description: String,
    image: {
      url: String,
      publicId: String,
    },
    link: String,
  }],
  design: {
    layout: {
      type: String,
      enum: ['default', 'grid', 'list', 'masonry', 'slider'],
      default: 'default',
    },
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
    textColor: {
      type: String,
      default: '#000000',
    },
    padding: {
      type: String,
      default: 'normal',
      enum: ['none', 'small', 'normal', 'large'],
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDraft: {
    type: Boolean,
    default: false,
  },
  version: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('StaticContent', staticContentSchema);
