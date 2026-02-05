require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

let server;
let isDBConnected = false;

// Initialize server
const startServer = async () => {
  console.log('🚀 Starting server initialization...');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Port: ${PORT}`);
  
  try {
    // Try to connect to database with retries
    await connectDB();
    isDBConnected = true;
  } catch (error) {
    console.error('❌ Initial database connection failed:', error.message);
    logger.error(`Database connection failed: ${error.message}`);
    
    if (isProduction) {
      // In production, start server anyway but keep retrying connection in background
      console.log('\n⚠️  Starting server WITHOUT database connection...');
      console.log('📡 Will continue attempting to connect in background...');
      
      // Continue trying to connect in background
      retryConnectionInBackground();
    } else {
      // In development, fail fast
      console.error('\n❌ Exiting: Cannot start development server without database');
      process.exit(1);
    }
  }
  
  // Start HTTP server
  server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`✅ Server running on http://localhost:${PORT}`);
    if (isDBConnected) {
      console.log('🎉 Server is ready to accept requests');
    } else {
      console.log('⚠️  Server is listening but database is not connected yet');
    }
  });
};

// Background retry function for production
const retryConnectionInBackground = async () => {
  let attempt = 0;
  const maxAttempts = 20; // Try for ~10 minutes
  const retryDelay = 30000; // 30 seconds between attempts
  
  const retry = async () => {
    attempt++;
    if (attempt > maxAttempts) {
      console.error('❌ Exceeded maximum reconnection attempts');
      logger.error('Database reconnection failed after maximum attempts');
      return;
    }
    
    try {
      console.log(`\n🔄 Background reconnection attempt ${attempt}/${maxAttempts}...`);
      await connectDB(3, 5000); // 3 retries with 5 second delays
      isDBConnected = true;
      console.log('✅ Database connected successfully in background!');
      logger.info('Database reconnected successfully');
    } catch (error) {
      console.error(`❌ Background connection attempt ${attempt} failed`);
      console.log(`⏳ Next attempt in ${retryDelay / 1000} seconds...`);
      setTimeout(retry, retryDelay);
    }
  };
  
  setTimeout(retry, retryDelay);
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  console.log('Shutting down server due to unhandled promise rejection');
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  console.log('Shutting down server due to uncaught exception');
  process.exit(1);
});
