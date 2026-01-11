/**
 * Seed Full Test Data (Staging & Development Only)
 * 
 * Seeds complete test data including:
 * - Hero Section
 * - Promotional Bar  
 * - Categories
 * - Products (30+ sample jewelry items)
 * - Test Users (admin & customer)
 * - Settings
 * 
 * ⚠️ DO NOT RUN IN PRODUCTION
 * 
 * Usage:
 * NODE_ENV=development node src/scripts/seed-test-data.js
 * NODE_ENV=staging node src/scripts/seed-test-data.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const HeroSection = require('../models/HeroSection');
const PromotionalBar = require('../models/PromotionalBar');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');
const Settings = require('../models/Settings');

// Safety check - prevent running in production
if (process.env.NODE_ENV === 'production') {
  console.error('❌ ERROR: Cannot run test data seed in PRODUCTION environment!');
  console.error('   Use seed-ui-content.js for production instead.');
  process.exit(1);
}

// Placeholder images (using Unsplash)
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80',
  rings: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
  necklaces: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
  earrings: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
  bracelets: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
  bangles: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
  pendants: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80',
};

const testData = {
  // UI Content (same as production)
  heroSection: {
    title: 'Exquisite Craftsmanship',
    subtitle: 'Timeless Elegance',
    description: 'Discover our collection of handcrafted jewelry. TEST ENVIRONMENT.',
    images: [
      {
        url: IMAGES.hero,
        publicId: 'test/hero/main-banner',
        alt: 'Test hero image',
      },
    ],
    cta: {
      text: 'Explore Collection',
      link: '/shop',
      style: 'primary',
    },
    secondaryCta: {
      text: 'View New Arrivals',
      link: '/shop?filter=new',
      style: 'outline',
    },
    layout: 'centered',
    backgroundOverlay: 'dark',
    textAlignment: 'center',
    height: 'full',
    isActive: true,
    displayOrder: 1,
  },

  promotionalBar: {
    messages: [
      {
        text: '🧪 TEST ENVIRONMENT - Not Real Data',
        link: '',
        icon: '🧪',
      },
      {
        text: '🚚 Free Shipping on Orders Above ₹5,000',
        link: '/shipping-policy',
        icon: '🚚',
      },
      {
        text: '💎 Certified Gold & Diamond Jewelry',
        link: '/shop',
        icon: '💎',
      },
    ],
    design: {
      type: 'sliding',
      backgroundColor: '#7e1219',
      textColor: '#ffffff',
      fontSize: '14px',
      animation: {
        speed: 30,
        direction: 'left',
      },
    },
    isActive: true,
  },

  categories: [
    {
      name: 'Rings',
      slug: 'rings',
      description: 'Elegant rings for every occasion',
      image: { url: IMAGES.rings, publicId: 'test/categories/rings' },
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Necklaces',
      slug: 'necklaces',
      description: 'Stunning necklaces that add grace',
      image: { url: IMAGES.necklaces, publicId: 'test/categories/necklaces' },
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'Earrings',
      slug: 'earrings',
      description: 'Beautiful earrings to complement your style',
      image: { url: IMAGES.earrings, publicId: 'test/categories/earrings' },
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'Bracelets',
      slug: 'bracelets',
      description: 'Delicate bracelets for sophistication',
      image: { url: IMAGES.bracelets, publicId: 'test/categories/bracelets' },
      displayOrder: 4,
      isActive: true,
    },
    {
      name: 'Bangles',
      slug: 'bangles',
      description: 'Traditional and contemporary bangles',
      image: { url: IMAGES.bangles, publicId: 'test/categories/bangles' },
      displayOrder: 5,
      isActive: true,
    },
    {
      name: 'Pendants',
      slug: 'pendants',
      description: 'Exquisite pendants for every personality',
      image: { url: IMAGES.pendants, publicId: 'test/categories/pendants' },
      displayOrder: 6,
      isActive: true,
    },
  ],

  users: [
    {
      name: 'Admin User',
      email: 'admin@vasukritijewels.com',
      password: 'Admin@123',
      role: 'admin',
      isVerified: true,
      phone: '+91 9999999999',
    },
    {
      name: 'Test Customer',
      email: 'customer@test.com',
      password: 'Test@123',
      role: 'user',
      isVerified: true,
      phone: '+91 8888888888',
    },
    {
      name: 'Unverified User',
      email: 'unverified@test.com',
      password: 'Test@123',
      role: 'user',
      isVerified: false,
      phone: '+91 7777777777',
    },
  ],

  settings: {
    siteName: 'Vasukriti Jewels (TEST)',
    siteDescription: 'Test environment for jewelry e-commerce',
    siteKeywords: 'test, jewelry, demo',
    contactEmail: 'test@vasukritijewels.com',
    contactPhone: '+91 XXXXX XXXXX',
    socialMedia: {
      facebook: 'https://facebook.com/test',
      instagram: 'https://instagram.com/test',
      twitter: 'https://twitter.com/test',
      pinterest: '',
      youtube: '',
    },
    shippingPolicy: {
      freeShippingThreshold: 5000,
      standardShippingFee: 100,
      estimatedDeliveryDays: '7-10 business days',
    },
    returnPolicy: {
      returnWindowDays: 7,
      description: 'Test return policy',
    },
  },
};

// Sample products generator
function generateProducts(categories) {
  const products = [];
  const metals = ['22K Gold', '18K Gold', '14K Gold', 'Rose Gold', 'White Gold', 'Platinum', 'Silver'];
  const stones = ['Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Pearl', 'Cubic Zirconia'];
  const occasions = ['Daily Wear', 'Festive', 'Wedding', 'Party', 'Casual', 'Formal'];

  categories.forEach((category) => {
    // Generate 5-6 products per category
    const productCount = Math.floor(Math.random() * 2) + 5;
    
    for (let i = 1; i <= productCount; i++) {
      const metal = metals[Math.floor(Math.random() * metals.length)];
      const stone = stones[Math.floor(Math.random() * stones.length)];
      const occasion = occasions[Math.floor(Math.random() * occasions.length)];
      const basePrice = Math.floor(Math.random() * 50000) + 5000;
      const discount = [0, 5, 10, 15, 20][Math.floor(Math.random() * 5)];
      const comparePrice = discount > 0 ? Math.floor(basePrice * (1 + discount / 100)) : 0;

      products.push({
        name: `${category.name.slice(0, -1)} ${i} - ${stone} ${metal}`,
        slug: `test-${category.slug}-${i}-${stone.toLowerCase()}-${metal.toLowerCase().replace(/\s/g, '-')}`,
        description: `Exquisite ${category.name.toLowerCase()} crafted in ${metal} with stunning ${stone}. Perfect for ${occasion.toLowerCase()}. This is a test product for development purposes.`,
        shortDescription: `Beautiful ${metal} ${category.name.toLowerCase()} with ${stone}`,
        category: category._id,
        price: basePrice,
        comparePrice: comparePrice,
        discount: discount,
        sku: `TEST-${category.slug.toUpperCase()}-${String(i).padStart(3, '0')}`,
        stock: Math.floor(Math.random() * 20) + 5,
        lowStockThreshold: 3,
        images: [
          {
            url: category.image.url,
            publicId: `test/products/${category.slug}-${i}`,
            alt: `${category.name} ${i}`,
            isPrimary: true,
          },
        ],
        specifications: [
          { label: 'Metal', value: metal },
          { label: 'Stone', value: stone },
          { label: 'Occasion', value: occasion },
          { label: 'Weight', value: `${(Math.random() * 10 + 2).toFixed(2)}g` },
          { label: 'Purity', value: metal.includes('22K') ? '91.6%' : metal.includes('18K') ? '75%' : '58.3%' },
        ],
        tags: [metal, stone, occasion, category.name, 'Test Product'],
        isFeatured: Math.random() > 0.7,
        isNewArrival: Math.random() > 0.6,
        isBestseller: Math.random() > 0.8,
        status: 'active',
        seo: {
          metaTitle: `${category.name.slice(0, -1)} ${i} - ${metal} with ${stone}`,
          metaDescription: `Shop ${metal} ${category.name.toLowerCase()} with ${stone}. ${occasion} jewelry.`,
          metaKeywords: `${metal}, ${stone}, ${category.name}, jewelry, test`,
        },
      });
    }
  });

  return products;
}

async function seedTestData() {
  try {
    console.log('🧪 Starting Test Data Seeding...');
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}\n`);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear all existing data
    console.log('🗑️  Clearing all existing data...');
    await Promise.all([
      HeroSection.deleteMany({}),
      PromotionalBar.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      User.deleteMany({}),
      Settings.deleteMany({}),
    ]);
    console.log('✅ Cleared all collections\n');

    // Seed Hero Section
    console.log('🎨 Seeding Hero Section...');
    const hero = await HeroSection.create(testData.heroSection);
    console.log(`✅ Created: "${hero.title}"\n`);

    // Seed Promotional Bar
    console.log('📢 Seeding Promotional Bar...');
    const promoBar = await PromotionalBar.create(testData.promotionalBar);
    console.log(`✅ Created with ${promoBar.messages.length} messages\n`);

    // Seed Categories
    console.log('📁 Seeding Categories...');
    const categories = await Category.insertMany(testData.categories);
    console.log(`✅ Created ${categories.length} categories\n`);

    // Seed Products
    console.log('💍 Generating Products...');
    const products = generateProducts(categories);
    console.log(`📦 Inserting ${products.length} products...`);
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);
    console.log('   Product breakdown by category:');
    categories.forEach(cat => {
      const count = createdProducts.filter(p => p.category.equals(cat._id)).length;
      console.log(`   - ${cat.name}: ${count} products`);
    });
    console.log('');

    // Seed Users
    console.log('👥 Seeding Users...');
    for (const userData of testData.users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({ ...userData, password: hashedPassword });
      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
    }
    console.log('');

    // Seed Settings
    console.log('⚙️  Seeding Settings...');
    const settings = await Settings.create(testData.settings);
    console.log(`✅ Created: "${settings.siteName}"\n`);

    console.log('✨ Test Data Seeding Complete!\n');
    console.log('📋 Summary:');
    console.log(`   - Hero Sections: 1`);
    console.log(`   - Promotional Bars: 1`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${createdProducts.length}`);
    console.log(`   - Users: ${testData.users.length}`);
    console.log(`   - Settings: 1`);
    console.log('');
    console.log('🔐 Test Credentials:');
    console.log('   Admin:');
    console.log('   - Email: admin@vasukritijewels.com');
    console.log('   - Password: Admin@123');
    console.log('');
    console.log('   Customer (Verified):');
    console.log('   - Email: customer@test.com');
    console.log('   - Password: Test@123');
    console.log('');
    console.log('   Customer (Unverified):');
    console.log('   - Email: unverified@test.com');
    console.log('   - Password: Test@123');
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('   1. Start your frontend: npm run dev');
    console.log('   2. Login with test credentials');
    console.log('   3. Browse products and test features');
    console.log('   4. Test email verification with unverified user');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    process.exit(1);
  }
}

// Run the seed function
seedTestData();
