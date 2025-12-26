const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middleware/error.middleware');
const { apiLimiter } = require('./middleware/rateLimit.middleware');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(helmet()); // Security headers

// CORS configuration - allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
  'https://vasukriti.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Cookie parser

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }));
}

// Rate limiting
app.use('/api', apiLimiter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/customers', require('./routes/customer.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/inventory', require('./routes/inventory.routes'));
app.use('/api/coupons', require('./routes/coupon.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/addresses', require('./routes/address.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/payment', require('./routes/payment.routes'));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Vasukriti Jewels API',
    version: '1.0.0',
  });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
