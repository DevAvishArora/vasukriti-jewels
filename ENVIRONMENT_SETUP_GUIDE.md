# 3-Environment Deployment Setup Guide

## Overview
We're setting up 3 separate environments for development, staging, and production.

### Environments
- **Production**: Main branch → vasukriti.store
- **Staging**: Staging branch → staging.vasukriti.store  
- **Development**: Development branch → dev.vasukriti.store

---

## Step 1: MongoDB Atlas Setup (FREE)

### Create 3 Separate Clusters

1. **Login** to [MongoDB Atlas](https://cloud.mongodb.com/)

2. **Create Production Cluster**:
   - Click "Create" → "Shared" (M0 Free)
   - Cluster Name: `vasukriti-production`
   - Region: `Mumbai (ap-south-1)` or closest to your users
   - Create Cluster

3. **Create Staging Cluster**:
   - Click "Create" → "Shared" (M0 Free)
   - Cluster Name: `vasukriti-staging`
   - Region: Same as production
   - Create Cluster

4. **Create Development Cluster**:
   - Click "Create" → "Shared" (M0 Free)
   - Cluster Name: `vasukriti-development`
   - Region: Same as production
   - Create Cluster

### Configure Each Cluster

For **each cluster**, do the following:

1. **Create Database User**:
   - Go to "Database Access"
   - Add Database User
   - Username: `vasukriti_user`
   - Password: Generate secure password
   - Built-in Role: "Read and write to any database"
   - Save password securely

2. **Configure Network Access**:
   - Go to "Network Access"
   - Add IP Address
   - Allow Access from Anywhere: `0.0.0.0/0` (for Render/Vercel)
   - Add Entry

3. **Get Connection String**:
   - Go to cluster → "Connect" → "Connect your application"
   - Driver: Node.js
   - Copy connection string
   - Format: `mongodb+srv://vasukriti_user:<password>@cluster-name.xxxxx.mongodb.net/vasukriti?retryWrites=true&w=majority`
   - Replace `<password>` with actual password

**Save all 3 connection strings securely!**

---

## Step 2: Render Backend Setup (FREE)

### Create 3 Backend Services

1. **Login** to [Render.com](https://render.com/)

2. **Create Production Service**:
   - New → Web Service
   - Connect your GitHub repo
   - Name: `vasukriti-backend-prod`
   - Region: `Singapore` (closest free region)
   - Branch: `main`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free
   - Create Web Service

3. **Create Staging Service**:
   - Repeat above with:
   - Name: `vasukriti-backend-staging`
   - Branch: `staging`

4. **Create Development Service**:
   - Repeat above with:
   - Name: `vasukriti-backend-dev`
   - Branch: `development`

### Configure Environment Variables

For **Production Service**:
```
NODE_ENV=production
PORT=5001
MONGODB_URI=<your-prod-mongodb-uri>
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
FRONTEND_URL=https://vasukriti.store
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
RAZORPAY_KEY_ID=<live-razorpay-key>
RAZORPAY_KEY_SECRET=<live-razorpay-secret>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-email>
EMAIL_PASS=<your-app-password>
EMAIL_FROM=<your-email>
```

For **Staging Service**:
```
NODE_ENV=staging
PORT=5001
MONGODB_URI=<your-staging-mongodb-uri>
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
FRONTEND_URL=https://staging.vasukriti.store
CLOUDINARY_CLOUD_NAME=<same-as-prod>
CLOUDINARY_API_KEY=<same-as-prod>
CLOUDINARY_API_SECRET=<same-as-prod>
RAZORPAY_KEY_ID=<test-razorpay-key>
RAZORPAY_KEY_SECRET=<test-razorpay-secret>
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=<get-from-ethereal.email>
EMAIL_PASS=<get-from-ethereal.email>
EMAIL_FROM=noreply@vasukriti.store
```

For **Development Service**:
```
NODE_ENV=development
PORT=5001
MONGODB_URI=<your-dev-mongodb-uri>
JWT_SECRET=dev-secret-change-me
JWT_REFRESH_SECRET=dev-refresh-secret
FRONTEND_URL=https://dev.vasukriti.store
CLOUDINARY_CLOUD_NAME=<same-as-prod>
CLOUDINARY_API_KEY=<same-as-prod>
CLOUDINARY_API_SECRET=<same-as-prod>
RAZORPAY_KEY_ID=<test-razorpay-key>
RAZORPAY_KEY_SECRET=<test-razorpay-secret>
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=<get-from-ethereal.email>
EMAIL_PASS=<get-from-ethereal.email>
EMAIL_FROM=noreply@vasukriti.store
```

**Note**: Get test Ethereal email credentials from [Ethereal Email](https://ethereal.email/)

---

## Step 3: Vercel Frontend Setup (FREE)

### Option A: Single Project with Branch Deployments (Recommended)

1. **Login** to [Vercel](https://vercel.com/)

2. **Go to your existing project** → Settings

3. **Configure Git**:
   - Production Branch: `main`
   - Enable "Automatically expose System Environment Variables"

4. **Environment Variables**:
   - Go to Settings → Environment Variables
   
   Add for **Production** (main branch):
   ```
   NEXT_PUBLIC_API_URL=https://vasukriti-backend-prod.onrender.com/api
   NEXT_PUBLIC_RAZORPAY_KEY_ID=<live-razorpay-key>
   ```
   
   Add for **Preview** (staging + development branches):
   ```
   NEXT_PUBLIC_API_URL=https://vasukriti-backend-staging.onrender.com/api
   NEXT_PUBLIC_RAZORPAY_KEY_ID=<test-razorpay-key>
   ```

5. **Configure Domains**:
   - Production: `vasukriti.store` → main branch (already configured)
   - Go to Settings → Domains
   - Add Domain: `staging.vasukriti.store`
   - Git Branch: `staging`
   - Add Domain: `dev.vasukriti.store`
   - Git Branch: `development`

### Option B: Three Separate Projects

If you prefer complete separation:
1. Create 3 separate Vercel projects
2. Connect each to the same repo but different branches
3. Configure environment variables for each

---

## Step 4: Domain DNS Configuration

### Namecheap Setup

1. **Login** to [Namecheap](https://www.namecheap.com/)

2. **Go to Domain List** → vasukriti.store → Advanced DNS

3. **Add CNAME Records**:
   ```
   Type    Host      Value                       TTL
   CNAME   staging   cname.vercel-dns.com.      Automatic
   CNAME   dev       cname.vercel-dns.com.      Automatic
   ```

4. **Wait for DNS Propagation** (5-60 minutes usually)

5. **Verify in Vercel**:
   - Vercel will show "Valid Configuration" when DNS is propagated

---

## Step 5: Git Workflow

### Development Flow

```bash
# 1. Work on development branch
git checkout development
git pull origin development

# Make changes...
git add .
git commit -m "feat: new feature"
git push origin development

# 2. Test on dev.vasukriti.store

# 3. Merge to staging for QA
git checkout staging
git merge development
git push origin staging

# 4. Test on staging.vasukriti.store

# 5. Merge to main for production
git checkout main
git merge staging
git push origin main

# 6. Goes live on vasukriti.store
```

### Hotfix Flow (Emergency Production Fix)

```bash
# 1. Create hotfix from main
git checkout main
git checkout -b hotfix/critical-bug

# Fix the bug...
git add .
git commit -m "fix: critical bug"

# 2. Merge to main
git checkout main
git merge hotfix/critical-bug
git push origin main

# 3. Backport to staging and development
git checkout staging
git merge hotfix/critical-bug
git push origin staging

git checkout development
git merge hotfix/critical-bug
git push origin development

# 4. Delete hotfix branch
git branch -d hotfix/critical-bug
```

---

## Step 6: Testing Checklist

### Development Environment (dev.vasukriti.store)
- [ ] Frontend loads successfully
- [ ] Backend API responds at /api/health
- [ ] Database connection works
- [ ] Admin panel accessible
- [ ] Test data seeds properly
- [ ] Ethereal email captures emails

### Staging Environment (staging.vasukriti.store)
- [ ] Frontend loads successfully
- [ ] Backend API responds
- [ ] Database separate from production
- [ ] Admin panel works
- [ ] Test payment with Razorpay test keys
- [ ] Email sending works (Ethereal)
- [ ] All features work end-to-end

### Production Environment (vasukriti.store)
- [ ] Frontend loads successfully
- [ ] Backend API responds
- [ ] Database connection secure
- [ ] Admin panel secured
- [ ] Live payment works
- [ ] Email sending works (Gmail)
- [ ] SSL certificates valid
- [ ] Performance optimized

---

## Cost Breakdown

| Service | Tier | Cost |
|---------|------|------|
| MongoDB Atlas (3 clusters) | M0 Free | ₹0 |
| Render (3 services) | Free | ₹0 |
| Vercel | Hobby (Free) | ₹0 |
| Domain (vasukriti.store) | Yearly | ₹67/month |
| **Total** | | **₹67/month** |

---

## URLs Summary

After complete setup:

| Environment | Frontend | Backend |
|-------------|----------|---------|
| **Production** | https://vasukriti.store | https://vasukriti-backend-prod.onrender.com |
| **Staging** | https://staging.vasukriti.store | https://vasukriti-backend-staging.onrender.com |
| **Development** | https://dev.vasukriti.store | https://vasukriti-backend-dev.onrender.com |

---

## Quick Reference Commands

```bash
# Switch between environments
git checkout development  # Dev work
git checkout staging      # QA testing
git checkout main         # Production

# Deploy to environment
git push origin development  # Auto-deploys to dev
git push origin staging      # Auto-deploys to staging
git push origin main         # Auto-deploys to production

# Check deployment status
# Go to Vercel dashboard or Render dashboard
```

---

## Seed Data for Each Environment

### Production
- Real products
- Real categories
- No test data

### Staging
- Copy of production data for testing
- Test products
- Test admin accounts

### Development
- Minimal seed data
- Test products
- Test admin: admin@test.com / Admin@123

Run seed script:
```bash
# Update MongoDB URI in backend/.env
cd backend
node seed.js
```

---

## Environment Variable Files

Keep these files locally (never commit):

**backend/.env.development**
```
NODE_ENV=development
MONGODB_URI=<dev-mongodb-uri>
PORT=5001
# ... rest of dev vars
```

**backend/.env.staging**
```
NODE_ENV=staging
MONGODB_URI=<staging-mongodb-uri>
# ... rest of staging vars
```

**backend/.env.production**
```
NODE_ENV=production
MONGODB_URI=<prod-mongodb-uri>
# ... rest of prod vars
```

---

## Security Best Practices

1. **Never commit .env files** - Already in .gitignore
2. **Different JWT secrets** for each environment
3. **Test keys** for Razorpay in dev/staging
4. **Separate databases** - No mixing of environments
5. **Strong passwords** - Use password generator
6. **Regular backups** - Enable MongoDB backup for production
7. **Monitor logs** - Check Render logs regularly

---

## Next Steps After Setup

1. ✅ Verify all 3 environments are accessible
2. ✅ Test the complete git workflow
3. ✅ Seed data in each environment
4. ✅ Create test admin accounts
5. ✅ Document environment-specific credentials securely
6. ✅ Set up monitoring/alerts (optional)
7. ✅ Train team on git workflow

---

## Troubleshooting

### "Failed to connect to MongoDB"
- Check MongoDB URI is correct
- Verify IP whitelist (0.0.0.0/0)
- Confirm database user password

### "Vercel domain not working"
- Wait for DNS propagation (up to 48 hours)
- Check CNAME records in Namecheap
- Verify domain in Vercel settings

### "Render service crashes"
- Check environment variables
- View logs in Render dashboard
- Verify build/start commands

### "Branch not deploying"
- Ensure branch exists in GitHub
- Check Vercel/Render git branch settings
- Try manual redeploy

---

## Support Resources

- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Namecheap DNS: https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain/

---

**Setup Time Estimate**: 2-3 hours for complete configuration
