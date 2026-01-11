# 🚀 Quick Start Guide - Vasukriti

## Initial Setup Complete! ✅

The foundation of your jewelry eCommerce platform is ready. Here's what has been set up:

### ✅ Backend (Express.js + MongoDB)
- Express server with security middleware
- MongoDB database models (User, Product, Order, Cart, etc.)
- JWT authentication system
- API routes for authentication
- Error handling and logging
- Rate limiting
- File upload configuration (Cloudinary)

### ✅ Frontend (Next.js 14)
- Next.js with TypeScript
- Tailwind CSS + ShadCN UI components
- State management (Zustand)
- Type definitions
- Auth store and cart store
- Axios instance with token refresh

## 🏃 Running the Project

### Step 1: Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) - update MONGODB_URI in .env
```

### Step 2: Start Backend Server
```bash
cd backend
npm run dev
```

The backend will start on **http://localhost:5000**

You should see:
```
Server running on http://localhost:5000
MongoDB Connected: localhost
```

### Step 3: Start Frontend Application
Open a new terminal:
```bash
cd frontend
npm run dev
```

The frontend will start on **http://localhost:3000**

## 🔍 Testing the Setup

### Test Backend Health
Visit: http://localhost:5000/health

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-09T..."
}
```

### Test Frontend
Visit: http://localhost:3000

You should see the Vasukriti landing page with project status.

## 📝 Next Development Steps

### Phase 2: Core Features
1. **Product Management**
   - Create product controllers and routes
   - Build admin product forms
   - Implement image upload
   - Create product listing pages

2. **Shopping Cart**
   - Implement cart API endpoints
   - Create cart UI components
   - Add cart persistence

3. **Checkout Flow**
   - Build checkout pages
   - Integrate Razorpay payment
   - Create order confirmation

### Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm start            # Start production server

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔧 Configuration Checklist

Before going to production, update these in `.env` files:

### Backend
- [ ] Change JWT secrets to strong random strings
- [ ] Set up Cloudinary account and add credentials
- [ ] Configure email service (Gmail/SendGrid)
- [ ] Set up Razorpay account and add keys
- [ ] Update FRONTEND_URL to your domain

### Frontend
- [ ] Update API_URL to your backend domain
- [ ] Add Cloudinary cloud name
- [ ] Add Razorpay public key
- [ ] Add Google Analytics ID (optional)

## 📚 Important Files to Know

### Backend
- `backend/server.js` - Entry point
- `backend/src/app.js` - Express app configuration
- `backend/src/routes/auth.routes.js` - Auth routes
- `backend/src/models/` - Database models
- `backend/src/controllers/` - Business logic
- `backend/.env` - Environment variables

### Frontend
- `frontend/src/app/layout.tsx` - Root layout
- `frontend/src/app/page.tsx` - Home page
- `frontend/src/store/` - State management
- `frontend/src/types/` - TypeScript types
- `frontend/src/lib/axios-instance.ts` - API client
- `frontend/.env.local` - Environment variables

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify .env file exists with correct variables
- Ensure port 5000 is not in use

### Frontend won't start
- Verify .env.local file exists
- Clear .next folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Database connection issues
- Check MongoDB is running: `mongod`
- Verify MONGODB_URI in .env
- Check if port 27017 is accessible

### CORS errors
- Verify FRONTEND_URL in backend .env matches your frontend URL
- Check CORS configuration in `backend/src/app.js`

## 📞 Need Help?

Refer to the detailed `PROJECT_PLAN.md` for:
- Complete feature specifications
- Database schema details
- API endpoint documentation
- Design system guidelines
- Deployment instructions

## 🎯 Development Tips

1. **Use the Project Plan**: `PROJECT_PLAN.md` contains detailed implementation guidelines
2. **Test as you build**: Test each feature before moving to the next
3. **Commit often**: Use meaningful commit messages
4. **Follow TypeScript**: Maintain type safety in frontend code
5. **API first**: Build and test API endpoints before frontend integration

## 🎉 You're Ready to Build!

The foundation is solid. Start implementing features according to the roadmap in `PROJECT_PLAN.md`.

Happy coding! 💎✨
