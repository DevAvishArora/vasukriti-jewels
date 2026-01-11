# Complete 3-Environment Deployment Guide
## Vasukriti Jewels - Production, Staging & Development Setup

**Estimated Total Time:** 90-120 minutes  
**Cost:** ₹67/month (domain only, everything else FREE)  
**Last Updated:** 11 January 2026

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Overview](#environment-overview)
3. [Phase 1: MongoDB Atlas Setup (3 Clusters)](#phase-1-mongodb-atlas-setup)
4. [Phase 2: Backend Deployment (Render.com)](#phase-2-backend-deployment)
5. [Phase 3: Frontend Deployment (Vercel)](#phase-3-frontend-deployment)
6. [Phase 4: Environment Variables Configuration](#phase-4-environment-variables-configuration)
7. [Phase 5: Domain & DNS Setup](#phase-5-domain--dns-setup)
8. [Phase 6: Testing All Environments](#phase-6-testing-all-environments)
9. [Phase 7: Local Development Setup](#phase-7-local-development-setup)
10. [Phase 8: Database Seeding](#phase-8-database-seeding)
11. [Troubleshooting](#troubleshooting)
12. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

### Required Accounts (All FREE)
- [ ] **GitHub Account** - For code repository
- [ ] **MongoDB Atlas Account** - For databases
- [ ] **Render.com Account** - For backend hosting
- [ ] **Vercel Account** - For frontend hosting
- [ ] **Cloudinary Account** - For image storage
- [ ] **Razorpay Account** - For payments
- [ ] **Domain Name** (Optional for now) - From Namecheap/GoDaddy (~₹800/year)

### Required Software
- [ ] **Node.js** (v18 or higher) - `node --version`
- [ ] **npm** (v9 or higher) - `npm --version`
- [ ] **Git** - `git --version`
- [ ] **Code Editor** - VS Code recommended

### Required Knowledge
- Basic understanding of terminal/command line
- GitHub repository management
- Copy-paste skills 😊

---

## Environment Overview

| Environment | Purpose | URL Pattern | Database | Branch |
|------------|---------|-------------|----------|---------|
| **Production** | Live site for customers | `vasukritijewels.com` | MongoDB Prod | `main` |
| **Staging** | Pre-production testing | `staging-vasukriti.vercel.app` | MongoDB Staging | `staging` |
| **Development** | Local development | `localhost:3000` | MongoDB Dev | `development` |

**Data Flow:** Development → Staging → Production  
**Branch Strategy:** Feature branches → `development` → `staging` → `main`

---

## Phase 1: MongoDB Atlas Setup

**Duration:** 20 minutes  
**Goal:** Create 3 separate MongoDB clusters for complete isolation

### Step 1.1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/Email
3. Choose **"FREE Shared"** plan
4. Select your organization name (e.g., "Vasukriti Jewels")
5. Select purpose: **"Build a new app"**
6. Click **"Finish"**

### Step 1.2: Create Production Database Cluster

1. Click **"+ Create"** → **"Database"**
2. Select **"M0 FREE"** tier ⭐
3. Configure cluster:
   - **Provider:** AWS (recommended)
   - **Region:** Mumbai (ap-south-1) - Closest to India
   - **Cluster Name:** `vasukriti-production`
4. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 1.3: Create Database User for Production

1. Click **"Database Access"** in left sidebar
2. Click **"+ ADD NEW DATABASE USER"**
3. Configure user:
   - **Authentication Method:** Password
   - **Username:** `vasukriti_prod_user`
   - **Password:** Click **"Autogenerate Secure Password"** (SAVE THIS!)
   - **Database User Privileges:** Read and write to any database
4. Click **"Add User"**

**🔒 SAVE CREDENTIALS:**
```
Production DB Username: vasukriti_prod_user
Production DB Password: [your-generated-password]
```

### Step 1.4: Configure Network Access for Production

1. Click **"Network Access"** in left sidebar
2. Click **"+ ADD IP ADDRESS"**
3. Click **"ALLOW ACCESS FROM ANYWHERE"** (IP: 0.0.0.0/0)
   - This is safe because you have username/password protection
   - Required for Render.com to connect
4. Click **"Confirm"**

### Step 1.5: Get Production Connection String

1. Go back to **"Database"** section
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Select: Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://vasukriti_prod_user:<password>@vasukriti-production.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

**🔒 SAVE THIS - Replace `<password>` with your actual password:**
```
Production MongoDB URI: mongodb+srv://vasukriti_prod_user:YOUR_PASSWORD@vasukriti-production.xxxxx.mongodb.net/vasukriti_jewels?retryWrites=true&w=majority
```

**⚠️ IMPORTANT:** Add the database name `/vasukriti_jewels` before the `?` in the URI

### Step 1.6: Repeat for Staging Cluster

Follow Steps 1.2 - 1.5 with these changes:
- **Cluster Name:** `vasukriti-staging`
- **Database Username:** `vasukriti_staging_user`
- **Password:** Generate new password (SAVE THIS!)

**🔒 SAVE THIS:**
```
Staging MongoDB URI: mongodb+srv://vasukriti_staging_user:YOUR_PASSWORD@vasukriti-staging.xxxxx.mongodb.net/vasukriti_jewels?retryWrites=true&w=majority
```

### Step 1.7: Repeat for Development Cluster

Follow Steps 1.2 - 1.5 with these changes:
- **Cluster Name:** `vasukriti-development`
- **Database Username:** `vasukriti_dev_user`
- **Password:** Generate new password (SAVE THIS!)

**🔒 SAVE THIS:**
```
Development MongoDB URI: mongodb+srv://vasukriti_dev_user:YOUR_PASSWORD@vasukriti-development.xxxxx.mongodb.net/vasukriti_jewels?retryWrites=true&w=majority
```

### Step 1.8: Verify All Clusters

You should now see 3 clusters in your MongoDB Atlas dashboard:
- ✅ vasukriti-production (M0 FREE)
- ✅ vasukriti-staging (M0 FREE)
- ✅ vasukriti-development (M0 FREE)

**✅ Phase 1 Complete!** You now have 3 isolated databases.

---

## Phase 2: Backend Deployment

**Duration:** 25 minutes  
**Goal:** Deploy Node.js backend to Render.com for production and staging

### Step 2.1: Prepare Your Code

1. Open terminal in your project root:
   ```bash
   cd /Users/avish/Projects/Practice/vasukriti-jewels
   ```

2. Ensure you have all branches:
   ```bash
   git branch -a
   ```

3. Create `staging` and `development` branches if they don't exist:
   ```bash
   # Create and push staging branch
   git checkout -b staging
   git push -u origin staging

   # Create and push development branch
   git checkout -b development
   git push -u origin development

   # Go back to main
   git checkout main
   ```

4. Commit and push all changes:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2.2: Create Render.com Account

1. Go to https://render.com/
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with **GitHub** (easiest - auto-connects your repos)
4. Authorize Render to access your GitHub account
5. Select **"All repositories"** or select `vasukriti-jewels` specifically

### Step 2.3: Deploy Production Backend

1. In Render Dashboard, click **"New +"** → **"Web Service"**

2. **Connect Repository:**
   - Search for `vasukriti-jewels`
   - Click **"Connect"**

3. **Configure Service:**
   ```
   Name: vasukriti-backend-prod
   Region: Singapore (closest to India)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Advanced Settings** (click "Advanced"):
   - **Auto-Deploy:** Yes (deploys on git push)
   - **Health Check Path:** `/api/health`

5. **Environment Variables** (Click "Add Environment Variable"):

   Add these one by one (click "+ Add Environment Variable" for each):

   ```bash
   # Server Configuration
   NODE_ENV = production
   PORT = 10000

   # Database
   MONGODB_URI = [Your Production MongoDB URI from Phase 1]

   # JWT Secrets (Generate strong random strings)
   JWT_SECRET = [Generate: openssl rand -base64 48]
   JWT_REFRESH_SECRET = [Generate: openssl rand -base64 48]

   # Cloudinary (from your Cloudinary dashboard)
   CLOUDINARY_CLOUD_NAME = your-cloud-name
   CLOUDINARY_API_KEY = your-api-key
   CLOUDINARY_API_SECRET = your-api-secret

   # Email Configuration (SendGrid - after you sign up)
   EMAIL_HOST = smtp.sendgrid.net
   EMAIL_PORT = 587
   EMAIL_USER = apikey
   EMAIL_PASS = [Your SendGrid API Key]
   EMAIL_FROM = noreply@vasukritijewels.com

   # Razorpay (Live keys - after KYC verification)
   RAZORPAY_KEY_ID = rzp_live_xxxxx
   RAZORPAY_KEY_SECRET = your-live-secret
   
   # Frontend URL (will update after Vercel deployment)
   FRONTEND_URL = https://vasukritijewels.com
   ```

   **⚠️ To generate JWT secrets, run in terminal:**
   ```bash
   openssl rand -base64 48
   # Copy output and paste as JWT_SECRET
   
   openssl rand -base64 48
   # Copy output and paste as JWT_REFRESH_SECRET
   ```

6. Click **"Create Web Service"**

7. **Wait for deployment** (3-5 minutes):
   - You'll see build logs
   - Status will change from "Building" → "Live"
   - Note your backend URL: `https://vasukriti-backend-prod.onrender.com`

8. **Test the backend:**
   ```bash
   # Test health endpoint
   curl https://vasukriti-backend-prod.onrender.com/api/health
   
   # Should return: {"status":"ok","timestamp":"...","environment":"production"}
   ```

**🔒 SAVE THIS:**
```
Production Backend URL: https://vasukriti-backend-prod.onrender.com
```

### Step 2.4: Deploy Staging Backend

1. In Render Dashboard, click **"New +"** → **"Web Service"**

2. **Connect Same Repository** (vasukriti-jewels)

3. **Configure Service:**
   ```
   Name: vasukriti-backend-staging
   Region: Singapore
   Branch: staging (IMPORTANT!)
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Environment Variables** (same as production with these changes):

   ```bash
   # Server Configuration
   NODE_ENV = staging
   PORT = 10000

   # Database (Use STAGING MongoDB URI)
   MONGODB_URI = [Your Staging MongoDB URI from Phase 1]

   # JWT Secrets (Can reuse same as production or generate new)
   JWT_SECRET = [Same or new]
   JWT_REFRESH_SECRET = [Same or new]

   # Cloudinary (Same account, different folder)
   CLOUDINARY_CLOUD_NAME = your-cloud-name
   CLOUDINARY_API_KEY = your-api-key
   CLOUDINARY_API_SECRET = your-api-secret

   # Email Configuration (Use Ethereal for testing)
   EMAIL_HOST = smtp.ethereal.email
   EMAIL_PORT = 587
   EMAIL_USER = [Your Ethereal user from .env]
   EMAIL_PASS = [Your Ethereal password from .env]
   EMAIL_FROM = noreply@staging.vasukritijewels.com

   # Razorpay (TEST keys)
   RAZORPAY_KEY_ID = rzp_test_xxxxx
   RAZORPAY_KEY_SECRET = your-test-secret
   
   # Frontend URL (will update after Vercel deployment)
   FRONTEND_URL = https://staging-vasukriti.vercel.app
   ```

5. Click **"Create Web Service"**

6. **Wait for deployment** and test:
   ```bash
   curl https://vasukriti-backend-staging.onrender.com/api/health
   ```

**🔒 SAVE THIS:**
```
Staging Backend URL: https://vasukriti-backend-staging.onrender.com
```

### Step 2.5: Configure Cloudinary Folders

Your code should upload to different folders per environment. 

In `/backend/src/config/cloudinary.js`, the upload function should use:
```javascript
// Production uploads to: production/products/
// Staging uploads to: staging/products/
// Development uploads to: development/products/

const folder = `${process.env.NODE_ENV}/products`;
```

This is already configured if you followed the setup correctly.

**✅ Phase 2 Complete!** Backend is deployed for production and staging.

---

## Phase 3: Frontend Deployment

**Duration:** 20 minutes  
**Goal:** Deploy Next.js frontend to Vercel for production and staging

### Step 3.1: Create Vercel Account

1. Go to https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. Select your account/organization

### Step 3.2: Deploy Production Frontend

1. Click **"Add New..."** → **"Project"**

2. **Import Git Repository:**
   - Find `vasukriti-jewels`
   - Click **"Import"**

3. **Configure Project:**
   ```
   Framework Preset: Next.js (auto-detected)
   Root Directory: frontend
   Build Command: npm run build (auto-detected)
   Output Directory: .next (auto-detected)
   Install Command: npm install (auto-detected)
   ```

4. **Environment Variables** (click "Environment Variables"):

   Add these (select "Production" environment):

   ```bash
   # Backend API URL (from Phase 2)
   NEXT_PUBLIC_API_URL = https://vasukriti-backend-prod.onrender.com

   # Razorpay (Live key - from Razorpay dashboard)
   NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_live_xxxxx

   # Google Analytics (optional - from Google Analytics dashboard)
   NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
   ```

5. Click **"Deploy"**

6. **Wait for deployment** (2-3 minutes):
   - You'll see build logs
   - Status: "Building" → "Ready"
   - Vercel assigns a URL: `https://vasukriti-jewels.vercel.app`

7. **Test the frontend:**
   - Visit: `https://vasukriti-jewels.vercel.app`
   - Should see your jewelry store!

**🔒 SAVE THIS:**
```
Production Frontend URL: https://vasukriti-jewels.vercel.app
```

### Step 3.3: Update Backend FRONTEND_URL

1. Go back to **Render.com** dashboard
2. Select **vasukriti-backend-prod** service
3. Go to **"Environment"** tab
4. Find `FRONTEND_URL` variable
5. Update to: `https://vasukriti-jewels.vercel.app`
6. Click **"Save Changes"** (backend will redeploy - takes 2 minutes)

### Step 3.4: Deploy Staging Frontend

1. In Vercel dashboard, go to your project: **vasukriti-jewels**

2. Click **"Settings"** → **"Git"**

3. **Add Production Branch:**
   - Production Branch: `main` (should already be set)

4. **Create Staging Deployment:**
   - Go to **"Deployments"** tab
   - Click **"..."** menu → **"Create Deployment"**
   - Or use Git branch method below (recommended)

**Better Method - Use Git Branches:**

1. In Vercel project settings → **"Git"**
2. Under **"Production Branch"**, note that `main` is set
3. Vercel automatically creates preview deployments for all other branches!

4. To get a stable staging URL:
   - Go to project **"Settings"** → **"Domains"**
   - Your staging deploys to: `vasukriti-jewels-[branch].vercel.app`
   - When you push to `staging` branch: `vasukriti-jewels-staging.vercel.app`

5. **Add Environment Variables for Staging:**
   - Go to **"Settings"** → **"Environment Variables"**
   - Click **"Add New"**
   - Select **"Preview"** environment (not Production)

   ```bash
   # Backend API URL (from Phase 2)
   NEXT_PUBLIC_API_URL = https://vasukriti-backend-staging.onrender.com

   # Razorpay (TEST key)
   NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_test_xxxxx

   # Google Analytics (separate property for staging)
   NEXT_PUBLIC_GA_ID = G-YYYYYYYYYY
   ```

6. **Deploy staging branch:**
   ```bash
   # In terminal
   cd /Users/avish/Projects/Practice/vasukriti-jewels
   git checkout staging
   git merge main
   git push origin staging
   ```

7. Vercel will auto-deploy! Check **"Deployments"** tab
   - Find the staging deployment
   - URL will be: `https://vasukriti-jewels-git-staging-[your-username].vercel.app`

**🔒 SAVE THIS:**
```
Staging Frontend URL: [Copy from Vercel deployment]
```

### Step 3.5: Update Staging Backend FRONTEND_URL

1. Go to **Render.com** dashboard
2. Select **vasukriti-backend-staging** service
3. Go to **"Environment"** tab
4. Find `FRONTEND_URL` variable
5. Update to your staging frontend URL
6. Click **"Save Changes"**

### Step 3.6: Set Up Custom Domain (Optional - Do This Later)

If you have a domain (e.g., `vasukritijewels.com`):

**For Production:**
1. In Vercel project → **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter: `vasukritijewels.com` and `www.vasukritijewels.com`
4. Follow DNS configuration instructions
5. Update Render backend `FRONTEND_URL` to `https://vasukritijewels.com`

**For Staging:**
1. Add subdomain: `staging.vasukritijewels.com`
2. Configure DNS
3. Update Render staging backend `FRONTEND_URL`

**✅ Phase 3 Complete!** Frontend deployed for production and staging.

---

## Phase 4: Environment Variables Configuration

**Duration:** 15 minutes  
**Goal:** Ensure all environment variables are correctly configured

### Step 4.1: Production Environment Variables Checklist

**Backend (Render) - vasukriti-backend-prod:**
- [ ] `NODE_ENV = production`
- [ ] `PORT = 10000`
- [ ] `MONGODB_URI` (production cluster)
- [ ] `JWT_SECRET` (strong random string)
- [ ] `JWT_REFRESH_SECRET` (strong random string)
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `EMAIL_HOST = smtp.sendgrid.net`
- [ ] `EMAIL_PORT = 587`
- [ ] `EMAIL_USER = apikey`
- [ ] `EMAIL_PASS` (SendGrid API key)
- [ ] `EMAIL_FROM = noreply@vasukritijewels.com`
- [ ] `RAZORPAY_KEY_ID` (live key - after KYC)
- [ ] `RAZORPAY_KEY_SECRET` (live secret)
- [ ] `FRONTEND_URL` (your production frontend URL)

**Frontend (Vercel) - Production:**
- [ ] `NEXT_PUBLIC_API_URL` (production backend URL)
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` (live key)
- [ ] `NEXT_PUBLIC_GA_ID` (optional)

### Step 4.2: Staging Environment Variables Checklist

**Backend (Render) - vasukriti-backend-staging:**
- [ ] `NODE_ENV = staging`
- [ ] `PORT = 10000`
- [ ] `MONGODB_URI` (staging cluster)
- [ ] `JWT_SECRET`
- [ ] `JWT_REFRESH_SECRET`
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `EMAIL_HOST = smtp.ethereal.email`
- [ ] `EMAIL_PORT = 587`
- [ ] `EMAIL_USER` (Ethereal user)
- [ ] `EMAIL_PASS` (Ethereal password)
- [ ] `EMAIL_FROM = noreply@staging.vasukritijewels.com`
- [ ] `RAZORPAY_KEY_ID` (test key)
- [ ] `RAZORPAY_KEY_SECRET` (test secret)
- [ ] `FRONTEND_URL` (staging frontend URL)

**Frontend (Vercel) - Preview/Staging:**
- [ ] `NEXT_PUBLIC_API_URL` (staging backend URL)
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` (test key)
- [ ] `NEXT_PUBLIC_GA_ID` (staging property)

### Step 4.3: Development Environment Setup

**For Local Development** (`.env` file in `/backend`):

```bash
NODE_ENV=development
PORT=5000

# Development MongoDB (from Phase 1)
MONGODB_URI=mongodb+srv://vasukriti_dev_user:YOUR_PASSWORD@vasukriti-development.xxxxx.mongodb.net/vasukriti_jewels?retryWrites=true&w=majority

# JWT Secrets (can be simple for dev)
JWT_SECRET=dev-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Ethereal for testing)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=[Your Ethereal credentials]
EMAIL_PASS=[Your Ethereal credentials]
EMAIL_FROM=noreply@dev.vasukritijewels.com

# Razorpay (Test keys)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your-test-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Frontend Development** (`.env.local` in `/frontend`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

**✅ Phase 4 Complete!** All environments configured.

---

## Phase 5: Domain & DNS Setup

**Duration:** 20 minutes (+ DNS propagation time: 1-48 hours)  
**Goal:** Connect custom domain to your deployments

### Step 5.1: Purchase Domain (Optional)

**Recommended Registrars:**
1. **Namecheap** - https://www.namecheap.com (~₹800/year)
2. **GoDaddy** - https://www.godaddy.com (~₹1,000/year)
3. **Cloudflare Registrar** - https://www.cloudflare.com (~₹700/year)

**Domain Suggestions:**
- `vasukritijewels.com`
- `vasukriti.shop`
- `vasukritijewellery.com`

Skip this if you want to use Vercel's free domain for now.

### Step 5.2: Configure DNS for Production

**In Vercel (for Frontend):**

1. Go to your project → **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter your domain: `vasukritijewels.com`
4. Click **"Add"**

5. **Vercel will show DNS records to add:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

**In Your Domain Registrar (Namecheap/GoDaddy):**

1. Go to DNS settings for your domain
2. Add the A record:
   - Type: `A Record`
   - Host: `@` (or leave empty)
   - Value: `76.76.21.21`
   - TTL: `Automatic` or `300`

3. Add the CNAME record:
   - Type: `CNAME Record`
   - Host: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `Automatic` or `300`

4. **Save DNS changes**

**Wait for DNS Propagation:** 5 minutes to 48 hours (usually 10-30 minutes)

**Check DNS propagation:**
- Visit: https://dnschecker.org/
- Enter: `vasukritijewels.com`
- Should see: `76.76.21.21`

### Step 5.3: Configure Staging Subdomain

**Add staging subdomain to Vercel:**

1. In Vercel project → **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Enter: `staging.vasukritijewels.com`
4. Select: Git Branch: `staging`
5. Click **"Add"**

**In Your Domain Registrar:**

1. Add CNAME record:
   - Type: `CNAME Record`
   - Host: `staging`
   - Value: `cname.vercel-dns.com`
   - TTL: `Automatic` or `300`

2. **Save DNS changes**

### Step 5.4: Update Backend CORS and Frontend URLs

**In Render Backend (Production):**
1. Update `FRONTEND_URL = https://vasukritijewels.com`
2. Update CORS settings in your backend code if needed

**In Render Backend (Staging):**
1. Update `FRONTEND_URL = https://staging.vasukritijewels.com`

Both backends will auto-redeploy with new settings.

### Step 5.5: Setup SSL Certificates

**Good News:** Both Vercel and Render automatically provision and manage SSL certificates! 🎉

- Vercel: Auto-provisions Let's Encrypt SSL (Free)
- Render: Auto-provisions SSL for custom domains (Free)

You don't need to do anything - just wait 5-10 minutes after DNS propagates.

**Verify SSL:**
- Visit: `https://vasukritijewels.com`
- Click padlock icon in browser
- Should show: "Connection is secure"

**✅ Phase 5 Complete!** Domain configured with SSL.

---

## Phase 6: Testing All Environments

**Duration:** 20 minutes  
**Goal:** Verify all environments work correctly

### Step 6.1: Test Production Backend

```bash
# Health check
curl https://vasukriti-backend-prod.onrender.com/api/health

# Expected: {"status":"ok","timestamp":"...","environment":"production"}

# Test CORS (from frontend domain)
curl -H "Origin: https://vasukritijewels.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://vasukriti-backend-prod.onrender.com/api/health

# Should return CORS headers
```

### Step 6.2: Test Production Frontend

1. **Visit:** `https://vasukritijewels.com` (or Vercel URL)

2. **Test User Journey:**
   - [ ] Homepage loads correctly
   - [ ] Product images load (Cloudinary)
   - [ ] Can browse products
   - [ ] Can view product details
   - [ ] Can add to cart
   - [ ] Can register new account
   - [ ] Receive verification email (check email)
   - [ ] Can verify email via link
   - [ ] Can login
   - [ ] Cannot checkout without verification
   - [ ] After verification, can checkout
   - [ ] Payment page loads (Razorpay)
   - [ ] Test payment works (use test card if TEST mode)

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Console tab
   - Should see no errors (some warnings OK)

4. **Check Network Tab:**
   - Open DevTools (F12) → Network tab
   - Refresh page
   - API calls to backend should be: Status 200
   - Check: `https://vasukriti-backend-prod.onrender.com/api/*`

### Step 6.3: Test Staging Environment

Repeat Step 6.2 for staging:
- URL: `https://staging.vasukritijewels.com` (or Vercel staging URL)
- Should connect to staging backend
- Should use test Razorpay keys
- Emails go to Ethereal (check console logs or Ethereal inbox)

### Step 6.4: Test Development Environment

**Start Backend:**
```bash
cd /Users/avish/Projects/Practice/vasukriti-jewels/backend
npm start
```

Expected output:
```
Server running on port 5000
MongoDB Connected: vasukriti-development...
Email configured successfully
```

**Start Frontend:**
```bash
# In new terminal
cd /Users/avish/Projects/Practice/vasukriti-jewels/frontend
npm run dev
```

Expected output:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
- Ready in XXXXms
```

**Test Local:**
- Visit: `http://localhost:3000`
- Repeat user journey tests
- Should connect to local backend on port 5000

### Step 6.5: Test Email Verification Flow (All Environments)

**Production:**
1. Register new account: test@example.com
2. Check email inbox (Gmail/Outlook/etc)
3. Should receive "Verify Your Email" email
4. Click verification link
5. Should redirect to site with success message
6. Try to checkout - should work now

**Staging:**
1. Register new account
2. Check Render logs for email preview URL:
   ```bash
   # In Render dashboard → Logs
   # Look for: "📧 Preview email at: https://ethereal.email/message/..."
   ```
3. Open preview URL in browser
4. Click verification link
5. Should redirect to staging site

**Development:**
1. Register new account
2. Check terminal logs for preview URL
3. Same as staging

### Step 6.6: Test Database Isolation

**Verify separate databases:**

1. **Create test product in production**
2. **Check staging** - product should NOT appear
3. **Check development** - product should NOT appear

This confirms complete database isolation! ✅

### Step 6.7: Load Testing (Optional)

Test backend performance:

```bash
# Install Apache Bench
brew install httpd  # macOS

# Test health endpoint (100 requests, 10 concurrent)
ab -n 100 -c 10 https://vasukriti-backend-prod.onrender.com/api/health

# Check results:
# - Time per request (should be < 500ms for health check)
# - Failed requests (should be 0)
```

**✅ Phase 6 Complete!** All environments tested and working.

---

## Phase 7: Local Development Setup

**Duration:** 10 minutes  
**Goal:** Set up local development environment for team members

### Step 7.1: Clone Repository

```bash
# Clone from GitHub
git clone https://github.com/YOUR_USERNAME/vasukriti-jewels.git
cd vasukriti-jewels
```

### Step 7.2: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### Step 7.3: Setup Backend Environment

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env file
nano .env  # or use VS Code
```

Add your development credentials (from Phase 1 & 4):

```bash
NODE_ENV=development
PORT=5000

# Development MongoDB URI
MONGODB_URI=mongodb+srv://vasukriti_dev_user:YOUR_PASSWORD@vasukriti-development.xxxxx.mongodb.net/vasukriti_jewels?retryWrites=true&w=majority

# ... rest of credentials
```

**Save and close** (Ctrl+X, Y, Enter in nano)

### Step 7.4: Setup Frontend Environment

```bash
cd ../frontend

# Create .env.local file
nano .env.local
```

Add:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

**Save and close**

### Step 7.5: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Open browser:** `http://localhost:3000`

### Step 7.6: Development Workflow

**Daily workflow:**
1. Pull latest changes: `git pull origin development`
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes
4. Test locally: `http://localhost:3000`
5. Commit: `git commit -m "feat: your feature"`
6. Push: `git push origin feature/your-feature`
7. Create Pull Request to `development` branch

**Environment Promotion:**
```bash
# After testing in development
git checkout staging
git merge development
git push origin staging

# After testing in staging
git checkout main
git merge staging
git push origin main
```

**✅ Phase 7 Complete!** Local development environment ready.

---

## Phase 8: Database Seeding

**Duration:** 5-10 minutes  
**Goal:** Populate databases with initial data (UI content for production, full test data for staging/dev)

### Step 8.1: Understanding Seed Scripts

**Two types of seed scripts:**

1. **`seed-ui-content.js`** - Production Safe ✅
   - Seeds only UI elements (Hero, Promo Bar, Categories, Settings)
   - NO products - add those manually
   - Safe to run in production

2. **`seed-test-data.js`** - Development/Staging Only 🧪
   - Seeds complete test data (UI + 30+ products + test users)
   - Has safety check - refuses to run in production
   - Perfect for local development and staging testing

### Step 8.2: Seed Production Database

**After deploying production backend:**

1. **SSH into your production server** or **run locally** with production database:

   ```bash
   # Method 1: Run locally connected to production DB
   cd /Users/avish/Projects/Practice/vasukriti-jewels/backend
   
   # Temporarily update .env to production MongoDB URI
   # (or set it inline - safer)
   MONGODB_URI="mongodb+srv://vasukriti_prod_user:PASSWORD@vasukriti-production..." npm run seed:ui
   ```

2. **Expected output:**
   ```
   🌱 Starting UI Content Seeding...
   ✅ Connected to MongoDB
   🗑️  Clearing existing UI content...
   ✅ Cleared existing data
   🎨 Seeding Hero Section...
   ✅ Created hero section: "Exquisite Craftsmanship"
   📢 Seeding Promotional Bar...
   ✅ Created promotional bar with 4 messages
   📁 Seeding Categories...
   ✅ Created 6 categories:
      - Rings
      - Necklaces
      - Earrings
      - Bracelets
      - Bangles
      - Pendants
   ⚙️  Seeding Settings...
   ✅ Created site settings: "Vasukriti Jewels"
   
   ✨ UI Content Seeding Complete!
   ```

3. **Verify on production site:**
   - Visit your deployed frontend
   - Hero section should display
   - Promotional bar should show at top
   - Categories should appear (but no products yet)

4. **Add real products:**
   - Login to admin panel
   - Go to Products → Add Product
   - Upload real images to Cloudinary
   - Add 5-10 products before launch

**⚠️ Important:** The seed script uses placeholder images from Unsplash. Update these:
   - Edit `backend/src/scripts/seed-ui-content.js`
   - Replace image URLs with your Cloudinary URLs
   - Or update images through admin panel after seeding

### Step 8.3: Seed Staging Database

**After deploying staging backend:**

```bash
cd /Users/avish/Projects/Practice/vasukriti-jewels/backend

# Option 1: Run locally connected to staging DB
MONGODB_URI="mongodb+srv://vasukriti_staging_user:PASSWORD@vasukriti-staging..." npm run seed:staging

# Option 2: Or set NODE_ENV manually
NODE_ENV=staging MONGODB_URI="your-staging-uri" node src/scripts/seed-test-data.js
```

**Expected output:**
```
🧪 Starting Test Data Seeding...
📦 Environment: staging
✅ Connected to MongoDB
🗑️  Clearing all existing data...
✅ Cleared all collections
🎨 Seeding Hero Section...
📢 Seeding Promotional Bar...
📁 Seeding Categories...
💍 Generating Products...
📦 Inserting 32 products...
✅ Created 32 products
   Product breakdown by category:
   - Rings: 6 products
   - Necklaces: 5 products
   - Earrings: 5 products
   - Bracelets: 5 products
   - Bangles: 6 products
   - Pendants: 5 products
👥 Seeding Users...
✅ Created user: admin@vasukritijewels.com (admin)
✅ Created user: customer@test.com (user)
✅ Created user: unverified@test.com (user)

✨ Test Data Seeding Complete!

🔐 Test Credentials:
   Admin:
   - Email: admin@vasukritijewels.com
   - Password: Admin@123

   Customer (Verified):
   - Email: customer@test.com
   - Password: Test@123

   Customer (Unverified):
   - Email: unverified@test.com
   - Password: Test@123
```

### Step 8.4: Seed Development Database

**For local development:**

```bash
cd /Users/avish/Projects/Practice/vasukriti-jewels/backend

# Make sure .env has development MongoDB URI
npm run seed:dev
```

**This will:**
- Clear all existing data
- Create UI elements
- Generate 30+ sample products
- Create 3 test user accounts
- Set up site settings

**Test the seeded data:**
```bash
# Start backend
npm run dev

# Start frontend (new terminal)
cd ../frontend
npm run dev

# Visit http://localhost:3000
# Login with: customer@test.com / Test@123
```

### Step 8.5: Customize Seed Data

**Before running seed scripts, customize the data:**

1. **Edit hero section:**
   ```bash
   nano backend/src/scripts/seed-ui-content.js
   # or
   code backend/src/scripts/seed-ui-content.js
   ```

2. **Update these sections:**
   ```javascript
   const uiContent = {
     heroSection: {
       title: 'Your Custom Title',
       subtitle: 'Your Subtitle',
       description: 'Your description...',
       images: [
         {
           url: 'https://your-cloudinary-url.com/hero.jpg',
           publicId: 'vasukriti/hero/main-banner',
           alt: 'Your alt text',
         },
       ],
       // ...
     },
     
     promotionalBar: {
       messages: [
         {
           text: '✨ Your custom message',
           link: '/your-page',
           icon: '✨',
         },
         // ... more messages
       ],
     },
     
     categories: [
       // Update category images with Cloudinary URLs
       {
         name: 'Rings',
         image: {
           url: 'https://res.cloudinary.com/YOUR_CLOUD/rings.jpg',
           publicId: 'vasukriti/categories/rings',
         },
       },
     ],
   };
   ```

3. **Save and run:**
   ```bash
   npm run seed:ui  # for production
   # or
   npm run seed:dev  # for development
   ```

### Step 8.6: Re-seeding (If Needed)

**Warning:** Seeding deletes existing data in these collections:
- HeroSection
- PromotionalBar  
- Category
- Product (test seed only)
- User (test seed only)
- Settings

**To re-seed safely:**

```bash
# Development - safe to run anytime
npm run seed:dev

# Staging - safe for testing
npm run seed:staging

# Production - be very careful!
# Only if you want to reset UI content
# This will NOT delete products (they're added manually)
npm run seed:ui
```

**Backup before re-seeding production:**
1. Go to MongoDB Atlas dashboard
2. Select production cluster
3. Click "..." menu → "Take Snapshot" (paid tier only)
4. Or export data: Collections → Export Collection

### Step 8.7: Troubleshooting Seed Scripts

**Problem: "Cannot run test data seed in PRODUCTION environment"**
```bash
✅ This is correct! Use npm run seed:ui for production instead.
```

**Problem: "MongoDB connection error"**
```bash
# Check your .env file
cat backend/.env | grep MONGODB_URI

# Should see valid URI:
# MONGODB_URI=mongodb+srv://username:password@cluster...

# Test connection manually:
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected!'), console.error)"
```

**Problem: "Module not found"**
```bash
# Install dependencies
cd backend
npm install
```

**Problem: "Images not showing after seeding"**
```bash
# Option 1: Update seed script with real Cloudinary URLs
# Edit: backend/src/scripts/seed-ui-content.js
# Replace Unsplash URLs with your Cloudinary URLs

# Option 2: Upload images manually after seeding
# Admin panel → Edit hero section/categories → Upload images
```

**Problem: "Products not appearing (development)"**
```bash
# Check if seed:dev was successful
npm run seed:dev

# Verify in MongoDB:
# MongoDB Atlas → Browse Collections → products collection

# Check frontend API calls (browser console):
# Should call: /api/products
# Should return: array of products
```

**Problem: "Can't login with test accounts"**
```bash
# Re-run seed to create users
npm run seed:dev

# Or create user manually via API:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"Test@123"}'
```

**✅ Phase 8 Complete!** Database seeded with appropriate data for each environment.

---

## Troubleshooting

### Backend Issues

**Problem: Backend not connecting to MongoDB**

Check Render logs:
1. Go to Render dashboard
2. Select your backend service
3. Click "Logs" tab
4. Look for error messages

Common fixes:
```bash
# Incorrect MongoDB URI format
# Should be: mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority

# Password contains special characters
# URL encode the password: https://www.urlencoder.org/

# IP not whitelisted
# MongoDB Atlas → Network Access → Add 0.0.0.0/0
```

**Problem: Backend returns 500 errors**

```bash
# Check environment variables
# Render dashboard → Service → Environment tab
# Verify all required variables are set

# Check logs for specific error
# Common issues:
# - Missing environment variable
# - Invalid JWT secret
# - Invalid Cloudinary credentials
```

**Problem: Backend won't start**

```bash
# Check package.json scripts
# Should have: "start": "node src/server.js"

# Check Root Directory in Render
# Should be: backend

# Check Node version
# Render → Settings → Change Node version to 18.x
```

### Frontend Issues

**Problem: Frontend can't connect to backend**

```bash
# Check NEXT_PUBLIC_API_URL in Vercel
# Vercel → Settings → Environment Variables
# Should be: https://vasukriti-backend-prod.onrender.com (no trailing slash)

# Check CORS in backend
# Backend should allow your frontend domain

# Check browser console
# F12 → Console tab → Look for CORS errors
```

**Problem: Images not loading (Cloudinary)**

```bash
# Check Cloudinary credentials in Render
# Should match your Cloudinary dashboard

# Check image URLs in browser Network tab
# Should be: https://res.cloudinary.com/your-cloud-name/...

# Check Cloudinary upload folder permissions
# Cloudinary dashboard → Media Library → Check folders exist
```

**Problem: Payment not working**

```bash
# Check Razorpay key in Vercel environment variables
# Production: Should use rzp_live_xxxxx (after KYC)
# Staging: Should use rzp_test_xxxxx

# Check Razorpay dashboard
# Verify API keys are active

# Test with Razorpay test cards:
# Card: 4111 1111 1111 1111
# CVV: Any 3 digits
# Expiry: Any future date
```

### Email Issues

**Problem: Verification emails not sending (Production)**

```bash
# Check SendGrid configuration
# Render → Environment → EMAIL_* variables

# Verify SendGrid API key is active
# SendGrid dashboard → Settings → API Keys

# Check Render logs for email errors
# Render dashboard → Logs → Search for "email"

# Test email with curl:
curl -X POST https://vasukriti-backend-prod.onrender.com/api/auth/resend-verification \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Problem: Can't see Ethereal preview emails (Staging/Dev)**

```bash
# Check Render logs (Staging) or terminal (Dev)
# Look for: "📧 Preview email at: https://ethereal.email/message/..."

# Copy the full URL and paste in browser
# Ethereal emails are only previews, not real emails

# If no preview URL in logs:
# Check EMAIL_HOST = smtp.ethereal.email
# Run: node backend/setup-ethereal.js (get new credentials)
```

### Database Issues

**Problem: Data appearing in wrong environment**

```bash
# Verify MONGODB_URI in each Render service
# Production should connect to: vasukriti-production cluster
# Staging should connect to: vasukriti-staging cluster

# Check MongoDB Atlas
# Database → Clusters → Verify 3 separate clusters exist

# Check database name in URI
# Should end with: /vasukriti_jewels?retryWrites=true
```

**Problem: Database connection timeout**

```bash
# Check MongoDB Atlas Network Access
# Should have: 0.0.0.0/0 (allow all IPs)

# Check MongoDB Atlas Database Access
# User should have: "Read and write to any database" role

# Verify cluster is running
# MongoDB Atlas → Database → Should show "Active" status
```

### DNS/Domain Issues

**Problem: Domain not resolving**

```bash
# Check DNS propagation
# Visit: https://dnschecker.org/
# Enter your domain
# Should show: 76.76.21.21 (Vercel IP)

# Wait longer (DNS can take 48 hours)
# Usually works in 10-30 minutes

# Verify DNS records in registrar
# Should have:
# A record: @ → 76.76.21.21
# CNAME: www → cname.vercel-dns.com
```

**Problem: SSL certificate not provisioning**

```bash
# Wait 10-15 minutes after DNS propagates
# Vercel auto-provisions certificates

# Check Vercel domain status
# Vercel → Settings → Domains
# Should show: Valid Configuration ✓

# Try accessing https://www.vasukritijewels.com
# Sometimes www works before apex domain
```

### Performance Issues

**Problem: Backend cold starts (slow first request)**

```bash
# This is normal on Render free tier
# Backend sleeps after 15 minutes of inactivity
# First request takes 30-60 seconds to wake up

# Solutions:
# 1. Upgrade to paid plan (₹600/month, no cold starts)
# 2. Use cron job to ping every 10 minutes:
#    - Setup: cron-job.org (free)
#    - URL: https://vasukriti-backend-prod.onrender.com/api/health
#    - Interval: Every 10 minutes

# 3. Add loading state in frontend for first request
```

**Problem: Frontend slow to load**

```bash
# Check Vercel deployment region
# Should be: Mumbai (bom1) for India

# Optimize images
# Use Next.js Image component (already implemented)

# Check Vercel analytics
# Vercel → Project → Analytics tab

# Enable Vercel Edge Network (free)
# Vercel → Settings → Edge Network
```

### Deployment Issues

**Problem: Vercel build failing**

```bash
# Check build logs in Vercel
# Vercel → Deployments → Select deployment → View logs

# Common issues:
# - Missing dependencies: npm install missing package
# - TypeScript errors: Fix type errors in code
# - Environment variables missing: Add in Vercel settings

# Test build locally:
cd frontend
npm run build
# Fix any errors shown
```

**Problem: Render deployment failing**

```bash
# Check Render logs
# Render → Service → Logs tab

# Common issues:
# - Root Directory wrong: Should be "backend"
# - Start command wrong: Should be "npm start"
# - Missing dependencies: Check package.json

# Test locally:
cd backend
npm install
npm start
# Fix any errors shown
```

---

## Post-Deployment Checklist

### Security Checklist
- [ ] All JWT secrets are strong random strings (48+ characters)
- [ ] MongoDB Network Access set to 0.0.0.0/0 with password protection
- [ ] Razorpay live keys kept secret (not in Git)
- [ ] Cloudinary credentials kept secret
- [ ] CORS configured correctly (only allow your domains)
- [ ] Rate limiting enabled on backend
- [ ] HTTPS enabled (SSL certificate active)
- [ ] Environment variables never committed to Git
- [ ] Database backups enabled (MongoDB Atlas automatic)

### Monitoring Setup
- [ ] **UptimeRobot** (https://uptimerobot.com) - FREE
  - Monitor production backend: `/api/health`
  - Monitor production frontend: `/`
  - Monitor staging backend: `/api/health`
  - Alert via: Email, SMS, Slack
  - Check interval: 5 minutes

- [ ] **Render Dashboard** - Built-in monitoring
  - Check CPU, Memory, Request volume
  - Set up email alerts for service down

- [ ] **Vercel Analytics** - Built-in (FREE)
  - Track page views, performance
  - Monitor Web Vitals (LCP, FID, CLS)

- [ ] **Error Tracking** - Consider adding:
  - Sentry (https://sentry.io) - FREE tier (5k events/month)
  - Or check Render logs regularly

### Performance Optimization
- [ ] Enable Vercel Edge Caching
- [ ] Optimize images (already using Next.js Image)
- [ ] Enable Cloudinary auto-format and compression
- [ ] Setup cron job to keep Render backend warm (if on free tier)
- [ ] Add Redis caching for product listings (optional, later)

### Backup Strategy
- [ ] MongoDB Atlas automatic backups (enabled by default)
- [ ] Document recovery process
- [ ] Test database restore (from MongoDB Atlas backup)
- [ ] Keep environment variables backed up securely
- [ ] Git repository backed up (GitHub has automatic backups)

### Documentation
- [ ] Update README.md with:
  - Production URL
  - Staging URL
  - How to run locally
  - Environment variables needed
  - Deployment process
- [ ] Document admin credentials (store securely)
- [ ] Document 3rd party service accounts:
  - MongoDB Atlas login
  - Render login
  - Vercel login
  - Cloudinary login
  - Razorpay login
  - Domain registrar login

### Testing
- [ ] Test complete user journey on production
- [ ] Test payment flow with real card (small amount)
- [ ] Test email verification on real email address
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test on different browsers (Chrome, Safari, Firefox)
- [ ] Test slow network (Chrome DevTools → Network → Slow 3G)
- [ ] Test with disabled JavaScript (should show error message)

### Marketing Preparation
- [ ] Add Google Analytics
- [ ] Add Facebook Pixel (if using Facebook ads)
- [ ] Setup Google Search Console
- [ ] Submit sitemap to Google
- [ ] Add meta tags (OG tags for social sharing)
- [ ] Add favicon (already done if in public folder)
- [ ] Test social media sharing (WhatsApp, Facebook, Instagram)

### Legal Compliance
- [ ] Add Privacy Policy page
- [ ] Add Terms & Conditions page
- [ ] Add Refund Policy page
- [ ] Add Shipping Policy page
- [ ] Add Cookie Consent banner (if required)
- [ ] GDPR compliance (if serving EU customers)
- [ ] Add contact information (email, phone)

### Launch Preparation & Data Seeding
- [ ] **Seed UI content in production** (Run: `npm run seed:ui`)
  - Hero section, promotional bar, categories
  - ⚠️ Do NOT run test data seed in production
- [ ] **Add real products manually** through admin panel
  - Upload real product images to Cloudinary
  - Set accurate prices and descriptions
- [ ] Test all products load correctly
- [ ] Verify all images display properly
- [ ] **For Staging/Dev:** Run `npm run seed:test` for complete test data
- [ ] Set up customer support email
- [ ] Prepare launch announcement
- [ ] Create social media posts
- [ ] Notify early users/beta testers

### Post-Launch Monitoring (First Week)
- [ ] Check logs daily for errors
- [ ] Monitor user registrations
- [ ] Monitor order volume
- [ ] Check email delivery success rate
- [ ] Respond to customer queries quickly
- [ ] Fix bugs immediately
- [ ] Gather user feedback
- [ ] Monitor server performance (CPU, memory)

---

## Quick Reference

### Important URLs

**Production:**
- Frontend: `https://vasukritijewels.com`
- Backend: `https://vasukriti-backend-prod.onrender.com`
- Backend Health: `https://vasukriti-backend-prod.onrender.com/api/health`
- MongoDB: MongoDB Atlas dashboard

**Staging:**
- Frontend: `https://staging.vasukritijewels.com`
- Backend: `https://vasukriti-backend-staging.onrender.com`
- Backend Health: `https://vasukriti-backend-staging.onrender.com/api/health`

**Development:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

### Useful Commands

```bash
# Deploy to production
git checkout main
git merge staging
git push origin main

# Deploy to staging
git checkout staging
git merge development
git push origin staging

# Create new feature
git checkout development
git checkout -b feature/new-feature
# ... make changes ...
git commit -m "feat: description"
git push origin feature/new-feature

# Check deployment status
# Render: Check dashboard
# Vercel: Check dashboard or use CLI:
npx vercel ls

# View logs
# Render: Dashboard → Service → Logs
# Vercel: Dashboard → Deployments → View Function Logs

# Test backend health
curl https://vasukriti-backend-prod.onrender.com/api/health

# Check MongoDB connection
# MongoDB Atlas → Database → Click "Browse Collections"
```

### Emergency Contacts

**Service Outages:**
- Render Status: https://status.render.com/
- Vercel Status: https://www.vercel-status.com/
- MongoDB Atlas Status: https://status.mongodb.com/
- Cloudinary Status: https://status.cloudinary.com/

**Support:**
- Render Support: https://render.com/docs (Documentation)
- Vercel Support: https://vercel.com/support
- MongoDB Atlas Support: https://www.mongodb.com/support
- Cloudinary Support: https://support.cloudinary.com/

---

## Summary

**🎉 Congratulations!** You now have a professional 3-environment deployment:

✅ **Production** - Live customer-facing site  
✅ **Staging** - Pre-production testing environment  
✅ **Development** - Local development environment  

**Infrastructure Stack:**
- Frontend: Vercel (Next.js)
- Backend: Render.com (Node.js/Express)
- Database: MongoDB Atlas (3 separate clusters)
- Images: Cloudinary
- Payments: Razorpay
- Email: SendGrid (prod) + Ethereal (staging/dev)

**Monthly Cost:** ₹67 (domain only) - Everything else FREE! 💰

**What's Next:**
1. Complete POST-DEPLOYMENT CHECKLIST
2. Test thoroughly on all environments
3. Add products to production
4. Launch! 🚀

**Need Help?**
- Re-read relevant sections of this guide
- Check TROUBLESHOOTING section
- Check service status pages
- Review Render/Vercel logs

---

## Appendix

### A. Razorpay Setup (Detailed)

**Get Test Keys (Immediate):**
1. Go to https://dashboard.razorpay.com/
2. Sign up / Login
3. Go to Settings → API Keys
4. Under "Test Mode", click "Generate Test Key"
5. Copy `Key ID` and `Key Secret`

**Get Live Keys (Requires KYC):**
1. Complete business verification (submit documents)
2. Wait for approval (1-3 days)
3. Switch to "Live Mode" in dashboard
4. Go to Settings → API Keys
5. Click "Generate Live Key"
6. Copy `Key ID` and `Key Secret`

**Update Environment Variables:**
- Production: Use live keys
- Staging/Dev: Use test keys

### B. SendGrid Setup (Detailed)

**Create Account:**
1. Go to https://sendgrid.com/
2. Sign up (FREE tier: 100 emails/day forever)
3. Verify email address
4. Complete sender authentication

**Create API Key:**
1. Go to Settings → API Keys
2. Click "Create API Key"
3. Name: "Vasukriti Jewels Production"
4. Permissions: "Full Access"
5. Click "Create & View"
6. **Copy API key** (shown only once!)

**Configure Sender:**
1. Go to Settings → Sender Authentication
2. Choose "Verify Single Sender"
3. Fill form with your business email
4. Verify email address (check inbox)

**Update Backend:**
```bash
# Render production environment
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=[Your SendGrid API Key]
EMAIL_FROM=noreply@vasukritijewels.com
```

### C. Cloudinary Setup (Detailed)

**Create Account:**
1. Go to https://cloudinary.com/users/register_free
2. Sign up (FREE tier: 25 GB storage, 25 GB bandwidth)
3. Verify email

**Get Credentials:**
1. Go to Dashboard
2. Copy:
   - Cloud Name
   - API Key
   - API Secret

**Create Folders:**
1. Go to Media Library
2. Click "Create Folder"
3. Create:
   - `production`
   - `production/products`
   - `staging`
   - `staging/products`
   - `development`
   - `development/products`

**Update All Environments:**
All environments use same credentials but different folders (configured in code).

### D. MongoDB Atlas Additional Settings

**Enable Backups:**
1. Already enabled by default on M0 free tier!
2. Backups taken automatically
3. Can't customize on free tier (requires paid cluster)

**Monitor Database:**
1. Go to Database → Cluster
2. Click "Metrics" tab
3. View: Connections, Operations, Network
4. Set alerts: Click "Alerts" → "Create Alert"

**Connect with Compass (GUI):**
1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Open Compass
3. Click "New Connection"
4. Paste your MongoDB URI
5. Click "Connect"
6. Browse collections visually!

---

**End of Guide**  
**Version:** 1.0  
**Date:** 11 January 2026  
**Author:** GitHub Copilot  
**For:** Vasukriti Jewels Deployment

Need clarification on any step? Just ask! 🚀
