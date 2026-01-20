/**
 * Reset Admin Password
 * 
 * Usage: node src/scripts/reset-admin-password.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const ADMIN_EMAIL = 'admin@vasukritijewels.com';
const NEW_PASSWORD = 'Admin@123';

async function resetPassword() {
  try {
    console.log('🔑 Resetting admin password...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Find admin user
    const admin = await User.findOne({ email: ADMIN_EMAIL });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log(`   Create one first or update ADMIN_EMAIL in the script`);
      process.exit(1);
    }
    
    console.log(`Found admin: ${admin.email}`);
    console.log(`Current role: ${admin.role}`);
    
    // Set plain password - the pre-save hook will hash it
    admin.password = NEW_PASSWORD;
    admin.role = 'admin';
    admin.isVerified = true;
    await admin.save();
    
    console.log('\n✅ Password reset successfully!\n');
    console.log('🔐 New Credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${NEW_PASSWORD}\n`);
    console.log('✅ You can now login with these credentials\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetPassword();
