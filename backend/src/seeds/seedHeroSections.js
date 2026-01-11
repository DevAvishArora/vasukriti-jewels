const mongoose = require('mongoose');
require('dotenv').config();

const HeroSection = require('../models/HeroSection');

const defaultHeroSections = [
  {
    title: 'Timeless\nElegance',
    subtitle: '',
    description: 'Discover exquisite handcrafted jewellery that tells your story',
    images: [
      {
        url: '/images/hero-1.jpg',
        publicId: '',
        alt: 'Timeless Elegance - Vasukriti Jewels',
      },
    ],
    cta: {
      text: 'Shop Now',
      link: '/shop',
      style: 'primary',
    },
    secondaryCta: {
      text: 'About Us',
      link: '/about',
      style: 'outline',
    },
    design: {
      layout: 'fullscreen',
      overlay: {
        enabled: true,
        color: 'rgba(255, 255, 255, 0.1)',
      },
      textAlignment: 'left',
      animation: 'fade',
      height: '100vh',
    },
    isActive: true,
    isDraft: false,
    order: 1,
  },
  {
    title: 'Crafted with\nPassion',
    subtitle: '',
    description: 'Each piece is a masterpiece, handcrafted with precision and care',
    images: [
      {
        url: '/images/hero-2.jpg',
        publicId: '',
        alt: 'Crafted with Passion - Vasukriti Jewels',
      },
    ],
    cta: {
      text: 'Shop Now',
      link: '/shop',
      style: 'primary',
    },
    secondaryCta: {
      text: 'About Us',
      link: '/about',
      style: 'outline',
    },
    design: {
      layout: 'fullscreen',
      overlay: {
        enabled: true,
        color: 'rgba(255, 255, 255, 0.1)',
      },
      textAlignment: 'left',
      animation: 'fade',
      height: '100vh',
    },
    isActive: true,
    isDraft: false,
    order: 2,
  },
  {
    title: 'Celebrate\nYour Moments',
    subtitle: '',
    description: "Jewelry that captures life's precious moments in timeless beauty",
    images: [
      {
        url: '/images/hero-3.jpg',
        publicId: '',
        alt: 'Celebrate Your Moments - Vasukriti Jewels',
      },
    ],
    cta: {
      text: 'Shop Now',
      link: '/shop',
      style: 'primary',
    },
    secondaryCta: {
      text: 'About Us',
      link: '/about',
      style: 'outline',
    },
    design: {
      layout: 'fullscreen',
      overlay: {
        enabled: true,
        color: 'rgba(255, 255, 255, 0.1)',
      },
      textAlignment: 'left',
      animation: 'fade',
      height: '100vh',
    },
    isActive: true,
    isDraft: false,
    order: 3,
  },
];

async function seedHeroSections() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if hero sections already exist
    const existingHeroes = await HeroSection.countDocuments();
    
    if (existingHeroes > 0) {
      console.log(`Found ${existingHeroes} existing hero sections. Skipping seed.`);
      console.log('If you want to re-seed, delete existing heroes first from the admin panel.');
      process.exit(0);
    }

    // Create default hero sections
    const createdHeroes = await HeroSection.insertMany(defaultHeroSections);
    console.log(`Successfully created ${createdHeroes.length} default hero sections!`);
    
    console.log('\nCreated Heroes:');
    createdHeroes.forEach((hero, index) => {
      console.log(`${index + 1}. ${hero.title.replace('\n', ' ')} (Order: ${hero.order})`);
    });

    console.log('\n✅ Default hero sections have been saved to the database.');
    console.log('You can now manage them from: /admin/cms/hero');
    console.log('\n📝 Note: Replace /images/hero-*.jpg with actual Cloudinary URLs from the admin panel.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding hero sections:', error);
    process.exit(1);
  }
}

// Run the seed function
seedHeroSections();
