require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('🧪 Testing MongoDB Connection...\n');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('MongoDB URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Not Set');
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment');
    process.exit(1);
  }

  try {
    console.log('\n🔄 Connecting to MongoDB...');
    const startTime = Date.now();
    
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 5,
      retryWrites: true,
      retryReads: true,
    });

    const connectionTime = Date.now() - startTime;
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Connection Time: ${connectionTime}ms`);
    console.log(`   Read State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    
    // Test a simple query
    console.log('\n🔄 Testing database query...');
    const queryStart = Date.now();
    const collections = await conn.connection.db.listCollections().toArray();
    const queryTime = Date.now() - queryStart;
    
    console.log(`✅ Query Successful!`);
    console.log(`   Collections found: ${collections.length}`);
    console.log(`   Query Time: ${queryTime}ms`);
    console.log(`   Collections: ${collections.map(c => c.name).join(', ')}`);
    
    // Test categories collection if it exists
    if (collections.some(c => c.name === 'categories')) {
      console.log('\n🔄 Testing categories.find()...');
      const catStart = Date.now();
      const Category = mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
      const count = await Category.countDocuments();
      const catTime = Date.now() - catStart;
      console.log(`✅ Categories query successful!`);
      console.log(`   Count: ${count}`);
      console.log(`   Query Time: ${catTime}ms`);
    }
    
    console.log('\n✅ All tests passed! Connection is healthy.');
    await mongoose.connection.close();
    console.log('🔒 Connection closed.');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Connection Test Failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    if (error.stack) {
      console.error('\nStack:', error.stack);
    }
    process.exit(1);
  }
}

testConnection();
