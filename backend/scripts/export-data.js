// Export all data from current MongoDB database
const mongoose = require('mongoose');

// Your CURRENT MongoDB URI (avisharorastudent3@gmail.com account)
const OLD_MONGODB_URI = 'mongodb+srv://vasukriti_admin:gy%3DWv2_36%275-@cluster0.w0wr68b.mongodb.net/vasukriti-jewels?retryWrites=true&w=majority';

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

async function exportData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(OLD_MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const fs = require('fs');
    const path = require('path');
    
    // Create exports directory
    const exportDir = path.join(__dirname, '../data-export');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    console.log('\n📦 Exporting data...\n');

    for (const collectionName of collections) {
      try {
        const collection = mongoose.connection.collection(collectionName);
        const data = await collection.find({}).toArray();
        
        const filename = path.join(exportDir, `${collectionName}.json`);
        fs.writeFileSync(filename, JSON.stringify(data, null, 2));
        
        console.log(`✅ ${collectionName}: ${data.length} documents exported`);
      } catch (error) {
        console.log(`⚠️  ${collectionName}: Collection not found or empty`);
      }
    }

    console.log('\n✅ Export complete! Data saved in backend/data-export/');
    console.log('\n📋 Summary:');
    
    // Show summary
    const files = fs.readdirSync(exportDir);
    files.forEach(file => {
      const filePath = path.join(exportDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`   ${file}: ${data.length} documents`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    process.exit(1);
  }
}

exportData();
