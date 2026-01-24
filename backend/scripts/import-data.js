// Import data to NEW MongoDB database
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// REPLACE THIS with your NEW MongoDB URI (vasukriti.store@gmail.com account)
const NEW_MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vasukritistore_db_dev_user:KYamnEa2pchzjmPo@vasukriti-development.1unebd6.mongodb.net/vasukriti?retryWrites=true&w=majority';

const collections = [
  'users',
  'products',
  'categories',
  'orders',
  'reviews',
  'herosections',
  'staticcontents',
  'pagecontents',
  'coupons',
  'settings',
  'faqs',
  'whychooseuses',
  'promotionalbars',
  'contacts'
];

async function importData() {
  try {
    if (NEW_MONGODB_URI === 'PASTE_YOUR_NEW_MONGODB_URI_HERE') {
      console.error('❌ Please update NEW_MONGODB_URI in the script first!');
      process.exit(1);
    }

    console.log('🔌 Connecting to NEW MongoDB...');
    await mongoose.connect(NEW_MONGODB_URI);
    console.log('✅ Connected to NEW MongoDB');

    const exportDir = path.join(__dirname, '../data-export');
    
    if (!fs.existsSync(exportDir)) {
      console.error('❌ No data-export directory found! Run export-data.js first.');
      process.exit(1);
    }

    console.log('\n📥 Importing data...\n');

    for (const collectionName of collections) {
      try {
        const filename = path.join(exportDir, `${collectionName}.json`);
        
        if (!fs.existsSync(filename)) {
          console.log(`⚠️  ${collectionName}: No export file found, skipping...`);
          continue;
        }

        const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
        
        if (data.length === 0) {
          console.log(`⚠️  ${collectionName}: Empty, skipping...`);
          continue;
        }

        const collection = mongoose.connection.collection(collectionName);
        
        // Clear existing data (optional - remove this if you want to keep existing data)
        await collection.deleteMany({});
        
        // Insert data
        await collection.insertMany(data);
        
        console.log(`✅ ${collectionName}: ${data.length} documents imported`);
      } catch (error) {
        console.error(`❌ ${collectionName}: Error - ${error.message}`);
      }
    }

    console.log('\n✅ Import complete!');
    console.log('\n🎉 Your data has been migrated to the new MongoDB cluster!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
}

importData();
