# Security & Environment Variables Guide

## ✅ What We Fixed

### Removed from Git:
- ❌ `backend/.env.backup` - Contained MongoDB credentials
- ❌ `backend/.env.bak` - Contained MongoDB credentials
- ❌ `backend/.env.email.update` - Contained email passwords
- ❌ `backend/data-export/*.json` - Contained exported database data

### Updated `.gitignore`:
```
# Environment variables (now catches all .env.* files except examples)
.env
.env.*
!.env.example

# Data exports
backend/data-export/
**/data-export/
```

---

## 🔒 Security Best Practices

### 1. Never Commit These Files:
- ❌ `.env` files with real credentials
- ❌ Database backups/exports
- ❌ API keys, secrets, passwords
- ❌ Private keys, certificates
- ❌ User data exports

### 2. Always Use:
- ✅ `.env.example` with placeholder values
- ✅ Environment variables in deployment platforms (Render, Vercel)
- ✅ `.gitignore` to prevent accidents

---

## 📋 Current Environment Variables

### Where Secrets Are Stored (Securely):

**Vercel (Frontend):**
- `NEXT_PUBLIC_API_URL` (different per environment)
- `NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF` (auto-filled by Vercel)

**Render (Backend - 3 services):**
- `MONGODB_URI` (different per environment)
- `JWT_SECRET` (different per environment)
- `JWT_REFRESH_SECRET` (different per environment)
- `CLOUDINARY_*` credentials
- `EMAIL_*` credentials
- `RAZORPAY_*` keys

**MongoDB Atlas:**
- Database connection strings with passwords
- Stored in Render environment variables

---

## 🛡️ What's Protected Now

### Local Files (Not in Git):
```
backend/.env                    ← Your local development config
backend/.env.backup            ← Removed from git
backend/.env.bak               ← Removed from git
backend/data-export/           ← Removed from git
```

### What's Safe in Git:
```
backend/.env.example           ← Example with placeholders ✅
backend/.env.production.example ← Example with placeholders ✅
backend/.env.staging.example   ← Example with placeholders ✅
```

---

## 🚨 If Credentials Are Exposed

If you accidentally commit sensitive data:

### Immediate Actions:

1. **Rotate ALL credentials immediately:**
   - Change MongoDB passwords
   - Generate new JWT secrets
   - Regenerate API keys (Cloudinary, Razorpay)
   - Change email passwords

2. **Remove from Git history:**
   ```bash
   # Install BFG Repo Cleaner
   brew install bfg
   
   # Remove file from history
   bfg --delete-files .env.backup
   
   # Clean up
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   
   # Force push (⚠️ Coordinate with team first!)
   git push --force
   ```

3. **Update all services with new credentials:**
   - Render: Update environment variables
   - Vercel: Update if frontend secrets exposed
   - MongoDB: Change passwords

---

## ✅ Verification Checklist

Run these commands to verify security:

### Check no sensitive files in git:
```bash
git ls-files | grep -E "\.env|data-export"
# Should only show .env.example files
```

### Check .gitignore is working:
```bash
git status
# Should NOT show .env or data-export files
```

### Check what's in your repo on GitHub:
1. Go to your GitHub repository
2. Browse files
3. Verify no `.env.backup`, `.env.bak`, or `data-export` folder

---

## 📝 For New Team Members

### Setting Up Local Environment:

1. **Copy example env:**
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Get credentials from team lead:**
   - MongoDB URI for development
   - Cloudinary keys
   - Razorpay test keys
   - Ethereal email credentials

3. **Never commit your `.env`:**
   - Already in .gitignore ✅
   - Double-check before committing

---

## 🔐 Credential Storage Best Practices

### For Production:
- Use Render/Vercel environment variables
- Enable 2FA on all services
- Use strong, unique passwords
- Store backup of credentials in password manager (1Password, LastPass, etc.)

### For Development:
- Use test/sandbox credentials
- Never use production credentials locally
- Use Ethereal.email for email testing
- Use Razorpay test keys

---

## 📊 What's Safe to Share

### ✅ Safe to Commit:
- Code files (.js, .ts, .tsx, etc.)
- Configuration files without secrets (next.config.ts, tsconfig.json)
- Example env files (.env.example)
- Documentation
- Public assets

### ❌ Never Commit:
- .env files with real values
- Database dumps
- API keys
- Passwords
- User data
- Private keys

---

## 🎯 Quick Reference

### Check before pushing:
```bash
git status
git diff
# Look for any .env or sensitive files
```

### If you see sensitive files:
```bash
git reset HEAD <file>
# or
git rm --cached <file>
```

---

## ✅ Current Status

**Security Status: SECURED** 🔒

- All sensitive files removed from git ✅
- .gitignore updated to prevent future accidents ✅
- Credentials stored securely in Render/Vercel ✅
- Local .env files protected ✅
- Data exports excluded from git ✅

---

**Last Updated:** January 25, 2026
**Next Review:** Monthly security audit recommended
