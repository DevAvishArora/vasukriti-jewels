const mongoose = require('mongoose');

const promotionalBarSchema = new mongoose.Schema({
  messages: [{
    text: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  }],
  design: {
    type: {
      type: String,
      enum: ['sliding', 'rotating', 'static', 'ticker'],
      default: 'sliding',
    },
    backgroundColor: {
      type: String,
      default: '#7e1219',
    },
    textColor: {
      type: String,
      default: '#ffffff',
    },
    fontSize: {
      type: String,
      default: '14px',
    },
    animation: {
      speed: {
        type: Number,
        default: 30, // seconds
      },
      direction: {
        type: String,
        enum: ['left', 'right', 'up', 'down'],
        default: 'left',
      },
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
}, {
  timestamps: true,
});

module.exports = mongoose.model('PromotionalBar', promotionalBarSchema);
