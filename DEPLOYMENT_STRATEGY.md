# Vasukriti Jewels - Deployment Strategy & Plan
## Low-Budget Production Deployment (Free/Minimal Cost)

---

## 📋 Executive Summary

**Goal:** Deploy 3 environments with minimal/zero cost
- **Production** (main.vasukritijewels.com) - Customer-facing
- **Staging** (staging.vasukritijewels.com) - Pre-production testing
- **Development** (dev.vasukritijewels.com) - Active development

**Total Monthly Cost:** ₹0 - ₹800/month ($0-10/month)

---

## 🏗️ Infrastructure Architecture

### Recommended Stack (Free Tier)

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  Production:   Vercel (Free)                               │
│  Staging:      Vercel (Free)                               │
│  Development:  Vercel (Free)                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                │
├─────────────────────────────────────────────────────────────┤
│  Production:   Render.com (Free tier)                      │
│  Staging:      Render.com (Free tier)                      │
│  Development:  Render.com (Free tier)                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                       │
├─────────────────────────────────────────────────────────────┤
│  Production:   MongoDB Atlas (Free M0 - 512MB)            │
│  Staging:      MongoDB Atlas (Free M0 - 512MB)            │
│  Development:  MongoDB Atlas (Shared with staging)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 💰 Cost Breakdown

### Option 1: Completely Free (Recommended to Start)

| Service | Plan | Cost | Features |
|---------|------|------|----------|
| **Vercel** (Frontend) | Hobby | FREE | 3 projects, 100GB bandwidth/mo |
| **Render.com** (Backend) | Free | FREE | 750 hrs/mo (3 services), auto-sleep after 15 min |
| **MongoDB Atlas** | M0 Free | FREE | 512MB storage, Shared CPU |
| **Cloudinary** | Free | FREE | 25GB storage, 25GB bandwidth/mo |
| **Domain** (.com) | - | ₹800/year | From GoDaddy/Namecheap |
| **Total** | | **₹67/month** | |

**Limitations:**
- Backend sleeps after 15 min inactivity (cold starts ~30s)
- Limited database storage (512MB)
- Limited bandwidth
- No custom email domain

### Option 2: Basic Paid (Better Performance)

| Service | Plan | Cost | Features |
|---------|------|------|----------|
| **Vercel** | Hobby | FREE | Same as above |
| **Render.com** | Starter | $7/mo | No sleep, better CPU, 512MB RAM |
| **MongoDB Atlas** | M2 | $9/mo | 2GB storage, Better performance |
| **Cloudinary** | Free | FREE | Same as above |
| **Domain** | - | ₹800/year | - |
| **Total** | | **₹1,400/month** | |

**Benefits:**
- No cold starts
- Better database performance
- More reliable

---

## 🌐 Environment Configuration

### 1. Production Environment
**URL:** `https://vasukritijewels.com` or `https://main.vasukritijewels.com`

**Purpose:** Live customer-facing website

**Configuration:**
```env
NODE_ENV=production
FRONTEND_URL=https://vasukritijewels.com
MONGODB_URI=mongodb+srv://prod_user:***@cluster-prod.mongodb.net/vasukriti_prod
JWT_SECRET=<strong-production-secret>
EMAIL_HOST=smtp.sendgrid.net  # Use real email service
CLOUDINARY_CLOUD_NAME=vasukriti-prod
RAZORPAY_KEY_ID=rzp_live_***
```

**Deployment:**
- Auto-deploy from `main` branch
- Manual approval required
- Run all tests before deployment
- Database migrations automated

### 2. Staging Environment
**URL:** `https://staging.vasukritijewels.com`

**Purpose:** Pre-production testing, client demos

**Configuration:**
```env
NODE_ENV=staging
FRONTEND_URL=https://staging.vasukritijewels.com
MONGODB_URI=mongodb+srv://staging_user:***@cluster-staging.mongodb.net/vasukriti_staging
JWT_SECRET=<staging-secret>
EMAIL_HOST=smtp.ethereal.email  # Test email
CLOUDINARY_CLOUD_NAME=vasukriti-staging
RAZORPAY_KEY_ID=rzp_test_***
```

**Deployment:**
- Auto-deploy from `staging` branch
- Test payment gateways (test mode)
- Test emails (Ethereal)

### 3. Development Environment
**URL:** `https://dev.vasukritijewels.com`

**Purpose:** Active development, feature testing

**Configuration:**
```env
NODE_ENV=development
FRONTEND_URL=https://dev.vasukritijewels.com
MONGODB_URI=mongodb+srv://dev_user:***@cluster-dev.mongodb.net/vasukriti_dev
JWT_SECRET=<dev-secret>
EMAIL_HOST=smtp.ethereal.email
CLOUDINARY_CLOUD_NAME=vasukriti-dev
RAZORPAY_KEY_ID=rzp_test_***
```

**Deployment:**
- Auto-deploy from `development` branch
- Frequent updates
- Feature flags enabled

---

## 🚀 Step-by-Step Deployment Guide

### Phase 1: Setup Accounts (Day 1)

#### 1.1 Create Service Accounts
```bash
# Required signups:
1. Vercel: https://vercel.com/signup
   - Sign up with GitHub

2. Render.com: https://render.com/
   - Sign up with GitHub

3. MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register
   - Use Google/GitHub signup

4. GitHub: Already have
   - Create organization: "vasukriti-jewels"
```

#### 1.2 Create MongoDB Clusters
```bash
# In MongoDB Atlas Dashboard:

1. Create Cluster "vasukriti-production"
   - Cloud: AWS
   - Region: Mumbai (ap-south-1)
   - Tier: M0 Free
   - Database: vasukriti_prod

2. Create Cluster "vasukriti-staging"
   - Same settings
   - Database: vasukriti_staging

3. Create Database Users:
   - prod_user (read/write on vasukriti_prod)
   - staging_user (read/write on vasukriti_staging)

4. Network Access:
   - Add: 0.0.0.0/0 (Allow from anywhere)
   - Note: For production, whitelist only Render IPs
```

#### 1.3 Setup GitHub Repository
```bash
# Create branches:
git branch development
git branch staging
git branch main

# Push all branches:
git push -u origin development
git push -u origin staging
git push -u origin main

# Branch protection rules (on GitHub):
main:
  - Require pull request reviews
  - Require status checks
  - No direct pushes

staging:
  - Require pull request from development
  
development:
  - Direct pushes allowed
```

---

### Phase 2: Backend Deployment (Day 1-2)

#### 2.1 Prepare Backend for Deployment

**Create `backend/render.yaml`:**
```yaml
services:
  # Production Backend
  - type: web
    name: vasukriti-backend-prod
    env: node
    region: singapore
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_REFRESH_SECRET
        generateValue: true
      - key: FRONTEND_URL
        value: https://vasukritijewels.com
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false
      - key: RAZORPAY_KEY_ID
        sync: false
      - key: RAZORPAY_KEY_SECRET
        sync: false
    healthCheckPath: /health
    
  # Staging Backend
  - type: web
    name: vasukriti-backend-staging
    env: node
    region: singapore
    plan: free
    buildCommand: npm install
    startCommand: npm start
    branch: staging
```

**Create `backend/package.json` scripts:**
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "build": "echo 'No build needed'",
    "seed:prod": "node src/seeds/seedAll.js"
  }
}
```

**Create health check endpoint `backend/src/routes/health.routes.js`:**
```javascript
const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uptime: process.uptime()
  });
});

module.exports = router;
```

#### 2.2 Deploy to Render.com

```bash
# 1. Go to Render Dashboard
# 2. Click "New +" → "Web Service"
# 3. Connect GitHub repository
# 4. Configure:

Name: vasukriti-backend-prod
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
Plan: Free

# 5. Add Environment Variables (one by one):
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<generate-random-string>
JWT_REFRESH_SECRET=<generate-random-string>
FRONTEND_URL=https://vasukritijewels.com
# ... add all others

# 6. Click "Create Web Service"
# 7. Wait for deployment (5-10 minutes)
```

**Get Backend URLs:**
```
Production: https://vasukriti-backend-prod.onrender.com
Staging: https://vasukriti-backend-staging.onrender.com
```

---

### Phase 3: Frontend Deployment (Day 2)

#### 3.1 Prepare Frontend for Deployment

**Update `frontend/.env.production`:**
```env
NEXT_PUBLIC_API_URL=https://vasukriti-backend-prod.onrender.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_***
```

**Update `frontend/.env.staging`:**
```env
NEXT_PUBLIC_API_URL=https://vasukriti-backend-staging.onrender.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_***
```

**Create `frontend/vercel.json`:**
```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["bom1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://vasukriti-backend-prod.onrender.com/api"
  }
}
```

#### 3.2 Deploy to Vercel

```bash
# Install Vercel CLI:
npm install -g vercel

# Login:
vercel login

# Deploy from frontend directory:
cd frontend

# Production deployment:
vercel --prod

# Follow prompts:
? Set up and deploy "~/vasukriti-jewels/frontend"? Y
? Which scope? your-account
? Link to existing project? N
? What's your project's name? vasukriti-jewels
? In which directory is your code located? ./
? Want to override the settings? N
```

**Alternative: Deploy via Vercel Dashboard**
```
1. Go to vercel.com/new
2. Import Git Repository
3. Select vasukriti-jewels
4. Configure:
   - Framework: Next.js
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: .next
5. Add Environment Variables
6. Deploy
```

**Setup Multiple Environments:**
```
1. Go to Project Settings → Git
2. Production Branch: main
3. Add Environment Variables per environment:
   - Production: main branch
   - Staging: staging branch
   - Development: development branch
```

---

### Phase 4: Domain Configuration (Day 2-3)

#### 4.1 Purchase Domain
```bash
# Recommended registrars:
- Namecheap: ~₹800/year for .com
- GoDaddy: ~₹999/year for .com
- Hostinger: ~₹699/year for .com (first year)

Domain: vasukritijewels.com
```

#### 4.2 Configure DNS

**In your domain registrar (e.g., Namecheap):**
```
Type    Name        Value                           TTL
-----------------------------------------------------------
A       @           76.76.21.21 (Vercel IP)        Automatic
CNAME   www         vasukritijewels.vercel.app     Automatic
CNAME   staging     vasukriti-staging.vercel.app   Automatic
CNAME   dev         vasukriti-dev.vercel.app       Automatic
```

**In Vercel Dashboard:**
```
1. Go to Project Settings → Domains
2. Add Domain: vasukritijewels.com
3. Add Domain: www.vasukritijewels.com
4. Add Domain: staging.vasukritijewels.com
5. Add Domain: dev.vasukritijewels.com
6. Wait for SSL certificates (automatic, ~5 minutes)
```

---

### Phase 5: CI/CD Pipeline (Day 3)

#### 5.1 Create GitHub Actions

**`.github/workflows/production.yml`:**
```yaml
name: Production Deployment

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd backend
          npm ci
          
      - name: Run tests
        run: |
          cd backend
          npm test
          
      - name: Lint code
        run: |
          cd backend
          npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    steps:
      - name: Trigger Render deployment
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_PROD }}
```

**`.github/workflows/staging.yml`:**
```yaml
name: Staging Deployment

on:
  push:
    branches: [staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        run: echo "Deploying to staging..."
      # Vercel auto-deploys on push
```

---

## 📊 Monitoring & Maintenance

### Free Monitoring Tools

**1. Vercel Analytics (Free)**
- Page views
- Performance metrics
- Geographic distribution

**2. Render Dashboard**
- CPU & Memory usage
- Response times
- Error rates
- Logs (7 days retention)

**3. MongoDB Atlas Monitoring**
- Database connections
- Query performance
- Storage usage
- Alerts

**4. Uptime Monitoring**
- Use: UptimeRobot (Free)
- Monitor: 50 endpoints
- Check every: 5 minutes
- Alerts: Email/SMS

Setup:
```
1. Sign up: uptimerobot.com
2. Add monitors:
   - https://vasukritijewels.com
   - https://vasukriti-backend-prod.onrender.com/health
   - https://staging.vasukritijewels.com
3. Set alert contacts
```

---

## 🔒 Security Checklist

### Environment Variables Security
```bash
# Never commit:
- .env files
- API keys
- Database credentials
- JWT secrets

# Use environment-specific configs:
✅ Use Vercel/Render environment variables
✅ Different secrets per environment
✅ Rotate secrets quarterly
```

### Production Security
```bash
✅ HTTPS only (automatic on Vercel/Render)
✅ CORS configured properly
✅ Rate limiting enabled
✅ Input validation
✅ SQL injection prevention (Mongoose)
✅ XSS protection (React/Next.js default)
✅ Helmet.js configured
✅ MongoDB IP whitelist (production)
✅ Separate database users per environment
```

---

## 🔄 Deployment Workflow

### Day-to-Day Development Flow

```mermaid
graph LR
    A[Local Development] --> B[Push to development]
    B --> C[Auto-deploy to dev.vasukritijewels.com]
    C --> D[Test on Dev]
    D --> E{Tests Pass?}
    E -->|Yes| F[Create PR to staging]
    E -->|No| A
    F --> G[Review & Merge]
    G --> H[Auto-deploy to staging.vasukritijewels.com]
    H --> I[QA Testing]
    I --> J{Ready for Production?}
    J -->|Yes| K[Create PR to main]
    J -->|No| A
    K --> L[Review & Merge]
    L --> M[Auto-deploy to vasukritijewels.com]
```

### Commands

```bash
# Feature development:
git checkout development
git pull origin development
git checkout -b feature/new-feature
# ... make changes ...
git commit -m "feat: add new feature"
git push origin feature/new-feature
# Create PR to development

# Deploy to staging:
git checkout staging
git merge development
git push origin staging
# Auto-deploys to staging

# Deploy to production:
git checkout main
git merge staging
git push origin main
# Auto-deploys to production
```

---

## 📈 Scaling Plan (When Revenue Grows)

### When to Upgrade

**Upgrade Backend ($7/mo Render Starter) when:**
- Cold starts affecting user experience
- Response times > 2 seconds
- 1000+ daily active users

**Upgrade Database ($9/mo MongoDB M2) when:**
- Storage > 400MB (80% of free tier)
- 100+ concurrent connections
- Slow query performance

**Upgrade Vercel (Pro $20/mo) when:**
- Need team collaboration
- Want advanced analytics
- 100GB bandwidth exceeded

### Long-term Scaling (Year 2+)

**Consider:**
- AWS/Google Cloud: More control, complex setup
- Self-hosted: VPS like DigitalOcean ($6/mo+)
- CDN: Cloudflare (Free tier excellent)
- Redis: Caching layer (Upstash free tier)

---

## 🎯 Implementation Timeline

### Week 1: Setup & Deployment
- **Day 1:** Create accounts, MongoDB clusters
- **Day 2:** Deploy backend to Render
- **Day 3:** Deploy frontend to Vercel
- **Day 4:** Purchase domain, configure DNS
- **Day 5:** Setup monitoring, test all flows
- **Day 6-7:** Bug fixes, optimization

### Week 2: Testing & Launch
- **Day 8-9:** Full QA on staging
- **Day 10-11:** Load testing, security audit
- **Day 12-13:** Final fixes, documentation
- **Day 14:** Production launch 🚀

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] Error logging configured
- [ ] Analytics setup
- [ ] Email service configured (real for production)
- [ ] Payment gateway (live keys for production)
- [ ] SSL certificates active
- [ ] Domain DNS propagated

### Post-Deployment
- [ ] Health checks working
- [ ] All pages loading
- [ ] Authentication working
- [ ] Payment flow tested
- [ ] Email notifications working
- [ ] Mobile responsive
- [ ] SEO meta tags present
- [ ] Performance acceptable (< 3s load)
- [ ] Error tracking active
- [ ] Backup system verified

---

## 🆘 Troubleshooting

### Common Issues

**Backend Cold Starts (Render Free Tier)**
```bash
Problem: First request takes 30-60 seconds
Solution: 
1. Implement health check pinging
2. Use cron-job.org to ping every 14 minutes
3. Add loading states in frontend
4. Upgrade to Starter plan ($7/mo)
```

**MongoDB Connection Issues**
```bash
Problem: Can't connect to database
Solutions:
1. Check IP whitelist (0.0.0.0/0 for Render)
2. Verify connection string
3. Check database user permissions
4. Test connection locally first
```

**Frontend API Calls Failing**
```bash
Problem: API endpoints returning errors
Solutions:
1. Check NEXT_PUBLIC_API_URL is correct
2. Verify CORS configuration in backend
3. Check environment variables deployed
4. Test API directly with Postman
```

---

## 💡 Pro Tips

1. **Use Environment Variables Wisely**
   - Never hardcode URLs
   - Use different values per environment
   - Document all variables

2. **Monitor Early**
   - Set up alerts before launch
   - Track error rates
   - Monitor response times

3. **Backup Strategy**
   - MongoDB Atlas: Automatic backups (free tier)
   - Export database weekly
   - Keep code in Git (obviously!)

4. **Cost Optimization**
   - Start with free tiers
   - Upgrade only when needed
   - Use Cloudinary free tier wisely
   - Optimize images before upload

5. **Performance**
   - Enable Vercel Edge caching
   - Optimize Next.js images
   - Use MongoDB indexes
   - Implement API response caching

---

## 📞 Support & Resources

### Documentation Links
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Next.js Deployment: https://nextjs.org/docs/deployment

### Community Support
- Vercel Discord
- Render Community Forum
- Stack Overflow
- MongoDB Community

---

## Summary: Your First Month FREE ✅

**Month 1 Costs:**
- Vercel: FREE
- Render: FREE (with cold starts)
- MongoDB: FREE (512MB)
- Cloudinary: FREE (25GB)
- Domain: ₹800/year = ₹67/month

**Total: ₹67/month (~$0.80/month)**

**When to Upgrade:**
- If cold starts are annoying: +$7/mo (Render Starter)
- If database is slow: +$9/mo (MongoDB M2)
- If traffic is high: Already good on free tiers!

**Year 1 Total Cost (staying on free tiers): ~₹800 ($10)**

This is the most cost-effective way to launch your e-commerce platform! 🎉
