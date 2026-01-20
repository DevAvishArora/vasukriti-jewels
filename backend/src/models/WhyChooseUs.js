const mongoose = require('mongoose');

const whyChooseUsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    default: 'award',
    enum: ['shield', 'truck', 'award', 'refresh', 'heart', 'sparkles', 'certificate', 'hammer', 'star', 'check', 'gift', 'diamond'],
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

whyChooseUsSchema.index({ order: 1 });

module.exports = mongoose.model('WhyChooseUs', whyChooseUsSchema);
