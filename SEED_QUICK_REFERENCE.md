# 🌱 Quick Seed Reference Card

## One Command Setup

### Production
```bash
npm run seed:ui
# ✅ Hero, Promo Bar, Categories, Settings
# ❌ NO products - add manually
```

### Staging
```bash
npm run seed:staging
# ✅ Complete test data
# ✅ 30+ products + test users
```

### Development
```bash
npm run seed:dev
# ✅ Complete test data
# ✅ 30+ products + test users
```

---

## Test Credentials

| Email | Password | Role | Verified |
|-------|----------|------|----------|
| admin@vasukritijewels.com | Admin@123 | Admin | ✅ |
| customer@test.com | Test@123 | Customer | ✅ |
| unverified@test.com | Test@123 | Customer | ❌ |

---

## What Gets Seeded

### Production (UI Only)
```
✅ 1 Hero Section
✅ 1 Promotional Bar  
✅ 6 Categories
✅ 1 Settings
❌ 0 Products
❌ 0 Users
```

### Staging/Dev (Full Test Data)
```
✅ 1 Hero Section
✅ 1 Promotional Bar
✅ 6 Categories
✅ 30+ Products
✅ 3 Test Users
✅ 1 Settings
```

---

## Categories Created
1. 💍 Rings
2. 📿 Necklaces
3. 👂 Earrings
4. 🔗 Bracelets
5. ⭕ Bangles
6. 💎 Pendants

---

## Safety Checks
- ✅ Test seed refuses to run in `NODE_ENV=production`
- ✅ All seeds clear existing data before inserting
- ✅ Production seed preserves manually added products
- ⚠️ Always backup before re-seeding production

---

## Common Tasks

### First Time Setup
```bash
# 1. Development
cd backend
npm run seed:dev
npm run dev

# 2. Frontend (new terminal)
cd frontend
npm run dev

# 3. Visit http://localhost:3000
# 4. Login with customer@test.com / Test@123
```

### Reset Dev Database
```bash
npm run seed:dev
# Clears everything and re-seeds
```

### Update Placeholder Images
```javascript
// Edit: backend/src/scripts/seed-ui-content.js
images: [{
  url: 'https://res.cloudinary.com/YOUR_CLOUD/hero.jpg',
  publicId: 'vasukriti/hero/main-banner',
}]
```

### Manual Product Addition (Production)
```bash
# After seed:ui
# 1. Visit admin panel
# 2. Products → Add New
# 3. Upload real images
# 4. Set prices, descriptions
# 5. Publish
```

---

## Quick Verify

### Check Seeded Data
```bash
# Categories
curl http://localhost:5000/api/categories

# Products (dev/staging only)
curl http://localhost:5000/api/products

# Settings
curl http://localhost:5000/api/settings
```

### MongoDB Compass
```bash
# 1. Download: https://www.mongodb.com/products/compass
# 2. Connect with your MongoDB URI
# 3. Browse collections visually
```

---

## Troubleshooting Quick Fixes

### Connection Error
```bash
# Check .env
cat backend/.env | grep MONGODB_URI
# Should have valid mongodb+srv:// URI
```

### Images Not Loading
```bash
# Option 1: Update seed script with Cloudinary URLs
# Option 2: Upload through admin panel after seeding
```

### Can't Login
```bash
# Re-seed to create test users
npm run seed:dev
```

### Seed Fails in Production
```bash
# ✅ Good! Use seed:ui instead
npm run seed:ui
```

---

📚 **Full Documentation:** [backend/src/scripts/README.md](backend/src/scripts/README.md)

🚀 **Deployment Guide:** [COMPLETE_DEPLOYMENT_GUIDE.md](COMPLETE_DEPLOYMENT_GUIDE.md)
