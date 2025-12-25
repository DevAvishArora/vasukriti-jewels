# Vasukriti Jewels - Premium Online Jewelry Store

A full-stack eCommerce platform for premium jewelry built with Next.js 14, Express.js, MongoDB, and modern web technologies.

## 🎯 Project Overview

Vasukriti Jewels is a luxurious online jewelry store featuring:
- 🎨 Modern, responsive design with light/dark mode
- 🛍️ Complete shopping cart and checkout flow
- 💳 Integrated payment processing (Razorpay)
- 👤 User authentication and profile management
- 📦 Order tracking and management
- ⭐ Product reviews and ratings
- 🔍 Advanced search and filtering
- 📱 Mobile-first responsive design
- 🎭 3D product visualization (Three.js)
- 🎬 Smooth animations (Framer Motion)

## 🛠 Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN UI
- **State Management:** Zustand
- **Data Fetching:** React Query
- **Forms:** React Hook Form + Zod
- **3D Graphics:** Three.js + React Three Fiber
- **Animations:** Framer Motion
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT
- **File Upload:** Cloudinary
- **Payment:** Razorpay
- **Email:** Nodemailer
- **Validation:** Express Validator
- **Security:** Helmet, CORS, Bcrypt

## 📁 Project Structure

```
vasukriti-jewels/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # React components
│   │   │   ├── ui/          # ShadCN UI components
│   │   │   └── layout/      # Layout components
│   │   ├── lib/             # Utility functions
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Zustand stores
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── models/          # MongoDB models
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   └── services/        # Business logic
│   ├── logs/                # Application logs
│   └── package.json
│
└── PROJECT_PLAN.md          # Detailed project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vasukriti-jewels
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Update .env with your configuration
   # - MongoDB URI
   # - JWT secrets
   # - Cloudinary credentials
   # - Email service credentials
   # - Razorpay credentials
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Copy environment variables
   cp .env.example .env.local
   
   # Update .env.local with your configuration
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on: http://localhost:5000

3. **Start Frontend Application**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on: http://localhost:3000

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vasukriti-jewels
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
NEXT_PUBLIC_SITE_NAME=Vasukriti Jewels
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email

More endpoints will be documented as features are implemented.

## 🎨 Design System

- **Primary Color:** Gold (#FFC107)
- **Secondary Color:** Purple (#9C27B0)
- **Fonts:**
  - Headings: Playfair Display (serif)
  - Body: Inter (sans-serif)

## 🗺 Development Roadmap

### ✅ Phase 1: Foundation (COMPLETED)
- [x] Project setup and initialization
- [x] Database models creation
- [x] Authentication system
- [x] Basic frontend structure

### 🚧 Phase 2: Core Features (IN PROGRESS)
- [ ] Product management system
- [ ] Shopping cart functionality
- [ ] Checkout flow
- [ ] Payment integration

### 📋 Phase 3: Advanced Features (UPCOMING)
- [ ] Admin dashboard
- [ ] Order management
- [ ] Review system
- [ ] Search and filters

### 🎯 Phase 4: Enhancement (UPCOMING)
- [ ] 3D product viewer
- [ ] Animations and transitions
- [ ] Email notifications
- [ ] Performance optimization

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Railway/Render)
```bash
cd backend
# Follow platform-specific deployment instructions
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👥 Authors

- Development Team - Vasukriti Jewels

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- ShadCN for the beautiful UI components
- All open-source contributors

## 📞 Support

For support, email support@vasukritijewels.com or create an issue in the repository.

---

**Status:** 🏗️ Foundation Setup Complete - Active Development

**Last Updated:** November 9, 2025
