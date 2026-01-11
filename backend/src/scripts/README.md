# Database Seeding Guide

This directory contains scripts to seed your database with initial data.

## 📁 Available Scripts

### 1. `seed-ui-content.js` - Production Safe ✅
**For: Production Environment**

Seeds only UI/content elements needed for the site to function properly:
- ✅ Hero Section (banner/carousel)
- ✅ Promotional Bar (top banner messages)
- ✅ Categories (empty categories for product organization)
- ✅ Settings (site configuration)
- ❌ NO PRODUCTS (add manually via admin panel)

**Usage:**
```bash
cd backend
npm run seed:ui
```

**When to use:**
- First time deploying to production
- After clearing production database
- When you need to reset UI elements only

---

### 2. `seed-test-data.js` - Development/Staging Only 🧪
**For: Development & Staging Environments**

Seeds complete test data including:
- ✅ Hero Section
- ✅ Promotional Bar
- ✅ Categories (6 categories)
- ✅ Products (30+ sample jewelry items)
- ✅ Test Users (admin, verified customer, unverified customer)
- ✅ Settings

**⚠️ Safety:** Script will refuse to run if `NODE_ENV=production`

**Usage:**
```bash
# Development
cd backend
npm run seed:dev

# Staging (if connected to staging database)
npm run seed:staging

# Or manually
NODE_ENV=development node src/scripts/seed-test-data.js
```

**Test Credentials:**
| Role | Email | Password | Status |
|------|-------|----------|--------|
| Admin | admin@vasukritijewels.com | Admin@123 | Verified |
| Customer | customer@test.com | Test@123 | Verified |
| Customer | unverified@test.com | Test@123 | Unverified |

---

## 🚀 Quick Start

### For Local Development
```bash
# 1. Make sure your .env has development MongoDB URI
cd backend

# 2. Run test data seed
npm run seed:dev

# 3. Start backend
npm run dev

# 4. Start frontend (in another terminal)
cd ../frontend
npm run dev

# 5. Login with test credentials
# Visit: http://localhost:3000
```

### For Production Deployment
```bash
# 1. Connect to production database in .env
cd backend

# 2. Seed UI content only
npm run seed:ui

# 3. Manually add real products through admin panel
# DO NOT run seed:test in production!

# 4. Deploy to Render/your hosting
```

---

## 📦 What Gets Seeded

### UI Content (Production Safe)
```javascript
{
  heroSection: 1,        // Main banner
  promotionalBar: 1,     // Top announcement bar
  categories: 6,         // Ring, Necklace, Earring, etc.
  settings: 1,           // Site configuration
  products: 0            // ❌ None - add manually
}
```

### Test Data (Dev/Staging Only)
```javascript
{
  heroSection: 1,
  promotionalBar: 1,
  categories: 6,
  products: 30+,         // ✅ Sample jewelry items
  users: 3,              // ✅ Test accounts
  settings: 1
}
```

---

## 🔄 Re-seeding Database

**Warning:** Seeding will **delete all existing data** in these collections:
- HeroSection
- PromotionalBar
- Category
- Product (only in test seed)
- User (only in test seed)
- Settings

**To re-seed:**
```bash
# Development - safe to run anytime
npm run seed:dev

# Production - be careful!
npm run seed:ui
```

---

## 🎨 Customizing Seed Data

### Update Hero Section
Edit `seed-ui-content.js` or `seed-test-data.js`:
```javascript
heroSection: {
  title: 'Your Custom Title',
  subtitle: 'Your Subtitle',
  images: [
    {
      url: 'https://your-image-url.com/banner.jpg',
      publicId: 'your-cloudinary-public-id',
      alt: 'Banner description',
    },
  ],
  // ... more options
}
```

### Update Promotional Bar
```javascript
promotionalBar: {
  messages: [
    {
      text: '🎉 Your Custom Message',
      link: '/your-page',
      icon: '🎉',
    },
  ],
  design: {
    backgroundColor: '#your-color',
    textColor: '#ffffff',
  },
}
```

### Add More Categories
```javascript
categories: [
  {
    name: 'Your Category',
    slug: 'your-category',
    description: 'Description',
    image: {
      url: 'https://image-url.com',
      publicId: 'cloudinary-id',
    },
    displayOrder: 7,
    isActive: true,
  },
]
```

### Change Product Generation
In `seed-test-data.js`, modify the `generateProducts()` function to:
- Add more product variations
- Change price ranges
- Modify product specifications
- Add different tags/categories

---

## 🔍 Troubleshooting

### "Cannot run test data seed in PRODUCTION environment"
✅ **Good!** This is a safety feature. Use `seed:ui` instead for production.

### "MongoDB connection error"
Check your `.env` file:
```bash
# Should have valid MongoDB URI
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

### "Module not found" errors
Install dependencies:
```bash
cd backend
npm install
```

### Images not showing
1. Replace placeholder Unsplash URLs with your Cloudinary URLs
2. Update `publicId` to match your Cloudinary structure
3. Or upload images through admin panel after seeding

### Products not appearing
- If using `seed:ui`: Products are not seeded - add manually
- If using `seed:test`: Check that categories were created first

---

## 📝 Environment Variables Required

Make sure these are set in your `.env`:

```bash
# Required
MONGODB_URI=mongodb+srv://...
NODE_ENV=development  # or staging, or production

# For product images (optional in seed, required for upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 🎯 Best Practices

### Development
- ✅ Use `seed:dev` to quickly set up test data
- ✅ Re-seed frequently when testing data changes
- ✅ Use test accounts to verify features

### Staging
- ✅ Use `seed:staging` to match production-like data
- ✅ Test with realistic product counts
- ✅ Verify email verification flow

### Production
- ✅ Use `seed:ui` only once during initial deployment
- ❌ Never use `seed:test` in production
- ✅ Add products manually or via admin panel
- ✅ Back up database before any manual seeding

---

## 📚 Related Documentation

- [COMPLETE_DEPLOYMENT_GUIDE.md](../../COMPLETE_DEPLOYMENT_GUIDE.md) - Full deployment process
- [DEPLOYMENT_STRATEGY.md](../../DEPLOYMENT_STRATEGY.md) - Infrastructure setup
- [Backend README](../README.md) - Backend documentation

---

## 💡 Tips

**Speed up development:**
```bash
# Create an alias in your shell profile (~/.zshrc or ~/.bashrc)
alias seed-dev='cd ~/path/to/backend && npm run seed:dev'
```

**Database backup before seeding:**
```bash
# MongoDB Atlas: Use built-in backup (automatic on free tier)
# Local MongoDB: Use mongodump
mongodump --uri="your-mongodb-uri" --out=./backup
```

**Clear specific collection without re-seeding:**
```javascript
// Create clear-products.js script
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Product.deleteMany({});
  console.log('Products cleared');
  process.exit(0);
});
```

---

Need help? Check the [TROUBLESHOOTING section](../../COMPLETE_DEPLOYMENT_GUIDE.md#troubleshooting) in the deployment guide!
