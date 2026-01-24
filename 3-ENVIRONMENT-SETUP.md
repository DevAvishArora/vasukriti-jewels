# 3-Environment Deployment Setup
## Quick Implementation Guide

**Created:** 25 January 2026  
**Status:** ✅ Branches Created

---

## ✅ Step 1: Git Branches (COMPLETED)

```bash
✅ development → Auto-deploy to dev.vasukriti.store
✅ staging → Auto-deploy to staging.vasukriti.store  
✅ main → Auto-deploy to vasukriti.store (production)
```

---

## 📋 Step 2: MongoDB Atlas Setup

### Create 3 Separate Clusters:

**1. Production Cluster:**
```
Cluster Name: vasukriti-production
Region: Mumbai (ap-south-1)
Tier: M0 (Free - 512MB)
Database: vasukriti_prod
User: prod_user
```

**2. Staging Cluster:**
```
Cluster Name: vasukriti-staging
Region: Mumbai (ap-south-1)
Tier: M0 (Free - 512MB)
Database: vasukriti_staging
User: staging_user
```

**3. Development Cluster:**
```
Cluster Name: vasukriti-development
Region: Mumbai (ap-south-1)
Tier: M0 (Free - 512MB)
Database: vasukriti_dev
User: dev_user
```

**Setup Steps:**
1. Go to https://cloud.mongodb.com/
2. Click "Build a Cluster" 3 times
3. Select M0 Free tier for each
4. Create database users for each cluster
5. Network Access: Add 0.0.0.0/0 (allow all)
6. Copy connection strings

---

## 🚀 Step 3: Render Backend Deployment

### Create 3 Backend Services:

**1. Production Backend:**
```
Name: vasukriti-backend-prod
Branch: main
Environment: production
URL: https://vasukriti-backend-prod.onrender.com
```

**2. Staging Backend:**
```
Name: vasukriti-backend-staging
Branch: staging
Environment: staging
URL: https://vasukriti-backend-staging.onrender.com
```

**3. Development Backend:**
```
Name: vasukriti-backend-dev
Branch: development
Environment: development
URL: https://vasukriti-backend-dev.onrender.com
```

**Setup Steps:**
1. Go to https://dashboard.render.com/
2. New → Web Service (3 times)
3. Connect GitHub repo
4. Configure each service with:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Select appropriate branch
5. Add environment variables (see below)

---

## 🌐 Step 4: Vercel Frontend Deployment

### Update Vercel Project Settings:

**Current Setup:**
- Project: vasukriti
- Branch: deployment-v1 → Production

**New Setup:**

**1. Production:**
```
Branch: main
Domain: vasukriti.store
URL: https://vasukriti.store
```

**2. Staging:**
```
Branch: staging
Domain: staging.vasukriti.store
URL: https://staging.vasukriti.store
```

**3. Development:**
```
Branch: development
Domain: dev.vasukriti.store
URL: https://dev.vasukriti.store
```

**Setup Steps:**
1. Go to https://vercel.com/dashboard
2. Project Settings → Git
3. Set Production Branch: `main`
4. Enable automatic deployments for all branches
5. Settings → Domains → Add custom domains

---

## 🔐 Step 5: Environment Variables

### Production (main branch):
```env
# Backend (Render)
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://prod_user:***@vasukriti-production.mongodb.net/vasukriti_prod
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
FRONTEND_URL=https://vasukriti.store
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=***
CLOUDINARY_API_SECRET=***
RAZORPAY_KEY_ID=rzp_live_***
RAZORPAY_KEY_SECRET=***
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=***
EMAIL_PASS=***

# Frontend (Vercel)
NEXT_PUBLIC_API_URL=https://vasukriti-backend-prod.onrender.com/api
NEXT_PUBLIC_APP_URL=https://vasukriti.store
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_***
```

### Staging (staging branch):
```env
# Backend (Render)
NODE_ENV=staging
PORT=5001
MONGODB_URI=mongodb+srv://staging_user:***@vasukriti-staging.mongodb.net/vasukriti_staging
JWT_SECRET=<staging-secret>
JWT_REFRESH_SECRET=<staging-secret>
FRONTEND_URL=https://staging.vasukriti.store
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=***
CLOUDINARY_API_SECRET=***
RAZORPAY_KEY_ID=rzp_test_***
RAZORPAY_KEY_SECRET=***
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587

# Frontend (Vercel)
NEXT_PUBLIC_API_URL=https://vasukriti-backend-staging.onrender.com/api
NEXT_PUBLIC_APP_URL=https://staging.vasukriti.store
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_***
```

### Development (development branch):
```env
# Backend (Render)
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb+srv://dev_user:***@vasukriti-development.mongodb.net/vasukriti_dev
JWT_SECRET=dev-secret-123
JWT_REFRESH_SECRET=dev-refresh-secret-123
FRONTEND_URL=https://dev.vasukriti.store
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=***
CLOUDINARY_API_SECRET=***
RAZORPAY_KEY_ID=rzp_test_***
RAZORPAY_KEY_SECRET=***
EMAIL_HOST=smtp.ethereal.email

# Frontend (Vercel)
NEXT_PUBLIC_API_URL=https://vasukriti-backend-dev.onrender.com/api
NEXT_PUBLIC_APP_URL=https://dev.vasukriti.store
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_***
```

---

## 🔄 Step 6: Git Workflow

### Development Flow:
```bash
# 1. Work on features in development branch
git checkout development
git pull origin development
# Make changes
git add .
git commit -m "feat: new feature"
git push origin development
# Auto-deploys to dev.vasukriti.store

# 2. Merge to staging for testing
git checkout staging
git merge development
git push origin staging
# Auto-deploys to staging.vasukriti.store

# 3. Merge to main for production
git checkout main
git merge staging
git push origin main
# Auto-deploys to vasukriti.store
```

### Hotfix Flow:
```bash
# For urgent production fixes
git checkout main
git checkout -b hotfix/issue-name
# Fix the issue
git add .
git commit -m "fix: critical issue"
git checkout main
git merge hotfix/issue-name
git push origin main
# Also merge back to staging and development
git checkout staging
git merge main
git push origin staging
git checkout development
git merge staging
git push origin development
```

---

## 📊 Step 7: Domain Configuration

### Namecheap DNS Settings:

**Add these records:**
```
Type: A
Host: @
Value: 76.76.21.21 (Vercel IP)

Type: CNAME
Host: staging
Value: cname.vercel-dns.com

Type: CNAME
Host: dev
Value: cname.vercel-dns.com

Type: CNAME
Host: www
Value: cname.vercel-dns.com
```

**In Vercel Project Settings:**
1. Domains → Add Domain
2. Add: vasukriti.store (production)
3. Add: staging.vasukriti.store (staging)
4. Add: dev.vasukriti.store (development)
5. Add: www.vasukriti.store → Redirect to vasukriti.store

---

## ✅ Step 8: Testing Checklist

### Development Environment:
- [ ] URL accessible: dev.vasukriti.store
- [ ] Backend connects to dev database
- [ ] Test Razorpay working (test mode)
- [ ] Ethereal email working
- [ ] Image uploads to Cloudinary

### Staging Environment:
- [ ] URL accessible: staging.vasukriti.store
- [ ] Backend connects to staging database
- [ ] Test Razorpay working (test mode)
- [ ] Can place test orders
- [ ] Admin panel working
- [ ] Seed data loaded

### Production Environment:
- [ ] URL accessible: vasukriti.store
- [ ] Backend connects to prod database
- [ ] Live Razorpay working
- [ ] Real emails sending
- [ ] SSL certificate active
- [ ] All pages loading
- [ ] Performance optimized

---

## 🎯 Quick Commands Reference

### Check Current Branch:
```bash
git branch
```

### Switch Environments:
```bash
# Development
git checkout development

# Staging
git checkout staging

# Production
git checkout main
```

### Deploy Specific Environment:
```bash
# Push to trigger auto-deploy
git push origin development  # Dev
git push origin staging      # Staging
git push origin main         # Prod
```

### View Deployment Status:
```bash
# Render: https://dashboard.render.com/
# Vercel: https://vercel.com/dashboard
```

---

## 💰 Cost Summary

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| MongoDB Atlas (3 x M0) | Free | ₹0 |
| Render (3 x Free) | Free | ₹0 |
| Vercel (1 project, 3 branches) | Hobby | ₹0 |
| Domain (vasukriti.store) | Yearly | ₹67/mo |
| **Total** | | **₹67/month** |

**Note:** Free tier limits:
- Render: Services sleep after 15min inactivity
- MongoDB: 512MB storage per cluster
- Vercel: 100GB bandwidth/month

---

## 🚨 Important Notes

1. **Database Migrations:** Always test in dev → staging before prod
2. **Environment Variables:** Never commit .env files
3. **API Keys:** Use test keys for dev/staging, live for prod
4. **Backups:** Set up MongoDB Atlas automated backups
5. **Monitoring:** Enable Render/Vercel monitoring

---

## 📞 Need Help?

**Check Logs:**
- Render: Dashboard → Service → Logs
- Vercel: Dashboard → Project → Deployments → View Logs
- MongoDB: Atlas → Database → Monitoring

**Common Issues:**
1. Cold starts on Render (15-30s) - Upgrade to paid tier
2. Domain propagation (24-48hrs) - Be patient
3. CORS errors - Check FRONTEND_URL in backend env

---

**Ready to implement? Let's start with MongoDB setup!**
