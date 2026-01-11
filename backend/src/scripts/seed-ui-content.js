/**
 * Seed UI Content (Production Safe)
 * 
 * Seeds only UI/content elements needed for the site to function:
 * - Hero Section
 * - Promotional Bar
 * - Categories (empty - no products)
 * - Settings
 * 
 * NO PRODUCTS - Those should be added manually in production
 * 
 * Usage:
 * node src/scripts/seed-ui-content.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const HeroSection = require('../models/HeroSection');
const PromotionalBar = require('../models/PromotionalBar');
const Category = require('../models/Category');
const Settings = require('../models/Settings');

// Placeholder image URLs (replace with your Cloudinary URLs or use Unsplash)
const PLACEHOLDER_HERO = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80';
const PLACEHOLDER_CATEGORY = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80';

const uiContent = {
  heroSection: {
    title: 'Exquisite Craftsmanship',
    subtitle: 'Timeless Elegance',
    description: 'Discover our collection of handcrafted jewelry, where tradition meets contemporary design. Each piece tells a story of artistry and perfection.',
    images: [
      {
        url: PLACEHOLDER_HERO,
        publicId: 'vasukriti/hero/main-banner',
        alt: 'Elegant jewelry collection display',
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
        text: '✨ Welcome to Vasukriti Jewels - Crafting Elegance Since 2020',
        link: '/about',
        icon: '✨',
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
      {
        text: '🎁 Special Gift Wrapping Available',
        link: '/contact',
        icon: '🎁',
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
    schedule: {
      enabled: false,
    },
  },

  categories: [
    {
      name: 'Rings',
      slug: 'rings',
      description: 'Elegant rings for every occasion - from everyday wear to special celebrations',
      image: {
        url: PLACEHOLDER_CATEGORY,
        publicId: 'vasukriti/categories/rings',
      },
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Necklaces',
      slug: 'necklaces',
      description: 'Stunning necklaces that add grace to your neckline',
      image: {
        url: PLACEHOLDER_CATEGORY,
        publicId: 'vasukriti/categories/necklaces',
      },
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'Earrings',
      slug: 'earrings',
      description: 'Beautiful earrings to complement your style',
      image: {
        url: PLACEHOLDER_CATEGORY,
        publicId: 'vasukriti/categories/earrings',
      },
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'Bracelets',
      slug: 'bracelets',
      description: 'Delicate bracelets for a touch of sophistication',
      image: {
        url: PLACEHOLDER_CATEGORY,
        publicId: 'vasukriti/categories/bracelets',
      },
      displayOrder: 4,
      isActive: true,
    },
    {
      name: 'Bangles',
      slug: 'bangles',
      description: 'Traditional and contemporary bangles',
      image: {
        url: PLACEHOLDER_CATEGORY,
        publicId: 'vasukriti/categories/bangles',
      },
      displayOrder: 5,
      isActive: true,
    },
    {
      name: 'Pendants',
      slug: 'pendants',
      description: 'Exquisite pendants for every personality',
      image: {
        url: PLACEHOLDER_CATEGORY,
        publicId: 'vasukriti/categories/pendants',
      },
      displayOrder: 6,
      isActive: true,
    },
  ],

  settings: {
    siteName: 'Vasukriti Jewels',
    siteDescription: 'Exquisite handcrafted jewelry - Where tradition meets contemporary design',
    siteKeywords: 'jewelry, gold jewelry, diamond jewelry, handcrafted jewelry, vasukriti',
    contactEmail: 'info@vasukritijewels.com',
    contactPhone: '+91 XXXXX XXXXX',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      pinterest: '',
      youtube: '',
    },
    businessHours: {
      monday: '10:00 AM - 7:00 PM',
      tuesday: '10:00 AM - 7:00 PM',
      wednesday: '10:00 AM - 7:00 PM',
      thursday: '10:00 AM - 7:00 PM',
      friday: '10:00 AM - 7:00 PM',
      saturday: '10:00 AM - 7:00 PM',
      sunday: 'Closed',
    },
    shippingPolicy: {
      freeShippingThreshold: 5000,
      standardShippingFee: 100,
      estimatedDeliveryDays: '7-10 business days',
    },
    returnPolicy: {
      returnWindowDays: 7,
      description: 'Items can be returned within 7 days of delivery in original condition',
    },
  },
};

async function seedUIContent() {
  try {
    console.log('🌱 Starting UI Content Seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing UI content
    console.log('🗑️  Clearing existing UI content...');
    await HeroSection.deleteMany({});
    await PromotionalBar.deleteMany({});
    await Category.deleteMany({});
    await Settings.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Seed Hero Section
    console.log('🎨 Seeding Hero Section...');
    const hero = await HeroSection.create(uiContent.heroSection);
    console.log(`✅ Created hero section: "${hero.title}"\n`);

    // Seed Promotional Bar
    console.log('📢 Seeding Promotional Bar...');
    const promoBar = await PromotionalBar.create(uiContent.promotionalBar);
    console.log(`✅ Created promotional bar with ${promoBar.messages.length} messages\n`);

    // Seed Categories
    console.log('📁 Seeding Categories...');
    const categories = await Category.insertMany(uiContent.categories);
    console.log(`✅ Created ${categories.length} categories:`);
    categories.forEach(cat => console.log(`   - ${cat.name}`));
    console.log('');

    // Seed Settings
    console.log('⚙️  Seeding Settings...');
    const settings = await Settings.create(uiContent.settings);
    console.log(`✅ Created site settings: "${settings.siteName}"\n`);

    console.log('✨ UI Content Seeding Complete!\n');
    console.log('📋 Summary:');
    console.log(`   - Hero Sections: 1`);
    console.log(`   - Promotional Bars: 1`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Settings: 1`);
    console.log(`   - Products: 0 (add manually in production)`);
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('   1. Visit your site and verify UI elements load correctly');
    console.log('   2. Update placeholder images with real Cloudinary URLs');
    console.log('   3. Customize hero section text and CTAs');
    console.log('   4. Add products manually through admin panel');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding UI content:', error);
    process.exit(1);
  }
}

// Run the seed function
seedUIContent();
