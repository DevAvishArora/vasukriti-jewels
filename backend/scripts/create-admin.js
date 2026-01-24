// Create or update admin user in MongoDB
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Use production MongoDB by default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vasukriti_prod_user:Zhgqc26DDs99dmYX@vasukriti-production.pkbjufz.mongodb.net/vasukriti?retryWrites=true&w=majority';

const adminEmail = 'admin@vasukritijewels.com';
const adminPassword = 'Admin@123'; // Default password - change after first login!

async function createOrUpdateAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const User = mongoose.connection.collection('users');

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('👤 Admin user exists. Updating password...');
      
      await User.updateOne(
        { email: adminEmail },
        {
          $set: {
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            isVerified: true
          }
        }
      );
      
      console.log('✅ Admin password updated successfully!');
    } else {
      console.log('👤 Creating new admin user...');
      
      await User.insertOne({
        fullName: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '',
        role: 'admin',
        isActive: true,
        isVerified: true,
        wishlist: [],
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n📋 Admin Credentials:');
    console.log('   Email: ' + adminEmail);
    console.log('   Password: ' + adminPassword);
    console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createOrUpdateAdmin();
