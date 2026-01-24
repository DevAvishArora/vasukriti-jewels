# Vercel 3-Environment Setup Guide (Complete Beginner-Friendly)

## 📚 Table of Contents
1. [Understanding the Concept](#understanding-the-concept)
2. [How Vercel Auto-Deployment Works](#how-vercel-auto-deployment-works)
3. [Complete Setup Steps](#complete-setup-steps)
4. [How to Work with 3 Environments](#how-to-work-with-3-environments)
5. [Troubleshooting](#troubleshooting)

---

## Understanding the Concept

### What Are Environments?

Think of environments like different copies of your website:

**🏭 Production (LIVE)**
- Real website that customers see
- Uses real database with real products
- Uses real payment gateway (real money!)
- URL: `vasukriti.store`

**🧪 Staging (TESTING)**
- Exact copy for testing before going live
- Uses test database
- Uses test payment (fake money)
- URL: `staging.vasukriti.store`

**🛠️ Development (PLAYGROUND)**
- Where you build new features
- Uses dev database
- Safe to break things!
- URL: `dev.vasukriti.store`

---

### Why 3 Environments?

**Without 3 environments:**
```
You code → Push to production → 💥 Site breaks → Customers angry!
```

**With 3 environments:**
```
You code → Push to dev → Test
         → Push to staging → More testing
         → Push to production → 🎉 Everything works!
```

---

## How Vercel Auto-Deployment Works

### The Magic Formula

```
Git Branch → Vercel → Automatic Deployment
```

When you push code to ANY branch on GitHub, Vercel automatically:
1. Detects the push
2. Builds your code
3. Deploys it to a URL

**You don't need to do anything!** It's automatic! 🎉

---

### Branch = Environment Mapping

| Git Branch | Vercel Treats It As | Gets Deployed To |
|------------|---------------------|------------------|
| `main` | Production | vasukriti.store |
| `staging` | Preview | staging.vasukriti.store |
| `development` | Preview | dev.vasukriti.store |

---

### Example: What Happens When You Push

**Scenario 1: You push to development branch**
```bash
git checkout development
git add .
git commit -m "new feature"
git push origin development
```

**What Vercel Does Automatically:**
1. ✅ Detects push to `development` branch
2. ✅ Runs `npm install` and `npm run build`
3. ✅ Deploys to `dev.vasukriti.store`
4. ✅ Uses dev backend and dev database

**You get an email:** "Your deployment is ready!"

---

**Scenario 2: You push to staging branch**
```bash
git checkout staging
git merge development  # Bring changes from dev
git push origin staging
```

**What Vercel Does Automatically:**
1. ✅ Detects push to `staging` branch
2. ✅ Builds and deploys to `staging.vasukriti.store`
3. ✅ Uses staging backend and staging database

---

**Scenario 3: You push to main branch (production)**
```bash
git checkout main
git merge staging  # Bring tested changes
git push origin main
```

**What Vercel Does Automatically:**
1. ✅ Detects push to `main` branch
2. ✅ Builds and deploys to `vasukriti.store`
3. ✅ Uses production backend and production database
4. ✅ This is your LIVE website now!

---

## Complete Setup Steps

### ✅ What You Already Have

- ✅ 3 Git branches: `main`, `staging`, `development`
- ✅ 3 MongoDB databases (prod, staging, dev)
- ✅ 3 Backend services on Render (prod, staging, dev)
- ✅ Vercel account and project connected

### 🔧 What We Need to Configure

---

### Step 1: Verify Environment Variables in Vercel

**Go to:** Vercel Dashboard → Your Project → Settings → Environment Variables

**You should have:**

**Variable 1: NEXT_PUBLIC_API_URL**
```
Value: https://vasukriti-backend-prod.onrender.com/api
Environments: ☑️ Production only
```

**Variable 2: NEXT_PUBLIC_API_URL** (yes, same name!)
```
Value: https://vasukriti-backend-staging.onrender.com/api
Environments: ☑️ Preview only
```

This means:
- Production deployments (main branch) → Use production backend
- Preview deployments (staging + dev branches) → Use staging backend

---

### Step 2: Add Smart Branch Detection

We need to tell development branch to use dev backend (not staging).

**Add this variable:**

Click **"Add New"** button:
```
Key: NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF
Value: [Leave completely empty - Vercel fills this automatically]
Environments: ☑️ Production ☑️ Preview ☑️ Development (all three)
```

Click **"Save"**

**What this does:**
- Vercel automatically fills this with the branch name
- Your code can read it and say: "Oh, I'm on development branch, use dev backend!"

---

### Step 3: Update Your Code to Use Smart Detection

**Good news:** I already created this file for you! It's at:
`frontend/src/lib/api-config.ts`

Now we need to use it in your app. Let me check where you currently use the API URL...

**Current code (probably):**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL
```

**New code (use the smart config):**
```typescript
import { API_URL } from '@/lib/api-config'
```

**The smart config automatically:**
- Detects which branch you're on
- Uses the correct backend URL
- No manual configuration needed!

---

### Step 4: Add Custom Domains

Right now, Vercel gives you random URLs like:
- `vasukriti-jewels-abc123.vercel.app`
- `vasukriti-jewels-def456.vercel.app`
- `vasukriti-jewels-ghi789.vercel.app`

Let's make them nice and memorable!

**Go to:** Vercel Dashboard → Your Project → Settings → Domains

#### 4.1 Add Production Domain

1. Click **"Add"** button
2. Enter: `vasukriti.store`
3. Select Git Branch: **`main`** (from dropdown)
4. Click **"Add"**

Vercel will show: "Configure DNS" - we'll do that in Step 5.

#### 4.2 Add Staging Domain

1. Click **"Add"** button again
2. Enter: `staging.vasukriti.store`
3. Select Git Branch: **`staging`**
4. Click **"Add"**

#### 4.3 Add Development Domain

1. Click **"Add"** button again
2. Enter: `dev.vasukriti.store`
3. Select Git Branch: **`development`**
4. Click **"Add"**

**You should now see 3 domains in the list!** ✅

---

### Step 5: Configure DNS in Namecheap

**Go to:** Namecheap Dashboard → Domain List → vasukriti.store → Advanced DNS

#### 5.1 Check Existing Records

You should already have for main domain:
- `A Record` or `CNAME` pointing to Vercel (for `vasukriti.store`)
- `CNAME` for `www` pointing to `cname.vercel-dns.com`

If not, Vercel will tell you what to add.

#### 5.2 Add New Records for Staging and Dev

Click **"Add New Record"** button

**Record 1 - Staging:**
- Type: `CNAME Record`
- Host: `staging`
- Value: `cname.vercel-dns.com`
- TTL: `Automatic`

**Record 2 - Development:**
- Type: `CNAME Record`
- Host: `dev`
- Value: `cname.vercel-dns.com`
- TTL: `Automatic`

Click **"Save All Changes"**

#### 5.3 Wait for DNS Propagation

- Usually takes: 10-60 minutes
- Can take up to: 24-48 hours (rare)
- Check in Vercel: It will show "Valid Configuration" when ready

---

### Step 6: Test Each Environment

After DNS propagates, test each URL:

#### Test Production:
1. Open: `https://vasukriti.store`
2. Open browser console (F12)
3. Look at Network tab
4. You should see API calls going to: `vasukriti-backend-prod.onrender.com`

#### Test Staging:
1. Open: `https://staging.vasukriti.store`
2. Check Network tab
3. API calls should go to: `vasukriti-backend-staging.onrender.com`

#### Test Development:
1. Open: `https://dev.vasukriti.store`
2. Check Network tab
3. API calls should go to: `vasukriti-backend-dev.onrender.com`

---

## How to Work with 3 Environments

### Daily Workflow Example

#### Monday Morning - Start New Feature

```bash
# 1. Switch to development branch
git checkout development

# 2. Make sure you have latest code
git pull origin development

# 3. Create your feature
# ... edit files, add components, etc ...

# 4. Test locally
npm run dev  # Test at localhost:3000

# 5. Commit and push
git add .
git commit -m "feat: add new product filter"
git push origin development
```

**What happens:**
- ✅ Vercel automatically deploys to `dev.vasukriti.store`
- ✅ You get email notification
- ✅ You can test on real URL with dev backend

---

#### Tuesday - Feature Complete, Move to Staging

```bash
# 1. Switch to staging branch
git checkout staging

# 2. Merge development into staging
git merge development

# 3. Push to staging
git push origin staging
```

**What happens:**
- ✅ Vercel automatically deploys to `staging.vasukriti.store`
- ✅ QA team can test it
- ✅ Uses staging database (safe to test)

---

#### Wednesday - All Tests Pass, Go Live!

```bash
# 1. Switch to main (production)
git checkout main

# 2. Merge staging into main
git merge staging

# 3. Push to production
git push origin main
```

**What happens:**
- ✅ Vercel automatically deploys to `vasukriti.store`
- ✅ Feature goes LIVE to customers! 🎉
- ✅ Uses production database and payment

---

### Quick Feature Branch Workflow

Sometimes you want to work on a feature in isolation:

```bash
# Create feature branch from development
git checkout development
git checkout -b feature/new-checkout

# Work on feature...
git add .
git commit -m "work in progress"
git push origin feature/new-checkout
```

**What Vercel does:**
- ✅ Creates a temporary deployment
- ✅ Gives you a URL like: `vasukriti-jewels-feature-new-checkout.vercel.app`
- ✅ Perfect for showing to team before merging!

When feature is done:
```bash
# Merge into development
git checkout development
git merge feature/new-checkout
git push origin development

# Delete feature branch
git branch -d feature/new-checkout
git push origin --delete feature/new-checkout
```

---

### Hotfix Workflow (Emergency Production Fix)

**Oh no! Bug in production!**

```bash
# 1. Create hotfix from main
git checkout main
git checkout -b hotfix/critical-bug

# 2. Fix the bug quickly
# ... fix code ...

# 3. Test locally
npm run dev

# 4. Push to production ASAP
git checkout main
git merge hotfix/critical-bug
git push origin main

# 5. Backport to staging and dev
git checkout staging
git merge hotfix/critical-bug
git push origin staging

git checkout development
git merge hotfix/critical-bug
git push origin development

# 6. Delete hotfix branch
git branch -d hotfix/critical-bug
```

**Result:**
- ✅ Bug fixed in production immediately
- ✅ All environments stay in sync
- ✅ Crisis averted! 🚒

---

## Understanding Vercel Deployments Tab

**Go to:** Vercel Dashboard → Your Project → Deployments

You'll see a list of all deployments. Each deployment shows:

**1. Branch Name:**
- 🌿 `main` = Production
- 🌿 `staging` = Preview
- 🌿 `development` = Preview

**2. Status:**
- ✅ Ready = Successfully deployed
- 🔄 Building = Currently deploying
- ❌ Error = Build failed

**3. Actions (... menu):**
- **Visit** - Open the deployment
- **Inspect** - See build logs
- **Redeploy** - Deploy again (if something went wrong)
- **Promote to Production** - Make this the live site

---

## Common Questions (FAQ)

### Q: Do I need to manually deploy each time?
**A:** No! Vercel deploys automatically when you push to GitHub. Just `git push` and you're done!

### Q: How do I know which backend each environment uses?
**A:** 
- Production (main) → vasukriti-backend-prod.onrender.com
- Staging → vasukriti-backend-staging.onrender.com
- Development → vasukriti-backend-dev.onrender.com

The `api-config.ts` file handles this automatically!

### Q: Can I deploy staging without affecting production?
**A:** Yes! Each branch is completely independent. Pushing to `staging` only affects `staging.vasukriti.store`. Production is safe!

### Q: What if I push to the wrong branch?
**A:** Just revert the commit and push again:
```bash
git revert HEAD
git push origin <branch-name>
```

### Q: How do I see deployment logs?
**A:** 
1. Go to Vercel Dashboard → Deployments
2. Click on any deployment
3. Click "View Build Logs"

### Q: Can I rollback a deployment?
**A:** Yes!
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Q: Do I need to pay for 3 environments?
**A:** No! Vercel free tier allows unlimited deployments and preview URLs!

---

## Troubleshooting

### Problem: Deployment Shows Wrong Branch

**Symptom:** Production shows `deployment-v1` instead of `main`

**Solution:**
1. Push new code to `main` branch
2. Go to Vercel Deployments
3. Find the deployment from `main` branch
4. Click "..." → "Promote to Production"

---

### Problem: Wrong Backend URL Being Used

**Symptom:** Production site calls staging backend

**Check:**
1. Verify environment variables in Vercel
2. Make sure `NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF` is added
3. Check that `api-config.ts` is imported correctly
4. Redeploy the branch

---

### Problem: Domain Not Working

**Symptom:** `staging.vasukriti.store` shows error

**Check:**
1. DNS records in Namecheap (CNAME for staging → cname.vercel-dns.com)
2. Wait 30-60 minutes for DNS propagation
3. Check Vercel Domains tab - should show "Valid Configuration"

**Test DNS:**
```bash
# Check if DNS is working
nslookup staging.vasukriti.store
```

Should return Vercel's IP address.

---

### Problem: Build Fails on Vercel

**Common causes:**
1. Missing environment variables
2. TypeScript errors
3. Missing dependencies

**Solution:**
1. Click on failed deployment
2. Read build logs
3. Fix the error locally
4. Push again

---

## Visual Summary

### Your Complete Setup

```
GitHub Repository
├── main branch
│   └── Auto-deploys to → vasukriti.store (PRODUCTION)
│       └── Uses → vasukriti-backend-prod.onrender.com
│           └── Connects to → Production MongoDB
│
├── staging branch
│   └── Auto-deploys to → staging.vasukriti.store (STAGING)
│       └── Uses → vasukriti-backend-staging.onrender.com
│           └── Connects to → Staging MongoDB
│
└── development branch
    └── Auto-deploys to → dev.vasukriti.store (DEVELOPMENT)
        └── Uses → vasukriti-backend-dev.onrender.com
            └── Connects to → Development MongoDB
```

---

## Quick Reference Commands

### Switch Branches
```bash
git checkout main          # Production
git checkout staging       # Staging
git checkout development   # Development
```

### Check Current Branch
```bash
git branch --show-current
```

### Update from Remote
```bash
git pull origin <branch-name>
```

### Merge Branches
```bash
# Merge dev → staging
git checkout staging
git merge development
git push origin staging

# Merge staging → production
git checkout main
git merge staging
git push origin main
```

### View All Deployments
Go to: https://vercel.com/[your-username]/[project]/deployments

---

## Next Steps

1. ✅ Add `NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF` environment variable
2. ✅ Add custom domains in Vercel
3. ✅ Configure DNS in Namecheap
4. ✅ Wait for DNS propagation
5. ✅ Test all 3 environments
6. ✅ Start your normal development workflow!

---

## Need Help?

**Check Vercel Status:** https://www.vercel-status.com/
**Vercel Docs:** https://vercel.com/docs
**DNS Checker:** https://dnschecker.org/

---

**🎉 Congratulations!** You now have a professional 3-environment deployment setup! Your workflow is now:

```
Code → Dev → Test → Staging → Test → Production → 🚀
```

Happy coding! 💻
