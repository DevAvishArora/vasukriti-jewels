# Performance Optimization Plan
## Vasukriti Jewels - Complete Performance Enhancement Strategy

**Created:** 24 January 2026  
**Status:** Planning Phase  
**Priority:** HIGH - User complaints about slow loading

---

## 🎯 Current Performance Issues

### Identified Problems:
1. **Hero Section** - Takes too long to load on initial page visit
2. **Product Loading** - Products take time to appear
3. **Images** - Large image sizes causing delays
4. **API Response Time** - Backend responses are slow
5. **No Caching** - Every request hits the database
6. **No Optimization** - Missing indexes, no query optimization

---

## 📊 Performance Optimization Strategy

### Phase 1: Backend Optimization (High Priority)
**Estimated Time:** 2-3 hours  
**Impact:** 40-50% improvement

#### 1.1 Database Optimization
- [ ] **Add Database Indexes**
  - Products: `name`, `slug`, `category`, `price`, `createdAt`, `isActive`
  - Categories: `slug`, `name`, `isActive`
  - Orders: `user`, `orderNumber`, `status`, `createdAt`
  - Reviews: `product`, `user`, `isApproved`
  - Users: `email`, `role`
  
- [ ] **Query Optimization**
  - Use `.lean()` for read-only queries (faster, returns plain JS objects)
  - Use `.select()` to fetch only required fields
  - Implement pagination properly with `limit` and `skip`
  - Add `.sort()` indexes for frequently sorted fields

- [ ] **Mongoose Population Optimization**
  - Limit populated fields with `select`
  - Avoid deep population (only 1-2 levels)
  - Cache populated results

#### 1.2 API Response Caching
- [ ] **Implement Redis Caching** (or in-memory cache for free tier)
  - Cache hero sections (5 min TTL)
  - Cache categories (10 min TTL)
  - Cache products list (2 min TTL)
  - Cache single product (5 min TTL)
  - Cache brand story/CMS content (15 min TTL)
  
- [ ] **HTTP Cache Headers**
  - Add `Cache-Control` headers
  - Implement `ETag` for conditional requests
  - Use `304 Not Modified` responses

#### 1.3 API Response Optimization
- [ ] **Reduce Payload Size**
  - Remove unnecessary fields from responses
  - Compress responses with `compression` middleware
  - Use pagination for all list endpoints
  - Implement field selection (`?fields=name,price,image`)

#### 1.4 Backend Performance Monitoring
- [ ] Add response time logging
- [ ] Implement slow query detection
- [ ] Add performance metrics endpoint

---

### Phase 2: Frontend Optimization (High Priority)
**Estimated Time:** 3-4 hours  
**Impact:** 30-40% improvement

#### 2.1 Code Splitting & Lazy Loading
✅ **Already Implemented** in `page.tsx`:
- Hero section loads immediately
- Below-the-fold components lazy loaded
- **Additional Actions:**
  - [ ] Lazy load product images
  - [ ] Lazy load category images
  - [ ] Implement route-based code splitting

#### 2.2 Image Optimization
- [ ] **Next.js Image Optimization**
  ✅ Already using `next/image`
  - [ ] Add proper `sizes` attribute
  - [ ] Implement blur placeholder for all images
  - [ ] Convert images to WebP format
  - [ ] Use responsive image sizes
  
- [ ] **Cloudinary Optimization**
  - [ ] Use Cloudinary transformations (`w_800,f_auto,q_auto`)
  - [ ] Implement lazy loading for below-fold images
  - [ ] Use LQIP (Low Quality Image Placeholder)

#### 2.3 Data Fetching Optimization
- [ ] **Implement SWR or React Query**
  - Client-side caching
  - Automatic revalidation
  - Optimistic updates
  - Deduplication of requests
  
- [ ] **Prefetching**
  - Prefetch product data on hover
  - Preload critical routes
  - Prefetch next page in pagination

#### 2.4 Component Optimization
- [ ] **Memoization**
  - Use `React.memo()` for expensive components
  - Use `useMemo()` for computed values
  - Use `useCallback()` for event handlers
  
- [ ] **Virtual Scrolling**
  - Implement for product grids with 100+ items
  - Use `react-window` or `react-virtual`

#### 2.5 Bundle Optimization
- [ ] **Analyze Bundle Size**
  ```bash
  npm run build
  npx @next/bundle-analyzer
  ```
- [ ] Remove unused dependencies
- [ ] Replace heavy libraries with lighter alternatives
- [ ] Enable tree shaking

---

### Phase 3: Cloudinary & CDN Optimization (Medium Priority)
**Estimated Time:** 1-2 hours  
**Impact:** 20-30% improvement

#### 3.1 Cloudinary Configuration
- [ ] **Automatic Optimizations**
  ```
  f_auto - Auto format (WebP, AVIF)
  q_auto - Auto quality
  dpr_auto - Auto DPR for retina displays
  ```

- [ ] **Responsive Images**
  ```
  w_auto:100:1200 - Responsive width
  c_limit - Don't upscale
  ```

- [ ] **Lazy Loading**
  ```
  loading="lazy"
  e_blur:1000 for placeholder
  ```

#### 3.2 CDN Strategy
- [ ] Verify Vercel CDN is active
- [ ] Add cache headers for static assets
- [ ] Implement asset versioning

---

### Phase 4: Network Optimization (Medium Priority)
**Estimated Time:** 1-2 hours  
**Impact:** 15-20% improvement

#### 4.1 HTTP/2 & Compression
- [ ] Enable HTTP/2 (Vercel does this automatically)
- [ ] Enable Brotli compression
- [ ] Implement GZIP fallback

#### 4.2 Request Optimization
- [ ] **Reduce API Calls**
  - Combine related API calls
  - Implement batch requests
  - Use GraphQL for flexible queries (future)

- [ ] **Request Prioritization**
  - Critical data first (hero, products)
  - Secondary data later (reviews, related products)

#### 4.3 Service Worker (Optional)
- [ ] Implement Next.js PWA
- [ ] Cache API responses offline
- [ ] Preload critical assets

---

### Phase 5: Database & Server Optimization (Medium Priority)
**Estimated Time:** 2-3 hours  
**Impact:** 15-25% improvement

#### 5.1 MongoDB Performance
- [ ] **Connection Pooling**
  - Increase connection pool size
  - Implement connection reuse
  
- [ ] **Aggregation Optimization**
  - Add indexes for aggregation pipelines
  - Limit aggregation stages
  - Use `$match` early in pipeline

- [ ] **Database Monitoring**
  - Enable MongoDB Atlas profiling
  - Monitor slow queries
  - Set up alerts

#### 5.2 Render.com Optimization
- [ ] Upgrade to paid tier for better performance (if budget allows)
- [ ] Enable health check endpoint
- [ ] Implement zero-downtime deployments
- [ ] Monitor server metrics

---

## 🚀 Implementation Priority

### Week 1: Critical Optimizations (Must Have)
1. **Day 1-2: Database Indexes** ⭐⭐⭐
   - Add all critical indexes
   - Test query performance
   - Estimated improvement: 30-40%

2. **Day 3-4: API Response Caching** ⭐⭐⭐
   - Implement in-memory caching
   - Add cache headers
   - Estimated improvement: 20-30%

3. **Day 5-6: Image Optimization** ⭐⭐⭐
   - Cloudinary transformations
   - Lazy loading
   - WebP format
   - Estimated improvement: 25-35%

4. **Day 7: Query Optimization** ⭐⭐
   - Use `.lean()`, `.select()`
   - Optimize populations
   - Estimated improvement: 15-20%

### Week 2: Important Optimizations (Should Have)
5. **Frontend Caching with SWR** ⭐⭐
   - Implement React Query or SWR
   - Client-side caching
   - Estimated improvement: 15-20%

6. **Component Optimization** ⭐⭐
   - Memoization
   - Virtual scrolling
   - Estimated improvement: 10-15%

7. **Bundle Size Reduction** ⭐
   - Analyze and reduce
   - Remove unused code
   - Estimated improvement: 10-15%

### Week 3: Nice to Have
8. **Advanced Caching Strategies** ⭐
9. **Service Worker/PWA** ⭐
10. **Performance Monitoring** ⭐

---

## 📈 Expected Performance Improvements

### Before Optimization (Current State):
- **Hero Section Load:** ~3-4 seconds
- **Product List Load:** ~2-3 seconds  
- **First Contentful Paint (FCP):** ~2.5s
- **Largest Contentful Paint (LCP):** ~4.0s
- **Time to Interactive (TTI):** ~5.0s

### After Phase 1 (Database + Caching):
- **Hero Section Load:** ~1-1.5 seconds ⬇️ 60%
- **Product List Load:** ~1 second ⬇️ 50%
- **FCP:** ~1.5s ⬇️ 40%
- **LCP:** ~2.5s ⬇️ 37%
- **TTI:** ~3.5s ⬇️ 30%

### After All Phases:
- **Hero Section Load:** ~0.5-0.8 seconds ⬇️ 75-80%
- **Product List Load:** ~0.5 seconds ⬇️ 75%
- **FCP:** ~0.8s ⬇️ 68%
- **LCP:** ~1.5s ⬇️ 62%
- **TTI:** ~2.0s ⬇️ 60%

---

## 🛠️ Technical Implementation Details

### 1. Database Indexes Script
```javascript
// backend/src/scripts/add-indexes.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

async function addIndexes() {
  // Products
  await Product.collection.createIndex({ name: 1 });
  await Product.collection.createIndex({ slug: 1 }, { unique: true });
  await Product.collection.createIndex({ category: 1 });
  await Product.collection.createIndex({ price: 1 });
  await Product.collection.createIndex({ createdAt: -1 });
  await Product.collection.createIndex({ isActive: 1 });
  
  // Compound indexes
  await Product.collection.createIndex({ category: 1, isActive: 1, createdAt: -1 });
  await Product.collection.createIndex({ isActive: 1, price: 1 });
  
  // Categories
  await Category.collection.createIndex({ slug: 1 }, { unique: true });
  await Category.collection.createIndex({ isActive: 1 });
  
  // Orders
  await Order.collection.createIndex({ user: 1, createdAt: -1 });
  await Order.collection.createIndex({ orderNumber: 1 }, { unique: true });
  await Order.collection.createIndex({ status: 1 });
}
```

### 2. Caching Middleware
```javascript
// backend/src/middleware/cache.middleware.js
const cache = new Map();

const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    
    if (cached && Date.now() < cached.expiry) {
      return res.json(cached.data);
    }
    
    res.sendResponse = res.json;
    res.json = (data) => {
      cache.set(key, {
        data,
        expiry: Date.now() + duration * 1000
      });
      res.sendResponse(data);
    };
    next();
  };
};
```

### 3. Optimized Product Query
```javascript
// Before
const products = await Product.find({ isActive: true })
  .populate('category')
  .populate('reviews');

// After
const products = await Product.find({ isActive: true })
  .select('name slug price images category')
  .populate('category', 'name slug')
  .lean()
  .limit(12)
  .sort({ createdAt: -1 });
```

### 4. Cloudinary Optimization
```tsx
// Before
<Image src={product.image} alt={product.name} />

// After
<Image 
  src={product.image}
  alt={product.name}
  width={800}
  height={800}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 5. SWR Implementation
```tsx
import useSWR from 'swr';

function ProductList() {
  const { data, error } = useSWR('/api/products', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  });
  
  if (error) return <Error />;
  if (!data) return <Loading />;
  return <Products data={data} />;
}
```

---

## 📋 Testing Checklist

### Performance Testing Tools:
- [ ] **Lighthouse** (Chrome DevTools)
  - Performance score > 90
  - FCP < 1.8s
  - LCP < 2.5s
  - CLS < 0.1

- [ ] **WebPageTest** (webpagetest.org)
  - Test from multiple locations
  - Test on 3G/4G speeds
  - TTFB < 600ms

- [ ] **Chrome DevTools**
  - Network tab (check waterfall)
  - Performance tab (flame graph)
  - Coverage tab (unused code)

### Load Testing:
- [ ] Test with 100 concurrent users
- [ ] Test API endpoints under load
- [ ] Monitor database performance

---

## 🔍 Monitoring & Metrics

### Key Metrics to Track:
1. **Frontend:**
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)
   - Time to Interactive (TTI)
   - Total Blocking Time (TBT)

2. **Backend:**
   - API Response Time (p50, p95, p99)
   - Database Query Time
   - Cache Hit Rate
   - Error Rate

3. **User Experience:**
   - Bounce Rate
   - Time on Page
   - Conversion Rate

### Monitoring Tools:
- [ ] Google Analytics 4
- [ ] Vercel Analytics
- [ ] MongoDB Atlas Monitoring
- [ ] Custom performance logging

---

## 💰 Cost Considerations

### Free Tier (Current):
- **Vercel:** Free hobby plan (sufficient)
- **Render:** Free tier (may need upgrade for better performance)
- **MongoDB Atlas:** Free tier (sufficient for now)
- **Cloudinary:** Free tier (watch quota)

### Recommended Upgrades (If Budget Allows):
1. **Render Pro:** $7/month
   - Better CPU performance
   - Faster cold starts
   - Priority support

2. **MongoDB Atlas M10:** $57/month
   - Dedicated cluster
   - Better performance
   - More storage

3. **Redis Cloud:** Free tier → $5/month
   - Fast caching
   - Better than in-memory

**Total Monthly Cost:** $0 (free tier) → $69 (with upgrades)

---

## 🎯 Success Criteria

### Must Achieve:
- ✅ Hero section loads in < 1.5 seconds
- ✅ Product list loads in < 1 second
- ✅ Lighthouse performance score > 85
- ✅ LCP < 2.5 seconds
- ✅ FCP < 1.8 seconds

### Nice to Have:
- ⭐ Lighthouse performance score > 90
- ⭐ LCP < 2.0 seconds
- ⭐ Sub-second API responses

---

## 📝 Implementation Workflow

### Step-by-Step Process:
1. **Backup Database** ✅
2. **Create Performance Branch** ✅
3. **Implement Phase 1** (Database)
4. **Test & Measure**
5. **Implement Phase 2** (Frontend)
6. **Test & Measure**
7. **Implement Phase 3** (Images)
8. **Test & Measure**
9. **Deploy to Production**
10. **Monitor & Iterate**

### Git Workflow:
```bash
git checkout -b performance-optimization
# Make changes
git commit -m "feat: add database indexes"
git push origin performance-optimization
# Test on preview
# Merge to main
```

---

## 🚨 Risks & Mitigation

### Potential Issues:
1. **Database Migration Risk**
   - Mitigation: Test indexes on development first
   - Rollback plan: Drop indexes if issues arise

2. **Caching Issues**
   - Mitigation: Implement cache invalidation
   - Short TTLs initially

3. **Breaking Changes**
   - Mitigation: Thorough testing
   - Feature flags for new code

4. **CDN Costs**
   - Mitigation: Monitor Cloudinary usage
   - Optimize image sizes

---

## 📚 Resources & References

### Documentation:
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [MongoDB Indexes](https://docs.mongodb.com/manual/indexes/)
- [Cloudinary Optimization](https://cloudinary.com/documentation/image_optimization)
- [Web Vitals](https://web.dev/vitals/)

### Tools:
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)

---

## ✅ Next Steps

**Ready to start?** Review this plan and let me know:
1. Do you approve this plan?
2. Should we start with Phase 1 (Database Optimization)?
3. Any specific concerns or priorities?
4. Do you have budget for any paid tier upgrades?

Once approved, I'll begin implementation starting with the highest-impact optimizations!
