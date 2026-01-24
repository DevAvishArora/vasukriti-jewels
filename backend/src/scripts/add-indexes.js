const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const addIndexes = async () => {
  try {
    await connectDB();

    const db = mongoose.connection.db;

    console.log('\n🔨 Creating Performance Indexes...\n');

    // Products collection indexes
    await db.collection('products').createIndex({ isActive: 1, createdAt: -1 });
    console.log('✅ Created index: products.isActive + createdAt');

    await db.collection('products').createIndex({ isActive: 1, category: 1 });
    console.log('✅ Created index: products.isActive + category');

    await db.collection('products').createIndex({ isActive: 1, price: 1 });
    console.log('✅ Created index: products.isActive + price');

    await db.collection('products').createIndex({ slug: 1 });
    console.log('✅ Created index: products.slug');

    await db.collection('products').createIndex({ name: 'text', description: 'text' });
    console.log('✅ Created index: products text search (name + description)');

    // Categories collection indexes
    await db.collection('categories').createIndex({ slug: 1 });
    console.log('✅ Created index: categories.slug');

    await db.collection('categories').createIndex({ isActive: 1 });
    console.log('✅ Created index: categories.isActive');

    // Orders collection indexes
    await db.collection('orders').createIndex({ user: 1, createdAt: -1 });
    console.log('✅ Created index: orders.user + createdAt');

    await db.collection('orders').createIndex({ status: 1 });
    console.log('✅ Created index: orders.status');

    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('✅ Created index: users.email (unique)');

    console.log('\n✅ All indexes created successfully!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
};

addIndexes();
