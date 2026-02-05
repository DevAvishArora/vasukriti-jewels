require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

let server;

// Initialize server
const startServer = async () => {
  try {
    console.log('🚀 Starting server initialization...');
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Port: ${PORT}`);
    
    // Connect to database FIRST
    await connectDB();
    
    // Only start server after successful DB connection
    server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log('🎉 Server is ready to accept requests');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    logger.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
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
