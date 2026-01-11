# Vasukriti - Improvements & Bug Fixes

**Project:** Vasukriti E-commerce Platform  
**Date Created:** December 31, 2025  
**Status:** In Progress

---

## 📋 Overview

This document tracks all improvements, bugs, and feature requests for the Vasukriti project. Items are categorized by priority and type for systematic resolution.

---

## 🎨 Branding & UI Issues

### 1. Brand Name Update ⚡ HIGH PRIORITY
**Current:** "Vasukriti"  
**Required:** "Vasukriti"  
**Scope:**
- Update all instances across frontend
- Header/Navbar logo text
- Footer branding
- Meta tags and SEO
- Email templates
- Admin panel references

**Files to Update:**
- `/frontend/src/components/client/layout/luxury-navbar.tsx`
- `/frontend/src/components/client/layout/mobile-nav.tsx`
- `/frontend/src/components/client/layout/footer.tsx`
- `/frontend/src/app/layout.tsx` (metadata)
- All admin sidebar references

---

## 🔐 Authentication & Security

### 2. Email Verification on Register ⚡ HIGH PRIORITY
**Status:** Missing  
**Required:**
- Send verification email after registration
- User cannot login until email verified
- Resend verification email option
- Verification token expiry (24 hours)

**Implementation:**
- Backend: Email verification endpoint
- Frontend: Verification page UI
- Email template for verification link
- State management for verification status

### 22. Password Change Process 🔧 MEDIUM PRIORITY
**Status:** Needs Implementation  
**Required:**
- Current password validation
- New password confirmation
- Password strength indicator
- Success notification
- Auto-logout after password change (optional)

**Location:** `/frontend/src/app/account/profile/page.tsx`

---

## 💳 Payment Integration

### 3. RazorPay Integration ⚡ HIGH PRIORITY
**Status:** Not Implemented  
**Required:**
- RazorPay account setup
- Payment gateway integration
- Order confirmation flow
- Payment failure handling
- Webhook for payment status
- Test mode and production mode toggle

**Files:**
- Create: `/frontend/src/lib/razorpay.ts`
- Update: `/frontend/src/app/checkout/page.tsx`
- Backend: Payment routes and verification

---

## 🏠 Homepage & Promotional Content

### 4. Promotional Bar - Looping Issue 🐛 BUG
**Current:** Not in continuous loop  
**Required:** Infinite smooth looping of promotional messages  
**Location:** `/frontend/src/components/client/promotional-bar.tsx`

### 5. Promotional Bar CRUD ⚡ HIGH PRIORITY
**Status:** Hardcoded  
**Required:**
- Admin panel to manage promotional messages
- Add/Edit/Delete promotional items
- Enable/Disable toggle
- Display order sorting
- Schedule start/end dates

**Admin Route:** `/admin/promotions`

### 7. Hero Section CRUD 🔧 MEDIUM PRIORITY
**Status:** Static content  
**Required:**
- Admin panel for hero section management
- Upload hero images
- Edit headline and CTA text
- Multiple hero slides management
- Active/Inactive toggle

**Admin Route:** `/admin/hero-sections`

### 8. Edit Static Sections 🔧 MEDIUM PRIORITY
**Status:** Hardcoded  
**Required:**
- About Us section editor
- Why Choose Us section editor
- Brand Story editor
- Rich text editor for content
- Image upload for sections

**Admin Route:** `/admin/content-management`

### 9. Trending Now Design 🎨 UI/UX
**Status:** Needs redesign  
**Required:**
- Improve visual appeal
- Better product card layout
- Add "New" or "Hot" badges
- Smooth animations
- Mobile responsiveness check

**Location:** `/frontend/src/components/client/home/trending-products.tsx`

### 10. Blog Section 🔧 MEDIUM PRIORITY
**Status:** Not Implemented  
**Required:**
- Blog listing page
- Blog detail page
- Blog CRUD in admin panel
- Categories and tags
- Featured image support
- Rich text editor
- SEO optimization

**Routes:**
- `/blog` - Blog listing
- `/blog/[slug]` - Blog detail
- `/admin/blog` - Admin management

---

## 🛍️ Shop & Product Pages

### 6. No Category Name on Images 🐛 BUG
**Location:** Shop section  
**Issue:** Category names not displaying on category images  
**File:** `/frontend/src/app/shop/page.tsx` or category card component  
**Fix:** Ensure category name overlay is visible with proper styling

### 26. Transparent Fix in Shop 🐛 BUG
**Issue:** Some elements have transparency issues  
**Check:**
- Product cards background
- Filter section background
- Modal backgrounds

### 27. Color Filter in Shop ✨ FEATURE
**Status:** Missing  
**Required:**
- Add color filter option in shop sidebar
- Display products by color selection
- Color swatches UI
- Backend: Add color field to products

**Location:** `/frontend/src/app/shop/page.tsx`

### 28. Remove "Unstuck" from Details Page 🐛 BUG
**Location:** Product details page  
**Issue:** "Unstuck" text or element appearing  
**File:** `/frontend/src/app/products/[slug]/page.tsx`

### 29. Photos Setup 🔧 MEDIUM PRIORITY
**Issue:** Photo gallery or image display needs improvement  
**Required:**
- Product image zoom functionality
- Image carousel improvements
- Thumbnail navigation
- Lightbox for full view

### 30. Share on Product Details ✨ FEATURE
**Status:** Not Implemented  
**Required:**
- Share buttons (WhatsApp, Facebook, Twitter, Copy Link)
- Social media meta tags
- Share count tracking (optional)

**Location:** `/frontend/src/app/products/[slug]/page.tsx`

---

## 🛒 Cart & Checkout

### 14. Subtotal Not Calculating 🐛 BUG - HIGH PRIORITY
**Issue:** Cart subtotal calculation incorrect  
**File:** `/frontend/src/app/cart/page.tsx`  
**Check:**
- Price multiplication with quantity
- State management in cart store
- Discount application logic

### 15. Hide Discount Coupons from Cart 🔧 CONFIG
**Current:** Visible  
**Required:** Remove coupon code section from cart page  
**File:** `/frontend/src/app/cart/page.tsx`  
**Action:** Comment out or remove coupon UI section

### 16. Remove GST 🔧 CONFIG
**Current:** 18% GST applied  
**Required:** Remove GST calculation from cart and checkout  
**Files:**
- `/frontend/src/app/cart/page.tsx`
- `/frontend/src/app/checkout/page.tsx`
- Backend order calculation

### 17. Saved Address Not Visible on Checkout 🐛 BUG
**Issue:** User's saved addresses not showing on checkout page  
**File:** `/frontend/src/app/checkout/page.tsx`  
**Check:**
- API call to fetch user addresses
- Address display component
- State management

### 19. Order Placed Redirect ✨ FEATURE
**Current:** No redirect after order  
**Required:**
- Redirect to Thank You page after successful order
- Display order summary
- Order tracking information
- Continue shopping button

**Create:** `/frontend/src/app/orders/thank-you/page.tsx`

### 25. Wishlist in Cart Page ✨ FEATURE
**Status:** Not present  
**Required:**
- Show wishlist items in cart page sidebar
- Quick add to cart from wishlist
- Link to full wishlist page

---

## 👤 User Account & Profile

### 13. Navbar with Username 🎨 UI/UX
**Current:** Generic user icon  
**Required:**
- Display username in navbar when logged in
- User avatar/initial circle
- Dropdown with user options

**File:** `/frontend/src/components/client/layout/luxury-navbar.tsx`

### 23. Edit User Issue 🐛 BUG
**Issue:** User profile editing has problems  
**File:** `/frontend/src/app/account/profile/page.tsx`  
**Check:**
- Form validation
- API call for update
- Error handling
- Success feedback

### 24. Wishlist on Navbar ✨ FEATURE
**Status:** Present but needs improvement  
**Required:**
- Wishlist icon with count badge
- Ensure visibility on all screen sizes
- Heart icon styling

**File:** `/frontend/src/components/client/layout/luxury-navbar.tsx`

---

## 📧 Communication & Newsletter

### 11. Newsletter Configuration 🔧 MEDIUM PRIORITY
**Status:** Hardcoded or not functional  
**Required:**
- Email service integration (MailChimp/SendGrid)
- Admin panel for newsletter management
- Subscriber list management
- Email template editor
- Send newsletter functionality

**Admin Route:** `/admin/newsletter`

### 21. WhatsApp Integration for Contact Us 💬 FEATURE
**Status:** Not Implemented  
**Required:**
- WhatsApp click-to-chat button
- Pre-filled message template
- Contact page integration
- Floating WhatsApp button (optional)

**Location:** `/frontend/src/app/contact/page.tsx`

---

## 🔍 Search & Navigation

### 12. Searchbar Double Cross 🐛 BUG
**Issue:** Two close/clear icons appearing in search bar  
**File:** Search component or `/frontend/src/components/search/`  
**Fix:** Remove duplicate close button

### 31. Dropdown Transparent Issue 🐛 BUG
**Issue:** Dropdown menus have transparency problems  
**Locations:**
- User dropdown menu
- Category dropdown
- Filter dropdowns

**Files to Check:**
- `/frontend/src/components/ui/dropdown-menu.tsx`
- Custom dropdown components
- CSS for `.glass` or transparent classes

---

## ⭐ Reviews & Ratings

### 18. Review Gap 🎨 UI/UX
**Issue:** Spacing or display issue with reviews  
**Location:** Product details page reviews section  
**File:** `/frontend/src/app/products/[slug]/page.tsx`  
**Fix:** Adjust CSS spacing, margins, or review card layout

---

## 📝 Content Management

### 20. FAQ Management 🔧 MEDIUM PRIORITY
**Status:** Static content  
**Required:**
- Admin panel for FAQ management
- Add/Edit/Delete FAQs
- Category-wise FAQs
- Search functionality in FAQs
- Order/sorting of FAQs

**Admin Route:** `/admin/faqs`

---

## 📊 Priority Matrix

### 🔴 Critical (Fix Immediately)
1. Subtotal Not Calculating (#14)
2. Email Verification (#2)
3. RazorPay Integration (#3)
4. Saved Address Not Visible (#17)

### 🟡 High Priority (This Week)
5. Brand Name Update (#1)
6. Promotional Bar CRUD (#5)
7. Remove GST (#16)
8. Hide Discount Coupons (#15)
9. Order Placed Redirect (#19)

### 🟢 Medium Priority (Next Sprint)
10. Hero Section CRUD (#7)
11. Blog Section (#10)
12. FAQ Management (#20)
13. Newsletter Configuration (#11)
14. Edit Static Sections (#8)
15. Password Change Process (#22)

### 🔵 Low Priority (Future Enhancement)
16. Trending Now Design (#9)
17. Color Filter in Shop (#27)
18. Share on Product Details (#30)
19. Wishlist in Cart Page (#25)
20. WhatsApp Integration (#21)

### 🐛 Bugs (Fix ASAP)
- Promotional Bar Loop (#4)
- No Category Name on Images (#6)
- Searchbar Double Cross (#12)
- Transparent Fix in Shop (#26)
- Remove Unstuck (#28)
- Edit User Issue (#23)
- Review Gap (#18)
- Dropdown Transparent Issue (#31)

---

## 📁 Estimated File Changes

### Frontend Files
- Layout Components: 8 files
- Page Components: 15 files
- New Admin Pages: 6 files
- UI Components: 5 files
- Store/State: 3 files

### Backend Files
- New Routes: 8 routes
- Email Service: 3 files
- Payment Integration: 4 files
- CRUD Operations: 10 endpoints

---

## ✅ Progress Tracking

- [ ] Critical Issues (0/4)
- [ ] High Priority (0/5)
- [ ] Medium Priority (0/8)
- [ ] Low Priority (0/4)
- [ ] Bug Fixes (0/8)

**Total Items:** 31  
**Completed:** 0  
**In Progress:** 0  
**Pending:** 31

---

## 📝 Notes

- Backup database before major changes
- Test payment integration in test mode first
- Keep staging environment in sync
- Document all API changes
- Update postman collection after backend changes

---

**Last Updated:** December 31, 2025  
**Next Review:** After completing critical items
