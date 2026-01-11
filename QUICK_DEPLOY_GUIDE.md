# 🚀 Quick Deployment Guide

This guide will help you deploy Vasukriti Jewels in **30 minutes**.

## Prerequisites
- [ ] GitHub account
- [ ] Credit/debit card (for domain purchase ~₹800)
- [ ] Gmail account

## Step 1: Create Accounts (10 minutes)

### 1.1 Vercel (Frontend Hosting)
```
1. Go to: https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel
✅ Done!
```

### 1.2 Render.com (Backend Hosting)
```
1. Go to: https://render.com/
2. Click "Get Started for Free"
3. Sign up with GitHub
4. Authorize Render
✅ Done!
```

### 1.3 MongoDB Atlas (Database)
```
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google
3. Choose "Free Shared" plan
4. Cloud Provider: AWS
5. Region: Mumbai (ap-south-1)
6. Cluster Name: "vasukriti-production"
7. Click "Create"
8. Wait 3-5 minutes for cluster creation
✅ Done!
```

---

## Step 2: Setup MongoDB (5 minutes)

### 2.1 Create Database User
```
1. In MongoDB Atlas, click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Username: vasukriti_admin
4. Password: Click "Autogenerate Secure Password" → Copy it!
5. Database User Privileges: "Read and write to any database"
6. Click "Add User"
```

### 2.2 Allow Network Access
```
1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. IP Address: 0.0.0.0/0
5. Click "Confirm"
```

### 2.3 Get Connection String
```
1. Click "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace <password> with the password you copied earlier
6. Replace myFirstDatabase with: vasukriti_prod

Example:
mongodb+srv://vasukriti_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/vasukriti_prod?retryWrites=true&w=majority

✅ Save this somewhere!
```

---

## Step 3: Deploy Backend (10 minutes)

### 3.1 Push Code to GitHub
```bash
# Make sure all code is committed
git add .
git commit -m "prepare for deployment"
git push origin main
```

### 3.2 Deploy on Render
```
1. Go to Render Dashboard: https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Click "Connect GitHub"
4. Find and select your repository: vasukriti-jewels
5. Configure:
   - Name: vasukriti-backend-prod
   - Region: Singapore
   - Branch: main
   - Root Directory: backend
   - Runtime: Node
   - Build Command: npm install
   - Start Command: npm start
   - Instance Type: Free
6. Click "Advanced" → Add Environment Variables:
```

**Environment Variables to Add:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<paste-your-mongodb-connection-string>
JWT_SECRET=your-super-secret-jwt-key-change-this-12345
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-67890
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=https://vasukritijewels.vercel.app
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-email-password-or-app-password>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
```

```
7. Click "Create Web Service"
8. Wait 5-10 minutes for deployment
9. Once deployed, copy the URL (e.g., https://vasukriti-backend-prod.onrender.com)
✅ Backend is live!
```

---

## Step 4: Deploy Frontend (5 minutes)

### 4.1 Update Frontend Environment
```bash
# Edit frontend/.env.production
# Update NEXT_PUBLIC_API_URL with your Render backend URL
```

### 4.2 Deploy on Vercel
```
1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select "vasukriti-jewels"
4. Configure:
   - Project Name: vasukriti-jewels
   - Framework Preset: Next.js
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: .next
5. Add Environment Variables:
   - NEXT_PUBLIC_API_URL: <your-render-backend-url>/api
   - NEXT_PUBLIC_RAZORPAY_KEY_ID: <your-razorpay-key>
6. Click "Deploy"
7. Wait 2-3 minutes
8. Your site is live at: https://vasukriti-jewels.vercel.app
✅ Frontend is live!
```

---

## Step 5: Test Everything (5 minutes)

### Test Checklist
```
Visit your frontend URL and test:
- [ ] Homepage loads
- [ ] Products page works
- [ ] Can register new account
- [ ] Can login
- [ ] Can add product to cart
- [ ] Can view cart
- [ ] Backend API responding (check Network tab)
```

### If Something Doesn't Work:

**Backend Issues:**
```
1. Go to Render Dashboard
2. Click on your service
3. Click "Logs" tab
4. Look for errors
5. Check environment variables are set correctly
```

**Frontend Issues:**
```
1. Go to Vercel Dashboard
2. Click on your project
3. Click "Deployments" tab
4. Click latest deployment → "View Function Logs"
5. Check for errors
```

---

## Step 6: Add Custom Domain (Optional)

### Buy Domain
```
1. Go to Namecheap.com or GoDaddy.com
2. Search for: vasukritijewels.com
3. Purchase (~₹800/year)
```

### Connect to Vercel
```
1. In Vercel Dashboard → Project Settings → Domains
2. Add Domain: vasukritijewels.com
3. Follow DNS instructions
4. Add these records in your domain provider:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com
5. Wait 1-24 hours for DNS propagation
6. SSL certificate is automatic!
✅ Custom domain connected!
```

---

## 🎉 You're Live!

Your e-commerce site is now:
- ✅ Deployed on production
- ✅ Using free tiers
- ✅ Auto-deploying on git push
- ✅ SSL enabled (HTTPS)
- ✅ Global CDN (fast loading)

### Your URLs:
- **Frontend:** https://vasukriti-jewels.vercel.app (or your custom domain)
- **Backend:** https://vasukriti-backend-prod.onrender.com
- **Admin Panel:** https://vasukriti-jewels.vercel.app/admin

---

## Next Steps

1. **Setup Staging Environment** (repeat above for `staging` branch)
2. **Add Monitoring** (UptimeRobot.com - free)
3. **Setup Backups** (MongoDB Atlas auto-backups enabled)
4. **Configure Real Email** (SendGrid free tier or Gmail App Password)
5. **Test Payments** (Use Razorpay test mode first)

---

## Common Issues & Solutions

### Backend Cold Starts (First Request Slow)
**Problem:** Backend sleeps after 15 minutes of inactivity
**Solution:** 
- Use cron-job.org to ping `/api/health` every 14 minutes (free)
- Or upgrade to Render Starter plan ($7/mo) for no cold starts

### CORS Errors
**Problem:** Frontend can't connect to backend
**Solution:**
1. Check `FRONTEND_URL` in backend env vars matches your Vercel URL
2. Check backend logs for CORS errors
3. Make sure backend is deployed and accessible

### Database Connection Failed
**Problem:** Can't connect to MongoDB
**Solution:**
1. Check MongoDB connection string is correct
2. Verify password doesn't have special characters (or URL encode them)
3. Check Network Access allows 0.0.0.0/0
4. Test connection string locally first

---

## Support

Need help? Check:
- Render Logs: https://dashboard.render.com → Your Service → Logs
- Vercel Logs: https://vercel.com/dashboard → Your Project → Deployments
- MongoDB Logs: https://cloud.mongodb.com → Database → Metrics

---

**Total Time:** ~30 minutes  
**Total Cost:** ₹0/month (+ ₹800/year for domain if purchased)

Happy deploying! 🚀
