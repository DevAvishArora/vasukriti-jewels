const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    // Site Information
    siteName: {
      type: String,
      default: 'Vasukriti',
    },
    siteDescription: {
      type: String,
      default: 'Premium Jewelry Collection',
    },
    contactEmail: {
      type: String,
      default: 'contact@vasukritijewels.com',
    },
    contactPhone: {
      type: String,
      default: '+91 98765 43210',
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'India' },
    },

    // Business Settings
    currency: {
      type: String,
      default: 'INR',
    },
    currencySymbol: {
      type: String,
      default: '₹',
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },

    // Tax Configuration
    tax: {
      enabled: {
        type: Boolean,
        default: true,
      },
      gstRate: {
        type: Number,
        default: 3,
        min: 0,
        max: 100,
      },
      includedInPrice: {
        type: Boolean,
        default: false,
      },
    },

    // Shipping Configuration
    shipping: {
      enabled: {
        type: Boolean,
        default: true,
      },
      freeShippingThreshold: {
        type: Number,
        default: 5000,
      },
      defaultShippingCharge: {
        type: Number,
        default: 100,
      },
      estimatedDeliveryDays: {
        min: { type: Number, default: 3 },
        max: { type: Number, default: 7 },
      },
    },

    // Payment Gateway Configuration
    paymentGateways: {
      cod: {
        enabled: {
          type: Boolean,
          default: true,
        },
        minOrderAmount: {
          type: Number,
          default: 0,
        },
        maxOrderAmount: {
          type: Number,
          default: 50000,
        },
      },
      razorpay: {
        enabled: {
          type: Boolean,
          default: false,
        },
        keyId: String,
        keySecret: String,
      },
      stripe: {
        enabled: {
          type: Boolean,
          default: false,
        },
        publishableKey: String,
        secretKey: String,
      },
    },

    // Email Configuration
    email: {
      enabled: {
        type: Boolean,
        default: false,
      },
      provider: {
        type: String,
        enum: ['smtp', 'sendgrid', 'mailgun'],
        default: 'smtp',
      },
      smtp: {
        host: String,
        port: Number,
        secure: Boolean,
        user: String,
        password: String,
      },
      sendgrid: {
        apiKey: String,
      },
      mailgun: {
        apiKey: String,
        domain: String,
      },
      fromEmail: String,
      fromName: String,
    },

    // Order Settings
    order: {
      orderPrefix: {
        type: String,
        default: 'VKJ',
      },
      minOrderAmount: {
        type: Number,
        default: 500,
      },
      autoConfirmOrders: {
        type: Boolean,
        default: false,
      },
      allowCancellation: {
        type: Boolean,
        default: true,
      },
      cancellationPeriodHours: {
        type: Number,
        default: 24,
      },
    },

    // Inventory Settings
    inventory: {
      lowStockThreshold: {
        type: Number,
        default: 10,
      },
      allowBackorders: {
        type: Boolean,
        default: false,
      },
      autoReduceStock: {
        type: Boolean,
        default: true,
      },
    },

    // Social Media Links
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String,
      pinterest: String,
    },

    // SEO Settings
    seo: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: [String],
      googleAnalyticsId: String,
      facebookPixelId: String,
    },

    // Maintenance Mode
    maintenance: {
      enabled: {
        type: Boolean,
        default: false,
      },
      message: {
        type: String,
        default: 'We are currently under maintenance. Please check back soon.',
      },
    },

    // Brand Story Content
    brandStory: {
      image: {
        type: String,
        default: '/images/brand-story.png',
      },
      heading: {
        type: String,
        default: 'Crafting Timeless Elegance',
      },
      paragraph1: {
        type: String,
        default: 'For over three decades, Vasukriti has been synonymous with exceptional craftsmanship and timeless design. Each piece tells a story of heritage, artistry, and unwavering commitment to quality.',
      },
      paragraph2: {
        type: String,
        default: 'Our master artisans blend traditional Indian jewelry-making techniques with contemporary aesthetics, creating pieces that transcend generations.',
      },
      features: [{
        icon: {
          type: String,
          default: 'Gem',
        },
        title: String,
        description: String,
      }],
      ctaText: {
        type: String,
        default: 'Discover Our Story',
      },
      ctaLink: {
        type: String,
        default: '/about',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

settingsSchema.statics.updateSettings = async function (updates) {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create(updates);
  } else {
    Object.assign(settings, updates);
    await settings.save();
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
