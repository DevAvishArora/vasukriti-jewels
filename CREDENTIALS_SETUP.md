# 🔐 Credentials Setup Guide

## Step-by-Step Instructions to Get All API Keys

---

## 1. MongoDB (Database) - REQUIRED ✅

### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Go to** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Sign up** for a free account
3. **Create a new project** (e.g., "Vasukriti Jewels")
4. **Build a cluster**:
   - Choose **FREE** tier (M0)
   - Select a region close to you
   - Click "Create Cluster"
5. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `vasukriti_admin`
   - Password: Generate a strong password (save it!) (gy=Wv2_36'5-)
   - User Privileges: "Atlas admin"
6. **Whitelist IP**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IPs only
7. **Get Connection String**:
   - Go back to "Database"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (mongodb+srv://vasukriti_admin:gy=Wv2_36'5-@cluster0.w0wr68b.mongodb.net/?appName=Cluster0)
   - Replace `<password>` with your actual password

**Format:**
```
mongodb+srv://vasukriti_admin:<password>@cluster0.xxxxx.mongodb.net/vasukriti-jewels?retryWrites=true&w=majority
```

### Option B: Local MongoDB
```
mongodb://localhost:27017/vasukriti-jewels
```

---

## 2. Cloudinary (Image Hosting) - REQUIRED ✅

1. **Go to** [Cloudinary](https://cloudinary.com/)
2. **Sign up** for free account
3. **Go to Dashboard** after signup
4. You'll see:
   - **Cloud name**: `dxxxxx` (e.g., `dj2klmn3p`)
   - **API Key**: `123456789012345`
   - **API Secret**: `abcdefghijklmnopqrstuvwxyz`

**Copy these values** - you'll need all three!

**Free Tier Includes:**
- 25 GB storage
- 25 GB bandwidth/month
- 25,000 transformations/month
- More than enough for development and small production

---

## 3. Razorpay (Payment Gateway) - OPTIONAL for now

### For Development (Test Mode):

1. **Go to** [Razorpay](https://razorpay.com/)
2. **Sign up** for an account
3. **Complete KYC** (may take 1-2 days for approval)
4. **Go to Settings** → **API Keys**
5. **Generate Test Keys** (for development):
   - Click "Generate Test Key"
   - You'll get:
     - **Key ID**: `rzp_test_xxxxxxxxxxxxx`
     - **Key Secret**: `yyyyyyyyyyyyyyyyyyyy`

**Note:** Keep in Test Mode for now. Switch to Live Mode only when ready for production.

**Test Cards for Razorpay:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

---

## 4. Email Service (SMTP) - OPTIONAL for now

### Option A: Gmail (Quick Setup)

1. **Use your Gmail account**
2. **Enable 2-Factor Authentication**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification
3. **Generate App Password**:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Name it "Vasukriti Jewels"
   - Click "Generate"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

**Settings:**
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  (app password)
```

### Option B: SendGrid (More Professional)

1. **Go to** [SendGrid](https://sendgrid.com/)
2. **Sign up** for free (100 emails/day free)
3. **Create API Key**:
   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name: "Vasukriti Jewels"
   - Full Access
   - Copy the API key (starts with `SG.`)

**Note:** For now, you can skip email setup and add it later.

---

## 5. Redis (Caching) - OPTIONAL

### For Development:
Skip Redis for now. It's optional and can be added later.

### If you want to use it:

**Option A: Local Redis**
```bash
brew install redis  # macOS
redis-server        # Start server
```

**Option B: Redis Cloud** (Free tier available)
1. Go to [Redis Cloud](https://redis.com/try-free/)
2. Sign up and create a database
3. Get connection details

---

## 6. Google Analytics - OPTIONAL

1. **Go to** [Google Analytics](https://analytics.google.com/)
2. **Create Account** and **Property**
3. **Get Measurement ID** (Format: `G-XXXXXXXXXX`)

**Note:** You can add this later when deploying to production.

---

## Quick Priority Setup

### For Immediate Development (Minimum Required):

1. ✅ **MongoDB** - Get this first (local or Atlas)
2. ✅ **Cloudinary** - Essential for product images
3. ⏭️ **Razorpay** - Can use test mode, set up later
4. ⏭️ **Email** - Can skip for now, add later
5. ⏭️ **Redis** - Skip for now
6. ⏭️ **Google Analytics** - Add during deployment

---

## Estimated Setup Time

- **MongoDB Atlas**: 10 minutes
- **Cloudinary**: 5 minutes
- **Razorpay (Test)**: 15 minutes (+ KYC waiting time)
- **Gmail App Password**: 5 minutes
- **Total for essentials**: ~30 minutes

---

## Security Reminders 🔒

1. **Never commit** `.env` files to Git (already in .gitignore)
2. **Use strong passwords** for all services
3. **Enable 2FA** where available
4. **Rotate keys** regularly in production
5. **Use test keys** in development
6. **Keep production keys** separate

---

## Need Help?

If you run into issues:
1. Check service documentation
2. Most services have excellent support
3. Free tiers are usually sufficient for development
4. You can upgrade later as needed

---

**Next Step:** Once you have credentials, I'll help you update the `.env` files!
