const mongoose = require('mongoose');

const heroSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
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
  }],
  cta: {
    text: {
      type: String,
      default: 'Shop Now',
    },
    link: {
      type: String,
      default: '/shop',
    },
    style: {
      type: String,
      enum: ['primary', 'secondary', 'outline', 'ghost'],
      default: 'primary',
    },
  },
  secondaryCta: {
    text: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
    style: {
      type: String,
      enum: ['primary', 'secondary', 'outline', 'ghost'],
      default: 'outline',
    },
  },
  design: {
    layout: {
      type: String,
      enum: ['fullscreen', 'split', 'centered', 'minimal', 'carousel'],
      default: 'fullscreen',
    },
    overlay: {
      enabled: {
        type: Boolean,
        default: true,
      },
      color: {
        type: String,
        default: 'rgba(0, 0, 0, 0.4)',
      },
    },
    textAlignment: {
      type: String,
      enum: ['left', 'center', 'right'],
      default: 'center',
    },
    animation: {
      type: String,
      enum: ['fade', 'slide', 'zoom', 'none'],
      default: 'fade',
    },
    height: {
      type: String,
      default: '100vh',
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
  scheduledPublish: {
    type: Date,
    default: null,
  },
  version: {
    type: Number,
    default: 1,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('HeroSection', heroSectionSchema);
