# 📋 Pre-Deployment Checklist

Complete this checklist before deploying to production.

## 🔐 Security

### Environment Variables
- [ ] All `.env` files added to `.gitignore`
- [ ] No secrets committed to Git
- [ ] Strong JWT secrets generated (32+ characters)
- [ ] Different secrets for each environment
- [ ] Production secrets stored securely

### API Security
- [ ] CORS configured with specific origins
- [ ] Rate limiting enabled
- [ ] Helmet.js security headers active
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS protection enabled
- [ ] CSRF protection for state-changing operations

### Authentication
- [ ] Password hashing with bcrypt (salt rounds ≥ 10)
- [ ] JWT expiration configured (15 minutes for access)
- [ ] Refresh tokens implemented (7 days)
- [ ] Email verification required for checkout
- [ ] Password reset flow tested
- [ ] Session management secure

### Database
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Different database for each environment
- [ ] Database user has minimum required permissions
- [ ] Automatic backups enabled
- [ ] Connection string doesn't expose credentials

---

## 🎨 Frontend

### Configuration
- [ ] Environment variables set for production
- [ ] API URL points to production backend
- [ ] Razorpay LIVE keys configured
- [ ] Analytics ID added (Google Analytics, if using)
- [ ] Error boundary implemented
- [ ] 404 page exists
- [ ] Loading states for all async operations

### Performance
- [ ] Images optimized (< 200KB each)
- [ ] Next.js Image component used
- [ ] Lazy loading for heavy components
- [ ] Code splitting configured
- [ ] Bundle size < 500KB (check with `npm run build`)
- [ ] Lighthouse score > 90

### SEO
- [ ] Meta tags on all pages
- [ ] Open Graph tags for social sharing
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Canonical URLs set
- [ ] Schema.org markup for products

### Accessibility
- [ ] Alt text on all images
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA
- [ ] Form validation messages clear

### Testing
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Forms submit properly
- [ ] Authentication flow complete
- [ ] Cart functionality works
- [ ] Checkout process tested (with test cards)
- [ ] Mobile responsive (test on real device)
- [ ] Cross-browser tested (Chrome, Firefox, Safari)

---

## ⚙️ Backend

### Configuration
- [ ] Environment variables set for production
- [ ] NODE_ENV=production
- [ ] Database connection tested
- [ ] Email service configured (real, not Ethereal)
- [ ] Cloudinary production account setup
- [ ] Razorpay LIVE keys configured
- [ ] Frontend URL correctly set

### API Endpoints
- [ ] All routes protected with authentication where needed
- [ ] Admin routes restricted to admin role
- [ ] Input validation on all POST/PUT requests
- [ ] Error handling comprehensive
- [ ] Success responses consistent
- [ ] HTTP status codes appropriate

### Database
- [ ] Indexes created for frequently queried fields
- [ ] Migrations run (if any)
- [ ] Seed data loaded (categories, settings)
- [ ] Test data removed
- [ ] Connection pooling configured

### Email
- [ ] Welcome email works
- [ ] Verification email sends
- [ ] Order confirmation email sends
- [ ] Password reset email works
- [ ] Email templates tested
- [ ] Real email service configured (not test)

### Payments
- [ ] Razorpay integration tested
- [ ] Order creation on successful payment
- [ ] Payment failure handling
- [ ] Refund process documented
- [ ] Webhooks configured (if using)
- [ ] LIVE keys used (not test)

### Testing
- [ ] Health check endpoint works: `/api/health`
- [ ] All CRUD operations tested
- [ ] Authentication endpoints work
- [ ] File uploads working (Cloudinary)
- [ ] Error logging configured
- [ ] Load tested (basic, using tools like k6 or Artillery)

---

## 🚀 Deployment

### Git
- [ ] All changes committed
- [ ] Branches created (main, staging, development)
- [ ] `.gitignore` updated
- [ ] No sensitive data in commits
- [ ] Commit messages descriptive

### Backend (Render)
- [ ] Service created
- [ ] Environment variables set
- [ ] Health check path configured: `/api/health`
- [ ] Auto-deploy enabled
- [ ] Region selected (Singapore recommended)
- [ ] Deployment successful
- [ ] API accessible via Render URL

### Frontend (Vercel)
- [ ] Project created
- [ ] Environment variables set
- [ ] Build command correct: `npm run build`
- [ ] Output directory correct: `.next`
- [ ] Auto-deploy enabled
- [ ] Deployment successful
- [ ] Site accessible via Vercel URL

### Database (MongoDB Atlas)
- [ ] Production cluster created
- [ ] Region: Mumbai (for India)
- [ ] Tier: M0 Free or higher
- [ ] Database user created
- [ ] Network access: 0.0.0.0/0 (or Render IPs)
- [ ] Connection string obtained
- [ ] Automatic backups enabled (free tier has it)
- [ ] Alerts configured for storage/CPU

---

## 🌐 Domain & DNS

### Domain
- [ ] Domain purchased (vasukritijewels.com)
- [ ] Domain registrar account accessible
- [ ] Domain renewal date noted

### DNS Configuration
- [ ] A record points to Vercel
- [ ] CNAME for www configured
- [ ] Subdomain for staging (optional)
- [ ] SSL certificate issued (automatic on Vercel)
- [ ] DNS propagated (check with: https://dnschecker.org)

### Vercel Domain Setup
- [ ] Domain added to Vercel project
- [ ] SSL certificate active (https works)
- [ ] Redirects configured (www to non-www or vice versa)

---

## 📊 Monitoring

### Health Checks
- [ ] UptimeRobot or similar service configured
- [ ] Monitor backend: `/api/health`
- [ ] Monitor frontend homepage
- [ ] Alert contacts added (email/SMS)
- [ ] Check interval: 5-15 minutes

### Error Tracking
- [ ] Error logging configured (Winston for backend)
- [ ] Frontend error boundary catches errors
- [ ] Render logs accessible
- [ ] Vercel logs accessible
- [ ] MongoDB alerts enabled

### Analytics
- [ ] Google Analytics installed (optional)
- [ ] Vercel Analytics enabled
- [ ] Conversion tracking setup
- [ ] Goals/funnels configured

---

## 📧 Email

### Production Email Service
- [ ] Real email service configured (not Ethereal)
- [ ] SendGrid/Gmail/AWS SES account created
- [ ] SMTP credentials added to environment
- [ ] From address verified
- [ ] SPF/DKIM records configured (advanced)
- [ ] Test email sent successfully

### Email Templates
- [ ] Welcome email tested
- [ ] Verification email tested
- [ ] Order confirmation tested
- [ ] Shipping notification tested
- [ ] Password reset tested
- [ ] All emails mobile-responsive

---

## 💳 Payment Gateway

### Razorpay Setup
- [ ] Account verified
- [ ] LIVE mode activated
- [ ] API keys generated (LIVE)
- [ ] Webhook configured (if using)
- [ ] Test payment processed
- [ ] Payment methods enabled (cards, UPI, wallets)
- [ ] Settlement account verified

### Order Flow
- [ ] Order creation tested
- [ ] Payment success handling
- [ ] Payment failure handling
- [ ] Order status updates
- [ ] Email notifications working
- [ ] Inventory deduction working

---

## 📱 Mobile

### Responsive Design
- [ ] Tested on iOS (Safari)
- [ ] Tested on Android (Chrome)
- [ ] Touch targets large enough (44x44px minimum)
- [ ] Text readable without zooming
- [ ] Forms easy to fill on mobile
- [ ] Images load quickly
- [ ] Navigation accessible

### Progressive Web App (Optional)
- [ ] Manifest.json configured
- [ ] Service worker registered
- [ ] Offline fallback page
- [ ] Add to home screen works
- [ ] Push notifications (if implemented)

---

## 🧪 Testing

### Manual Testing
- [ ] Register new user
- [ ] Login with new user
- [ ] Verify email
- [ ] Browse products
- [ ] Add to cart
- [ ] Update cart quantity
- [ ] Remove from cart
- [ ] Proceed to checkout
- [ ] Fill shipping details
- [ ] Complete payment (test mode first)
- [ ] Receive order confirmation email
- [ ] View order in admin panel

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### Performance Testing
- [ ] Lighthouse score > 90
- [ ] Page load time < 3 seconds
- [ ] Time to Interactive < 5 seconds
- [ ] No console errors
- [ ] No broken links
- [ ] Images optimized

---

## 📄 Documentation

### Code Documentation
- [ ] README.md updated
- [ ] API documentation available
- [ ] Environment variables documented
- [ ] Deployment guide written
- [ ] Architecture diagram created (optional)

### Admin Documentation
- [ ] Admin user guide
- [ ] How to add products
- [ ] How to manage orders
- [ ] How to handle refunds
- [ ] How to access analytics

### User Documentation
- [ ] FAQ page
- [ ] Shipping policy
- [ ] Return policy
- [ ] Privacy policy
- [ ] Terms of service
- [ ] Contact information

---

## 🔄 CI/CD

### GitHub Actions
- [ ] Workflow files created
- [ ] Tests run on PR
- [ ] Auto-deploy on merge to main
- [ ] Build status badge in README (optional)
- [ ] Secrets configured in GitHub

### Automated Testing
- [ ] Unit tests written (optional for MVP)
- [ ] Integration tests (optional)
- [ ] E2E tests (optional)
- [ ] Tests run in CI pipeline

---

## 🎉 Launch

### Pre-Launch
- [ ] All checklist items above completed
- [ ] Test payment with real card (small amount)
- [ ] Backup plan ready if something breaks
- [ ] Support email/phone ready
- [ ] Team briefed on launch

### Launch Day
- [ ] Monitor logs closely
- [ ] Check error rates
- [ ] Verify orders are being created
- [ ] Test from multiple devices
- [ ] Share on social media
- [ ] Inform customers

### Post-Launch (First 48 hours)
- [ ] Monitor traffic
- [ ] Check for errors
- [ ] Respond to user feedback
- [ ] Fix critical bugs immediately
- [ ] Celebrate! 🎊

---

## 🆘 Emergency Contacts

- **Domain Registrar:** _______________
- **Vercel Support:** support@vercel.com
- **Render Support:** support@render.com
- **MongoDB Support:** https://support.mongodb.com
- **Razorpay Support:** _______________
- **Your Team:** _______________

---

## 📈 Post-Deployment

### Week 1
- [ ] Monitor error rates daily
- [ ] Check user feedback
- [ ] Fix critical bugs
- [ ] Optimize based on analytics

### Month 1
- [ ] Review analytics
- [ ] Gather user feedback
- [ ] Plan improvements
- [ ] Consider upgrades if needed

### Ongoing
- [ ] Weekly deployments (staging)
- [ ] Bi-weekly production releases
- [ ] Monthly security updates
- [ ] Quarterly feature releases

---

**Date Completed:** __________  
**Deployed By:** __________  
**Production URL:** __________  
**Launch Date:** __________

---

🚀 Ready to launch? Double-check everything above, then go for it!
