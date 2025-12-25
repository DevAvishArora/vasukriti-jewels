const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');

async function makeUserAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find user by email
    const email = 'test1763097811367@example.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`Found user: ${user.fullName} (${user.email})`);
    console.log(`Current role: ${user.role}\n`);

    // Update role to admin
    user.role = 'admin';
    await user.save();

    console.log(`✅ User updated to admin role!\n`);
    console.log(`New role: ${user.role}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

makeUserAdmin();
