/**
 * Seed Default Page Content
 * 
 * Populates initial content for static pages:
 * - About Us
 * - Brand Story
 * - Why Choose Us
 * - Hero Section
 * 
 * Usage:
 * node src/scripts/seed-page-content.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const PageContent = require('../models/PageContent');

const defaultContent = [
  {
    page: 'about',
    title: 'About Vasukriti Jewels',
    subtitle: 'Crafting Timeless Elegance Since Our Inception',
    sections: [
      {
        type: 'heading',
        content: 'Our Story',
        order: 1
      },
      {
        type: 'paragraph',
        content: 'At Vasukriti Jewels, we believe that jewelry is more than just an accessory—it\'s an expression of your unique story, style, and spirit. Founded with a passion for timeless elegance and exquisite craftsmanship, we have dedicated ourselves to creating pieces that celebrate life\'s most precious moments.',
        order: 2
      },
      {
        type: 'paragraph',
        content: 'Our journey began with a simple vision: to bring the finest quality jewelry to discerning customers who appreciate the perfect blend of tradition and contemporary design. Each piece in our collection is carefully curated or crafted to ensure it meets our exacting standards of beauty, quality, and durability.',
        order: 3
      },
      {
        type: 'heading',
        content: 'Our Craftsmanship',
        order: 4
      },
      {
        type: 'paragraph',
        content: 'Every piece of jewelry at Vasukriti is a testament to the skill of master artisans who pour their heart and soul into their work. We combine traditional jewelry-making techniques with modern innovation to create designs that are both timeless and contemporary.',
        order: 5
      },
      {
        type: 'stats',
        content: {
          items: [
            { label: 'Years of Excellence', value: '10+' },
            { label: 'Happy Customers', value: '50,000+' },
            { label: 'Unique Designs', value: '5,000+' },
            { label: 'Expert Craftsmen', value: '100+' }
          ]
        },
        order: 6
      },
      {
        type: 'heading',
        content: 'Our Promise',
        order: 7
      },
      {
        type: 'list',
        content: {
          items: [
            'Authentic materials - We use only genuine gold, silver, diamonds, and gemstones',
            'Quality assurance - Every piece undergoes rigorous quality checks',
            'Certified jewelry - All our diamond and precious stone jewelry comes with certification',
            'Lifetime support - We stand behind our products with comprehensive after-sales service',
            'Ethical sourcing - We are committed to responsible and sustainable practices'
          ]
        },
        order: 8
      }
    ],
    metadata: {
      seoTitle: 'About Us - Vasukriti Jewels | Timeless Elegance',
      seoDescription: 'Discover the story behind Vasukriti Jewels. Learn about our commitment to quality, craftsmanship, and creating timeless pieces that celebrate your special moments.',
      keywords: ['about vasukriti', 'jewelry craftsmanship', 'ethical jewelry', 'quality jewelry']
    },
    isActive: true
  },
  {
    page: 'brand-story',
    title: 'The Vasukriti Legacy',
    subtitle: 'Where Heritage Meets Contemporary Design',
    sections: [
      {
        type: 'quote',
        content: {
          text: 'Every piece of jewelry tells a story. At Vasukriti, we help you create yours.',
          author: 'Founder, Vasukriti Jewels'
        },
        order: 1
      },
      {
        type: 'paragraph',
        content: 'Vasukriti—derived from ancient Sanskrit, meaning "creation of beauty"—embodies our philosophy of transforming precious metals and gemstones into wearable art. Our brand story is woven with threads of tradition, innovation, and an unwavering commitment to excellence.',
        order: 2
      },
      {
        type: 'heading',
        content: 'Our Heritage',
        order: 3
      },
      {
        type: 'paragraph',
        content: 'Our roots lie deep in the rich tradition of Indian jewelry craftsmanship. For generations, master artisans in our family have perfected the art of jewelry making, passing down techniques and secrets that give each piece its distinctive character. This heritage forms the foundation of everything we create.',
        order: 4
      },
      {
        type: 'heading',
        content: 'Modern Innovation',
        order: 5
      },
      {
        type: 'paragraph',
        content: 'While honoring our heritage, we embrace innovation. Our design team combines traditional craftsmanship with contemporary aesthetics, creating jewelry that appeals to modern sensibilities while retaining timeless elegance. We use advanced techniques and technologies to ensure precision and perfection in every piece.',
        order: 6
      },
      {
        type: 'heading',
        content: 'Sustainability & Ethics',
        order: 7
      },
      {
        type: 'paragraph',
        content: 'We believe in responsible luxury. Our commitment to sustainability means sourcing materials ethically, supporting fair labor practices, and minimizing our environmental impact. When you choose Vasukriti, you choose jewelry that\'s beautiful inside and out.',
        order: 8
      },
      {
        type: 'heading',
        content: 'Our Collections',
        order: 9
      },
      {
        type: 'paragraph',
        content: 'From traditional temple jewelry to contemporary minimalist designs, our diverse collections cater to every taste and occasion. Whether you\'re looking for bridal jewelry, everyday pieces, or statement accessories, Vasukriti has something special for you.',
        order: 10
      }
    ],
    metadata: {
      seoTitle: 'Brand Story - Vasukriti Jewels | Heritage & Innovation',
      seoDescription: 'Explore the rich heritage and innovative spirit behind Vasukriti Jewels. Discover how we blend tradition with contemporary design to create timeless pieces.',
      keywords: ['vasukriti story', 'jewelry heritage', 'sustainable jewelry', 'indian jewelry']
    },
    isActive: true
  },
  {
    page: 'why-choose-us',
    title: 'Why Choose Vasukriti',
    subtitle: 'Excellence in Every Detail',
    sections: [
      {
        type: 'list',
        content: {
          items: [
            {
              title: 'Premium Quality',
              description: 'Every piece is crafted using the finest materials and undergoes strict quality control. We never compromise on quality.',
              icon: 'shield'
            },
            {
              title: 'Certified Authenticity',
              description: 'All our diamond and precious stone jewelry comes with genuine certification from recognized laboratories.',
              icon: 'certificate'
            },
            {
              title: 'Expert Craftsmanship',
              description: 'Our master artisans bring decades of experience and unmatched skill to every piece they create.',
              icon: 'hammer'
            },
            {
              title: 'Unique Designs',
              description: 'Our in-house design team creates exclusive pieces that you won\'t find anywhere else.',
              icon: 'sparkles'
            },
            {
              title: 'Lifetime Support',
              description: 'Enjoy complimentary cleaning, resizing, and maintenance services for as long as you own your jewelry.',
              icon: 'heart'
            },
            {
              title: 'Easy Returns',
              description: 'Not satisfied? Return your purchase within 30 days for a full refund, no questions asked.',
              icon: 'refresh'
            }
          ]
        },
        order: 1
      }
    ],
    metadata: {
      seoTitle: 'Why Choose Vasukriti Jewels | Quality & Service',
      seoDescription: 'Discover why thousands of customers trust Vasukriti Jewels for their precious jewelry needs. Quality, authenticity, and exceptional service.',
      keywords: ['quality jewelry', 'certified jewelry', 'jewelry service', 'authentic jewelry']
    },
    isActive: true
  },
  {
    page: 'hero',
    title: 'Timeless Elegance',
    subtitle: 'Discover Our Exquisite Collection',
    sections: [
      {
        type: 'text',
        content: {
          heading: 'Timeless Elegance',
          subheading: 'Discover Our Exquisite Collection',
          ctaText: 'Shop Now',
          ctaLink: '/shop'
        },
        order: 1
      }
    ],
    isActive: true
  }
];

async function seedPageContent() {
  try {
    console.log('🌱 Starting Page Content Seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing content
    const deleted = await PageContent.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} existing page content records\n`);

    // Insert default content
    console.log('📝 Inserting default page content...\n');
    
    for (const content of defaultContent) {
      const created = await PageContent.create(content);
      console.log(`✅ Created content for: ${content.page}`);
      console.log(`   Title: ${content.title}`);
      console.log(`   Sections: ${content.sections.length}\n`);
    }

    console.log('✨ Page Content Seeding Complete!\n');
    console.log('📋 Summary:');
    console.log(`   - Total pages seeded: ${defaultContent.length}`);
    console.log(`   - About Us: ✅`);
    console.log(`   - Brand Story: ✅`);
    console.log(`   - Why Choose Us: ✅`);
    console.log(`   - Hero Section: ✅\n`);

    console.log('🎯 Next Steps:');
    console.log('   1. Content is now available via /api/page-content');
    console.log('   2. Update frontend components to fetch from API');
    console.log('   3. Access admin panel to edit content\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding page content:', error);
    process.exit(1);
  }
}

// Run the seeder
seedPageContent();
