# 💎 Vasukriti - Client UI Features & Design System

## 🎯 Overview
Premium jewelry e-commerce platform with modern, elegant design focusing on user experience, smooth animations, and conversion optimization.

---

## 🎨 Design Philosophy

### Brand Identity
- **Color Palette:**
  - Primary: Amber/Gold (#D97706, #F59E0B) - Represents luxury and jewelry
  - Secondary: Rose/Pink (#E11D48, #F43F5E) - Adds elegance
  - Accent: Purple (#7C3AED, #A855F7) - Modern touch
  - Neutrals: Gray scale for text and backgrounds
  
- **Typography:**
  - Headings: Playfair Display (serif, elegant)
  - Body: Inter (sans-serif, clean, readable)
  
- **Design Style:**
  - Modern minimalist with luxury touches
  - Generous white space
  - High-quality product photography
  - Smooth animations and micro-interactions
  - Glass morphism effects for cards
  - Gradient accents

---

## 📱 Page Structure & Features

### 1. 🏠 Home Page (`/`)

#### Hero Section
- **Full-screen hero** with video/animated background
- **Headline:** "Timeless Elegance, Crafted for You"
- **Subheadline:** Premium handcrafted jewelry
- **CTA Buttons:** "Shop Now" and "View Collections"
- **Animated elements:** Floating particles, gradient overlays
- **Stats banner:** "5000+ Happy Customers" | "10+ Years Excellence" | "100% Authentic"

#### Featured Collections Carousel
- **Auto-rotating carousel** with manual controls
- **Collection cards** with hover effects
- Categories: Rings, Necklaces, Earrings, Bracelets, Pendants
- "Shop Collection" button on hover
- Smooth transitions with parallax effect

#### Trending Products
- **Grid layout:** 4 columns (desktop), 2 columns (tablet), 1 column (mobile)
- **Product cards** with:
  - Image with zoom on hover
  - Product name
  - Price (with discount if applicable)
  - Rating stars
  - Quick view button
  - Add to cart icon
  - Wishlist icon
- **"View All" button** at bottom

#### Category Showcase
- **Visual grid** with category images
- Hover effects revealing category name and product count
- Direct navigation to category pages

#### Why Choose Us
- **Feature cards:**
  - 🎁 Free Shipping on orders above ₹2999
  - 💎 100% Authentic Products
  - 🔒 Secure Payments
  - ↩️ 7-Day Easy Returns
  - 🏆 Certified Jewelry
  - 📞 24/7 Customer Support

#### Customer Testimonials
- **Carousel format** with customer photos
- Rating, review text, customer name
- Auto-rotating with navigation dots

#### Newsletter Subscription
- Email input with gradient submit button
- "Get 10% off on your first order"
- Subtle animation on focus

#### Instagram Feed
- Grid of latest Instagram posts
- "Follow us @vasukritijewels" heading

---

### 2. 🛍️ Shop Page (`/shop`)

#### Layout
- **Sidebar filters** (collapsible on mobile)
- **Product grid** (main content area)
- **Sticky filter bar** on scroll

#### Filters (Sidebar)
- **Category** (checkboxes with product count)
- **Price Range** (dual slider)
- **Material** (Gold, Silver, Diamond, Platinum, etc.)
- **Occasion** (Wedding, Party, Daily Wear, etc.)
- **Discount** (10% or more, 20% or more, etc.)
- **Availability** (In Stock, Pre-Order)
- **Rating** (4★ & above, 3★ & above)
- **Clear All Filters** button

#### Top Bar
- **Active filter chips** with X to remove
- **Sort dropdown:**
  - Popularity
  - Price: Low to High
  - Price: High to Low
  - Newest First
  - Rating
  - Discount
- **View toggle:** Grid / List view
- **Results count:** "Showing 24 of 156 products"

#### Search Bar
- **Autocomplete** suggestions
- Recent searches
- Popular searches
- Category suggestions
- Product image thumbnails in suggestions

#### Product Grid
- **Lazy loading** for performance
- **Infinite scroll** or pagination
- **Skeleton loaders** while loading
- **Empty state** with suggested products if no results

#### Product Card (Enhanced)
- Image carousel (swipe through multiple images)
- "NEW" / "SALE" / "BESTSELLER" badges
- Wishlist icon (with animation)
- Quick view button
- Hover shows:
  - Add to cart button
  - Quick view icon
  - Size/variant selector (if applicable)
- Rating and review count
- Discount percentage highlighted

---

### 3. 📦 Product Details Page (`/shop/[slug]`)

#### Left Section: Image Gallery
- **Main image** with zoom functionality
- **Thumbnail strip** (vertical or horizontal)
- **Lightbox mode** for full-screen view
- **360° view** option (if available)
- **3D viewer** option (future feature)
- **Video** tab if product video available

#### Right Section: Product Info
- **Product name** (large, bold)
- **Rating stars** (with review count link)
- **Price:**
  - Strikethrough original price
  - Discount price in large text
  - Discount percentage badge
- **"In Stock" / "Only X left"** urgency indicator
- **Product highlights** (bullet points)
- **Specification selector:**
  - Weight (if applicable)
  - Size (for rings)
  - Variants (if multiple designs)
- **Quantity selector** (+ / - buttons)
- **Action buttons:**
  - "Add to Cart" (large, primary)
  - "Buy Now" (secondary)
  - "Add to Wishlist" (outline with heart icon)
- **Share buttons:** WhatsApp, Facebook, Twitter, Copy Link
- **Delivery info:**
  - Pincode checker with estimated delivery date
  - Free delivery badge
- **Trust badges:** Certified, Authentic, Return Policy

#### Tabs Section (Below)
- **Description** tab
  - Rich text with images
  - Care instructions
  - Styling tips
  
- **Specifications** tab
  - Table format
  - Material, Weight, Dimensions, etc.
  
- **Reviews & Ratings** tab
  - Overall rating breakdown (5★, 4★, 3★, etc.)
  - Filter reviews (Most Helpful, Recent, Highest Rated)
  - Review cards with:
    - User name and verified badge
    - Rating stars
    - Review text
    - Review images
    - Helpful count (thumbs up)
  - "Write a Review" button (opens modal)
  
- **Shipping & Returns** tab
  - Shipping policy
  - Return policy
  - Exchange process

#### Related Products
- "You May Also Like" section
- Horizontal scrollable carousel
- Similar products from same category

#### Recently Viewed
- "Recently Viewed Products" section
- Persists across sessions

---

### 4. 🛒 Shopping Cart

#### Cart Drawer (Mobile/Quick View)
- **Slide-in from right**
- Cart items list with thumbnails
- Quantity adjusters
- Remove button
- Subtotal
- "View Cart" and "Checkout" buttons
- "Continue Shopping" link

#### Cart Page (`/cart`)
- **Header:** "Shopping Cart (X items)"
- **Cart items table/cards:**
  - Product image (clickable to product page)
  - Product name
  - Price (per unit)
  - Quantity selector
  - Subtotal
  - Remove button (with confirmation)
- **Move to Wishlist** option
- **Save for Later** option

#### Right Sidebar (Cart Summary)
- **Price Details:**
  - Subtotal
  - Discount (if coupon applied)
  - Shipping charges
  - Tax/GST
  - **Total** (bold, large)
- **Coupon code input**
  - Apply button
  - List of available coupons (expandable)
  - Success/error message
- **Continue Shopping** button (outline)
- **Proceed to Checkout** button (primary, large)

#### Empty Cart State
- Illustration
- "Your cart is empty"
- "Continue Shopping" button
- Recommended products section

---

### 5. 💳 Checkout Page (`/checkout`)

#### Progress Steps
- **Step indicator:** Cart → Shipping → Payment → Confirmation
- Current step highlighted

#### Step 1: Shipping Address
- **Saved addresses** (radio buttons)
- "Add New Address" button opens modal/form:
  - Full Name
  - Phone Number
  - Pincode
  - Address Line 1 & 2
  - City, State (auto-filled from pincode)
  - Address Type (Home/Office)
  - Default address checkbox
- Edit/Delete options for saved addresses

#### Step 2: Order Review
- **Order summary** (mini cart items)
- Option to add gift message
- Edit cart link

#### Step 3: Payment Method
- **Payment options:**
  - 💳 Razorpay (UPI, Cards, Netbanking, Wallets)
  - 💵 Cash on Delivery (if available)
- Payment method descriptions
- "Your payment is secure" badge

#### Right Sidebar (Always visible)
- **Order summary**
- Product images and quantities
- Pricing details
- Delivery date estimate

#### Place Order Button
- Large, prominent
- Loading state during processing
- Disabled until all required fields filled

---

### 6. ✅ Order Confirmation (`/order/success/[orderId]`)

- **Success animation** (checkmark)
- **"Order Placed Successfully!" heading**
- Order number (large, copyable)
- Estimated delivery date
- **Order details:**
  - Items ordered with images
  - Delivery address
  - Payment method
  - Price breakdown
- **Action buttons:**
  - "Track Order"
  - "Download Invoice"
  - "Continue Shopping"
- **What's Next section:**
  - Order confirmation email sent
  - Track your order
  - Prepare for delivery

---

### 7. 👤 User Dashboard (`/account`)

#### Sidebar Navigation
- 📊 Dashboard / Overview
- 📦 My Orders
- ❤️ Wishlist
- 👤 Profile
- 📍 Addresses
- 🔒 Change Password
- 🚪 Logout

#### Dashboard Overview (`/account`)
- **Welcome message** with user name
- **Quick stats cards:**
  - Total Orders
  - Active Orders
  - Wishlist Items
  - Saved Addresses
- **Recent orders** (last 5)
- **Wishlist preview** (top 4 items)

#### My Orders (`/account/orders`)
- **Filter tabs:**
  - All Orders
  - Processing
  - Shipped
  - Delivered
  - Cancelled
- **Order cards:**
  - Order number and date
  - Product images
  - Status badge with progress indicator
  - Total amount
  - "Track Order" button
  - "View Details" button
  - "Cancel Order" (if applicable)
  - "Buy Again" button
- **Pagination** or infinite scroll

#### Order Details (`/account/orders/[orderId]`)
- **Order status timeline:**
  - Order Placed
  - Processing
  - Shipped
  - Out for Delivery
  - Delivered
- **Delivery address**
- **Order items** with images and details
- **Price breakdown**
- **Download Invoice** button
- **Cancel Order** button (if allowed)
- **Track Shipment** button (external tracking link)
- **Need help?** contact support link

#### Wishlist (`/account/wishlist`)
- **Grid of wishlist items**
- Product cards similar to shop page
- "Move to Cart" button
- Remove from wishlist icon
- "Share Wishlist" option
- Empty state with recommended products

#### Profile (`/account/profile`)
- **Profile form:**
  - Profile photo upload
  - Full Name
  - Email (non-editable)
  - Phone Number
  - Date of Birth
  - Gender
- **Update Profile** button
- **Account info:**
  - Member since date
  - Total orders
  - Total spent

#### Addresses (`/account/addresses`)
- **Address cards:**
  - Full address
  - Phone
  - Address type badge (Home/Office)
  - Default badge (if default)
- **Edit** and **Delete** buttons
- **Add New Address** button
- **Set as Default** option

#### Change Password (`/account/password`)
- Current password input
- New password input
- Confirm new password input
- Password strength indicator
- "Update Password" button

---

### 8. 🔍 Search Results (`/search?q=...`)

- Similar layout to Shop page
- **Search query** displayed prominently
- "Showing results for: {query}"
- **Suggestions:** "Did you mean...?" if typo detected
- **Category suggestions**
- **Popular searches** if no results
- All shop page filters available

---

### 9. 📄 Static Pages

#### About Us (`/about`)
- Brand story
- Mission and vision
- Timeline
- Team section
- Certifications and awards

#### Contact Us (`/contact`)
- **Contact form:**
  - Name
  - Email
  - Subject
  - Message
- **Contact information:**
  - Phone
  - Email
  - Address
  - Business hours
- **Google Maps** embed
- **Social media** links

#### FAQs (`/faq`)
- **Searchable FAQ**
- Accordion-style categories:
  - Orders & Shipping
  - Returns & Exchanges
  - Payment & Pricing
  - Product Care
  - Account & Privacy

#### Policies
- **Shipping Policy** (`/policies/shipping`)
- **Return & Refund Policy** (`/policies/returns`)
- **Privacy Policy** (`/policies/privacy`)
- **Terms & Conditions** (`/policies/terms`)

---

## 🧩 Reusable Components

### Navigation Components
- **Header/Navbar**
  - Logo
  - Search bar
  - Navigation links (Shop, Collections, About, Contact)
  - User account dropdown
  - Wishlist icon with count badge
  - Cart icon with count badge
  - Mobile menu toggle

- **Mobile Navigation**
  - Bottom navigation bar (Home, Shop, Cart, Account)
  - Hamburger menu for categories

- **Breadcrumbs**
  - Shows navigation path
  - Clickable links

### Product Components
- **ProductCard** (multiple variants)
  - Compact card
  - Large card with description
  - List view card
  - Wishlist card

- **ProductQuickView Modal**
  - Mini product details
  - Add to cart without leaving page

- **ImageGallery**
  - Thumbnail navigation
  - Zoom functionality
  - Lightbox mode

### UI Elements
- **Button variants:**
  - Primary (gradient)
  - Secondary (outline)
  - Ghost
  - Loading state
  - Icon buttons

- **Input Components:**
  - Text input with validation
  - Number input (quantity)
  - Select dropdown
  - Checkbox
  - Radio button
  - Switch toggle
  - Date picker
  - File upload

- **Feedback Components:**
  - Toast notifications
  - Alert banners
  - Loading spinners
  - Skeleton loaders
  - Progress bars
  - Confirmation modals

- **Rating Component:**
  - Star rating display
  - Interactive star rating (for reviews)
  - Half-star support

- **Badge Component:**
  - Status badges
  - Count badges
  - Discount badges

### Layout Components
- **Container:** Max-width wrapper
- **Grid:** Responsive product grid
- **Card:** Various card styles
- **Modal:** Centered overlay dialog
- **Drawer:** Slide-in panel
- **Tabs:** Tab navigation
- **Accordion:** Collapsible sections

---

## 🎭 Animations & Interactions

### Page Transitions
- **Fade in/out** between routes
- **Slide transitions** for modals and drawers

### Micro-interactions
- **Button hover effects:** Scale, color shift
- **Card hover:** Lift effect, shadow increase
- **Image hover:** Zoom in smoothly
- **Add to cart:** Fly animation to cart icon
- **Wishlist click:** Heart fill animation
- **Loading states:** Skeleton shimmer
- **Success actions:** Checkmark animation
- **Form validation:** Shake on error

### Scroll Animations
- **Parallax effects** on hero images
- **Fade in on scroll** for sections
- **Stagger animations** for product grids
- **Sticky headers** with smooth appearance

### Product Interactions
- **Image zoom** on hover
- **Color/variant selector** with visual feedback
- **Quantity buttons** with smooth increment
- **3D product rotation** (future feature)

---

## 📱 Responsive Design

### Breakpoints
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** 1024px - 1280px
- **Large Desktop:** > 1280px

### Mobile Optimizations
- **Hamburger menu** replaces top navigation
- **Bottom navigation bar** for quick access
- **Simplified filters** (drawer instead of sidebar)
- **Swipeable carousels**
- **Touch-optimized buttons** (larger tap targets)
- **Collapsible sections** to save space
- **Sticky cart button** on product pages

---

## 🚀 Performance Features

### Loading Optimization
- **Lazy loading** for images
- **Infinite scroll** or pagination for product lists
- **Code splitting** by route
- **Image optimization** (WebP, Next.js Image)

### Caching
- **Product data caching**
- **Category caching**
- **Search results caching**

### Progressive Enhancement
- **Works without JavaScript** (basic functionality)
- **Service worker** for offline support (future)

---

## ♿ Accessibility Features

- **Keyboard navigation** support
- **Screen reader** friendly
- **ARIA labels** on interactive elements
- **Focus indicators** visible and clear
- **Alt text** on all images
- **Color contrast** meets WCAG AA standards
- **Skip to content** link

---

## 🔐 Security Features

- **HTTPS only**
- **Secure payment gateway**
- **Input sanitization**
- **XSS prevention**
- **CSRF protection**

---

## 🎯 Conversion Optimization

### Trust Signals
- **Customer reviews** prominently displayed
- **Security badges** on checkout
- **Money-back guarantee**
- **Free shipping** highlighted
- **Customer count** and social proof

### Urgency & Scarcity
- **"Only X left in stock"** indicators
- **Limited time offers** countdown timers
- **Recently sold** notifications
- **Viewing now** count

### Simplified Checkout
- **Guest checkout** option
- **Auto-fill** address from pincode
- **Saved cards** for returning customers
- **Multiple payment options**

---

## 📊 Analytics & Tracking

- **Google Analytics** integration
- **Facebook Pixel** for ads
- **Product view tracking**
- **Cart abandonment tracking**
- **Conversion funnel tracking**
- **Heatmap integration** (Hotjar)

---

## 🎨 Component Library

Using **ShadCN UI** as base:
- Pre-built, accessible components
- Customizable with Tailwind
- TypeScript support
- Dark mode ready (future)

### Additional Libraries
- **Framer Motion:** Animations
- **Swiper:** Carousels
- **React Hook Form:** Form handling
- **Zod:** Schema validation
- **React Query:** Data fetching
- **Zustand:** State management

---

## 🌟 Future Enhancements

### Phase 1 Additions
- [ ] AR/3D product viewer
- [ ] Virtual try-on
- [ ] Voice search
- [ ] Chatbot support
- [ ] Live chat
- [ ] Video shopping
- [ ] Social login
- [ ] Referral program

### Phase 2 Additions
- [ ] Personalized recommendations (AI)
- [ ] Loyalty program
- [ ] Gift registry
- [ ] Subscription boxes
- [ ] Blog/Content marketing
- [ ] Multi-currency support
- [ ] Multi-language support

---

## ✅ Implementation Priority

### MVP (Week 1-2)
1. ✅ Header & Navigation
2. ✅ Footer
3. ✅ Basic Home page
4. ✅ Shop page with filters
5. ✅ Product details page
6. ✅ Shopping cart
7. ✅ Basic checkout flow

### Phase 2 (Week 3-4)
8. User dashboard
9. Order tracking
10. Wishlist functionality
11. Product reviews
12. Search functionality

### Phase 3 (Week 5-6)
13. Advanced animations
14. Mobile optimization
15. Performance optimization
16. SEO optimization
17. Analytics integration

---

## 🎨 Sample Color Schemes

### Light Mode (Primary)
```css
--primary: 217 71% 6%        /* Amber-600 */
--secondary: 348 83% 47%     /* Rose-600 */
--accent: 262 83% 58%        /* Purple-600 */
--background: 0 0% 100%      /* White */
--foreground: 222 47% 11%    /* Gray-900 */
--muted: 210 40% 96%         /* Gray-100 */
```

### Dark Mode (Future)
```css
--primary: 245 62% 51%       /* Amber-400 */
--secondary: 351 95% 71%     /* Rose-400 */
--accent: 263 70% 50%        /* Purple-500 */
--background: 222 47% 11%    /* Gray-900 */
--foreground: 210 40% 98%    /* Gray-50 */
--muted: 217 33% 17%         /* Gray-800 */
```

---

**Status:** Ready for implementation  
**Next Step:** Start building Home page components
