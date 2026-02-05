const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 5000) => {
  // Check if MONGODB_URI is defined
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  // Set mongoose options
  mongoose.set('strictQuery', false);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Connecting to MongoDB... (Attempt ${attempt}/${retries})`);
      console.log('Connection string:', process.env.MONGODB_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@'));
      
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000, // 30 seconds
        socketTimeoutMS: 45000, // 45 seconds
        family: 4, // Use IPv4, skip trying IPv6
        maxPoolSize: 10,
        minPoolSize: 5,
        retryWrites: true,
        retryReads: true,
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);
      
      // Handle connection events
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });
      
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
      });

      return conn;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${attempt} failed:`);
      console.error(`Error: ${error.message}`);
      
      if (attempt === retries) {
        console.error('\n⚠️  All connection attempts failed.');
        console.error('Stack:', error.stack);
        
        // Check for common errors
        if (error.message.includes('IP') || error.message.includes('whitelist')) {
          console.error('\n💡 SOLUTION: Add Render\'s IP to MongoDB Atlas whitelist:');
          console.error('   1. Go to MongoDB Atlas → Network Access');
          console.error('   2. Click "Add IP Address"');
          console.error('   3. Select "Allow Access from Anywhere" (0.0.0.0/0)');
          console.error('   4. Or add specific Render IPs from: https://render.com/docs/static-outbound-ip-addresses\n');
        }
        
        throw error;
      }
      
      // Exponential backoff: wait before retrying
      const waitTime = delay * attempt;
      console.log(`⏳ Retrying in ${waitTime / 1000} seconds...\n`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
};

module.exports = connectDB;
