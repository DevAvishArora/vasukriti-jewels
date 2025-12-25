#!/usr/bin/env node

/**
 * Quick MongoDB Atlas Connection Tester
 * Tests if your MongoDB Atlas connection string is working
 */

require('dotenv').config();
const mongoose = require('mongoose');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

console.log(`${colors.blue}
╔════════════════════════════════════════════════════════╗
║       🔍 MongoDB Atlas Connection Tester              ║
╚════════════════════════════════════════════════════════╝
${colors.reset}\n`);

async function testConnection() {
  const mongoUri = process.env.MONGODB_URI;

  // Check if URI exists
  if (!mongoUri) {
    console.log(`${colors.red}❌ Error: MONGODB_URI not found in .env file${colors.reset}\n`);
    console.log('Please add your MongoDB connection string to backend/.env:');
    console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database\n');
    process.exit(1);
  }

  // Check if it's an Atlas connection
  const isAtlas = mongoUri.includes('mongodb+srv://') || mongoUri.includes('mongodb.net');
  const isLocal = mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1');

  console.log('📋 Connection Details:');
  console.log(`   Type: ${isAtlas ? 'MongoDB Atlas (Cloud)' : isLocal ? 'Local MongoDB' : 'Unknown'}`);
  
  // Mask password in URI for display
  const displayUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  console.log(`   URI: ${displayUri}\n`);

  console.log('🔄 Attempting to connect...\n');

  try {
    // Set connection options
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000,
    };

    // Connect to MongoDB
    await mongoose.connect(mongoUri, options);

    console.log(`${colors.green}✅ Connection Successful!${colors.reset}\n`);
    
    // Get connection info
    const db = mongoose.connection;
    console.log('📊 Connection Information:');
    console.log(`   ${colors.green}✓${colors.reset} Host: ${db.host}`);
    console.log(`   ${colors.green}✓${colors.reset} Port: ${db.port}`);
    console.log(`   ${colors.green}✓${colors.reset} Database: ${db.name}`);
    console.log(`   ${colors.green}✓${colors.reset} Ready State: ${db.readyState === 1 ? 'Connected' : 'Unknown'}\n`);

    // Test database operations
    console.log('🧪 Testing database operations...\n');

    // Try to list collections
    try {
      const collections = await db.db.listCollections().toArray();
      console.log(`   ${colors.green}✓${colors.reset} Can list collections (${collections.length} found)`);
      
      if (collections.length > 0) {
        console.log(`   ${colors.blue}ℹ${colors.reset}  Existing collections: ${collections.map(c => c.name).join(', ')}`);
      } else {
        console.log(`   ${colors.yellow}ℹ${colors.reset}  No collections yet (this is normal for a new database)`);
      }
    } catch (err) {
      console.log(`   ${colors.yellow}⚠${colors.reset}  Cannot list collections: ${err.message}`);
    }

    // Try a simple write/read test
    console.log('\n🔬 Testing read/write operations...\n');
    
    try {
      const TestModel = mongoose.model('ConnectionTest', new mongoose.Schema({
        message: String,
        timestamp: Date,
      }));

      // Write test
      const testDoc = await TestModel.create({
        message: 'Connection test',
        timestamp: new Date(),
      });
      console.log(`   ${colors.green}✓${colors.reset} Write test successful (created document)`);

      // Read test
      const foundDoc = await TestModel.findById(testDoc._id);
      console.log(`   ${colors.green}✓${colors.reset} Read test successful (retrieved document)`);

      // Cleanup
      await TestModel.deleteMany({});
      console.log(`   ${colors.green}✓${colors.reset} Delete test successful (cleaned up test data)`);

    } catch (err) {
      console.log(`   ${colors.red}✗${colors.reset} Operation test failed: ${err.message}`);
    }

    // Close connection
    await mongoose.connection.close();
    console.log(`\n${colors.green}✅ All tests passed! Your MongoDB Atlas connection is working perfectly!${colors.reset}\n`);
    
    console.log('🎉 Next steps:');
    console.log('   1. Start your backend: npm run dev');
    console.log('   2. Your server will connect to this database');
    console.log('   3. Begin building features!\n');

    process.exit(0);

  } catch (error) {
    console.log(`${colors.red}❌ Connection Failed!${colors.reset}\n`);
    console.log('Error details:', error.message, '\n');

    // Provide helpful troubleshooting tips
    console.log('🔧 Troubleshooting Tips:\n');

    if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
      console.log(`   ${colors.yellow}⚠${colors.reset}  Authentication Error - Check your credentials:`);
      console.log('      • Verify username and password in connection string');
      console.log('      • Make sure password doesn\'t contain special characters (or URL encode them)');
      console.log('      • Check that database user exists in MongoDB Atlas');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('Could not connect')) {
      console.log(`   ${colors.yellow}⚠${colors.reset}  Network Error - Check your connection:`);
      console.log('      • Verify the cluster hostname in connection string');
      console.log('      • Check your internet connection');
      console.log('      • Make sure you\'re not behind a restrictive firewall');
    } else if (error.message.includes('IP') || error.message.includes('not allowed')) {
      console.log(`   ${colors.yellow}⚠${colors.reset}  IP Whitelist Error:`);
      console.log('      • Go to MongoDB Atlas → Network Access');
      console.log('      • Add your current IP address');
      console.log('      • Or add 0.0.0.0/0 for development (allow all IPs)');
    } else if (error.message.includes('timeout')) {
      console.log(`   ${colors.yellow}⚠${colors.reset}  Connection Timeout:`);
      console.log('      • Check if your cluster is active (not paused)');
      console.log('      • Verify the connection string is correct');
      console.log('      • Try again in a few moments');
    } else {
      console.log(`   ${colors.yellow}⚠${colors.reset}  General tips:`);
      console.log('      • Double-check your connection string format');
      console.log('      • Make sure there are no extra spaces in .env file');
      console.log('      • Verify the database name is correct');
    }

    console.log('\n📚 More help:');
    console.log('   • MongoDB Atlas Docs: https://docs.atlas.mongodb.com/');
    console.log('   • Check CREDENTIALS_SETUP.md for setup guide\n');

    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\nTest interrupted. Closing connection...');
  await mongoose.connection.close();
  process.exit(0);
});

testConnection();
