// Create admin users in all 3 MongoDB environments
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const databases = [
  {
    name: 'Production',
    uri: 'mongodb+srv://vasukriti_prod_user:Zhgqc26DDs99dmYX@vasukriti-production.pkbjufz.mongodb.net/vasukriti?retryWrites=true&w=majority',
    email: 'admin@vasukritijewels.com',
    password: 'Admin@123'
  },
  {
    name: 'Staging',
    uri: 'mongodb+srv://vasukritistore_db_staging_user:cvsTPU8h1cMTPjeP@vasukriti-staging.i5d3j6x.mongodb.net/vasukriti?retryWrites=true&w=majority',
    email: 'admin@vasukritijewels.com',
    password: 'Admin@123'
  },
  {
    name: 'Development',
    uri: 'mongodb+srv://vasukritistore_db_dev_user:KYamnEa2pchzjmPo@vasukriti-development.1unebd6.mongodb.net/vasukriti?retryWrites=true&w=majority',
    email: 'admin@vasukritijewels.com',
    password: 'Admin@123'
  }
];

async function createAdminInDatabase(db) {
  try {
    console.log(`\n🔍 Processing ${db.name} Environment...`);
    await mongoose.connect(db.uri);
    console.log(`✅ Connected to ${db.name}`);

    const User = mongoose.connection.collection('users');

    // Hash password
    const hashedPassword = await bcrypt.hash(db.password, 10);

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: db.email });

    if (existingAdmin) {
      console.log(`   👤 Admin exists. Updating...`);
      
      await User.updateOne(
        { email: db.email },
        {
          $set: {
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            isVerified: true,
            fullName: 'Admin',
            updatedAt: new Date()
          }
        }
      );
      
      console.log(`   ✅ Admin updated in ${db.name}`);
    } else {
      console.log(`   👤 Creating new admin...`);
      
      await User.insertOne({
        fullName: 'Admin',
        email: db.email,
        password: hashedPassword,
        phone: '6375300236',
        role: 'admin',
        isActive: true,
        isVerified: true,
        wishlist: [],
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`   ✅ Admin created in ${db.name}`);
    }

    console.log(`   📧 Email: ${db.email}`);
    console.log(`   🔑 Password: ${db.password}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error(`   ❌ Error in ${db.name}:`, error.message);
  }
}

async function createAllAdmins() {
  console.log('🚀 Creating Admin Users in All Environments');
  console.log('='.repeat(50));

  for (const db of databases) {
    await createAdminInDatabase(db);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ All admin users created/updated!\n');
  console.log('📋 Admin Credentials (same for all environments):');
  console.log('   Email: admin@vasukritijewels.com');
  console.log('   Password: Admin@123');
  console.log('\n⚠️  Change password after first login!\n');
}

createAllAdmins();
