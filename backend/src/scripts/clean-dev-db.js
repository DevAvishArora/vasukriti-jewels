/**
 * Clean Development Database
 * 
 * Removes all data except one admin user:
 * - Categories
 * - Products
 * - Orders
 * - Cart items
 * - Reviews
 * - Coupons
 * - Users (except admin)
 * 
 * ⚠️ DEVELOPMENT ONLY - Will not run in production
 * 
 * Usage:
 * node src/scripts/clean-dev-db.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');

// Safety check - prevent running in production
if (process.env.NODE_ENV === 'production') {
  console.error('❌ ERROR: Cannot run database cleanup in PRODUCTION environment!');
  console.error('   This script is for development only.');
  process.exit(1);
}

// Import models
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');

// Admin user to keep/create
const ADMIN_USER = {
  name: 'Admin User',
  email: 'admin@vasukritijewels.com',
  password: 'Admin@123',
  role: 'admin',
  isVerified: true,
  phone: '+91 9999999999',
};

// Create readline interface for confirmation
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function cleanDatabase() {
  try {
    console.log('🧹 Starting Database Cleanup...\n');
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database: ${process.env.MONGODB_URI?.split('@')[1]?.split('/')[0] || 'Unknown'}\n`);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Ask for confirmation
    console.log('⚠️  WARNING: This will DELETE all data except one admin user!');
    console.log('   The following collections will be cleared:');
    console.log('   - Categories');
    console.log('   - Products');
    console.log('   - Orders');
    console.log('   - Cart items');
    console.log('   - Reviews');
    console.log('   - Coupons');
    console.log('   - All users (except admin)\n');

    const answer = await askQuestion('Are you sure you want to continue? (yes/no): ');
    
    if (answer.toLowerCase() !== 'yes') {
      console.log('\n❌ Cleanup cancelled.');
      rl.close();
      process.exit(0);
    }

    console.log('\n🗑️  Starting cleanup...\n');

    // Delete all data
    console.log('🗑️  Deleting categories...');
    const categoriesDeleted = await Category.deleteMany({});
    console.log(`   ✅ Deleted ${categoriesDeleted.deletedCount} categories`);

    console.log('🗑️  Deleting products...');
    const productsDeleted = await Product.deleteMany({});
    console.log(`   ✅ Deleted ${productsDeleted.deletedCount} products`);

    console.log('🗑️  Deleting orders...');
    const ordersDeleted = await Order.deleteMany({});
    console.log(`   ✅ Deleted ${ordersDeleted.deletedCount} orders`);

    console.log('🗑️  Deleting cart items...');
    const cartsDeleted = await Cart.deleteMany({});
    console.log(`   ✅ Deleted ${cartsDeleted.deletedCount} cart items`);

    console.log('🗑️  Deleting reviews...');
    const reviewsDeleted = await Review.deleteMany({});
    console.log(`   ✅ Deleted ${reviewsDeleted.deletedCount} reviews`);

    console.log('🗑️  Deleting coupons...');
    const couponsDeleted = await Coupon.deleteMany({});
    console.log(`   ✅ Deleted ${couponsDeleted.deletedCount} coupons`);

    console.log('🗑️  Deleting all users (except admin)...');
    const usersDeleted = await User.deleteMany({ role: { $ne: 'admin' } });
    console.log(`   ✅ Deleted ${usersDeleted.deletedCount} non-admin users`);

    // Check if admin user exists
    console.log('\n👤 Checking admin user...');
    let adminUser = await User.findOne({ email: ADMIN_USER.email });

    if (adminUser) {
      console.log(`   ✅ Admin user exists: ${adminUser.email}`);
      console.log('   ℹ️  Updating admin user password...');
      
      // Update admin password
      const hashedPassword = await bcrypt.hash(ADMIN_USER.password, 10);
      adminUser.password = hashedPassword;
      adminUser.isVerified = true;
      adminUser.role = 'admin';
      await adminUser.save();
      
      console.log('   ✅ Admin user updated');
    } else {
      console.log('   ℹ️  Admin user not found. Creating new admin user...');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash(ADMIN_USER.password, 10);
      adminUser = await User.create({
        ...ADMIN_USER,
        password: hashedPassword,
      });
      
      console.log(`   ✅ Created admin user: ${adminUser.email}`);
    }

    console.log('\n✨ Database Cleanup Complete!\n');
    console.log('📋 Summary:');
    console.log(`   - Categories deleted: ${categoriesDeleted.deletedCount}`);
    console.log(`   - Products deleted: ${productsDeleted.deletedCount}`);
    console.log(`   - Orders deleted: ${ordersDeleted.deletedCount}`);
    console.log(`   - Cart items deleted: ${cartsDeleted.deletedCount}`);
    console.log(`   - Reviews deleted: ${reviewsDeleted.deletedCount}`);
    console.log(`   - Coupons deleted: ${couponsDeleted.deletedCount}`);
    console.log(`   - Users deleted: ${usersDeleted.deletedCount}`);
    console.log(`   - Admin user: ✅ Ready\n`);

    console.log('🔐 Admin Credentials:');
    console.log(`   Email: ${ADMIN_USER.email}`);
    console.log(`   Password: ${ADMIN_USER.password}\n`);

    console.log('🎯 Next Steps:');
    console.log('   1. Your database is now clean');
    console.log('   2. Run seed scripts if you want test data:');
    console.log('      npm run seed:dev');
    console.log('   3. Or manually add data through admin panel');
    console.log('   4. Login with admin credentials above\n');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error cleaning database:', error);
    rl.close();
    process.exit(1);
  }
}

// Run the cleanup
cleanDatabase();
