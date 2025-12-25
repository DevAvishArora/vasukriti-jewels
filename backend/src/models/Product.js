const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
  },
  alt: {
    type: String,
    default: '',
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
});

const specificationSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    shortDescription: {
      type: String,
      maxlength: 200,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide product category'],
    },
    subCategory: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: 0,
    },
    comparePrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    sku: {
      type: String,
      required: [true, 'Please provide SKU'],
      unique: true,
      uppercase: true,
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: 0,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
    images: [imageSchema],
    model3D: {
      url: String,
      format: String,
      size: Number,
    },
    specifications: [specificationSchema],
    materials: [String],
    weight: {
      type: Number,
      min: 0,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    tags: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
productSchema.index({ slug: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ isTrending: 1, isActive: 1 });
productSchema.index({ isNewArrival: 1, isActive: 1 });
productSchema.index({ sku: 1 });

// Virtual for final price (after discount)
productSchema.virtual('finalPrice').get(function () {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount) / 100;
  }
  return this.price;
});

// Virtual for in stock status
productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

// Virtual for low stock warning
productSchema.virtual('isLowStock').get(function () {
  return this.stock <= this.lowStockThreshold && this.stock > 0;
});

// Auto-generate slug from name
productSchema.pre('save', async function (next) {
  if (this.isModified('name') || !this.slug) {
    let baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    
    // Check for existing slug (excluding current document)
    while (true) {
      const existing = await this.constructor.findOne({ 
        slug: slug,
        _id: { $ne: this._id }
      });
      
      if (!existing) {
        break;
      }
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});

// Ensure only one primary image
productSchema.pre('save', function (next) {
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter((img) => img.isPrimary);
    if (primaryImages.length === 0) {
      // Set first image as primary if none selected
      this.images[0].isPrimary = true;
    } else if (primaryImages.length > 1) {
      // Keep only the first primary
      let foundFirst = false;
      this.images.forEach((img) => {
        if (img.isPrimary) {
          if (foundFirst) {
            img.isPrimary = false;
          }
          foundFirst = true;
        }
      });
    }
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
