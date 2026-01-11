const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['general', 'shipping', 'returns', 'payment', 'products', 'orders', 'account'],
    default: 'general',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDraft: {
    type: Boolean,
    default: false,
  },
  tags: [{
    type: String,
  }],
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
faqSchema.index({ category: 1, order: 1 });
faqSchema.index({ isActive: 1, isDraft: 1 });

module.exports = mongoose.model('FAQ', faqSchema);
