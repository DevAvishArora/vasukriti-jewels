const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');
const Coupon = require('./src/models/Coupon');
const Review = require('./src/models/Review');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Sample data
const generateSeedData = async () => {
  console.log('🌱 Starting to seed database...\n');

  // 1. Create Admin and Customers
  console.log('Creating users...');
  const plainPassword = 'Test123456';

  // Create admin user (using .create() to trigger pre-save hooks)
  await User.create({
    fullName: 'Admin User',
    email: 'admin@vasukritijewels.com',
    password: plainPassword,
    phone: '+91 98765 43210',
    role: 'admin',
    isEmailVerified: true,
    isActive: true,
  });

  // Create customer users one by one to trigger password hashing
  const customerData = [
    {
      fullName: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      password: plainPassword,
      phone: '+91 98765 11111',
      role: 'customer',
      isEmailVerified: true,
      isActive: true,
    },
    {
      fullName: 'Priya Sharma',
      email: 'priya@example.com',
      password: plainPassword,
      phone: '+91 98765 22222',
      role: 'customer',
      isEmailVerified: true,
      isActive: true,
    },
    {
      fullName: 'Amit Patel',
      email: 'amit@example.com',
      password: plainPassword,
      phone: '+91 98765 33333',
      role: 'customer',
      isEmailVerified: true,
      isActive: true,
    },
    {
      fullName: 'Sneha Gupta',
      email: 'sneha@example.com',
      password: plainPassword,
      phone: '+91 98765 44444',
      role: 'customer',
      isEmailVerified: true,
      isActive: true,
    },
    {
      fullName: 'Vikram Singh',
      email: 'vikram@example.com',
      password: plainPassword,
      phone: '+91 98765 55555',
      role: 'customer',
      isEmailVerified: true,
      isActive: true,
    },
  ];

  const customers = [];
  for (const data of customerData) {
    const customer = await User.create(data);
    customers.push(customer);
  }
  console.log(`✅ Created ${customers.length + 1} users\n`);

  // 2. Create Categories
  console.log('Creating categories...');
  const categories = await Category.insertMany([
    {
      name: 'Necklaces',
      slug: 'necklaces',
      description: 'Beautiful necklaces for every occasion',
      isActive: true,
    },
    {
      name: 'Earrings',
      slug: 'earrings',
      description: 'Elegant earrings collection',
      isActive: true,
    },
    {
      name: 'Rings',
      slug: 'rings',
      description: 'Stunning rings for special moments',
      isActive: true,
    },
    {
      name: 'Bracelets',
      slug: 'bracelets',
      description: 'Graceful bracelets and bangles',
      isActive: true,
    },
    {
      name: 'Pendants',
      slug: 'pendants',
      description: 'Charming pendants collection',
      isActive: true,
    },
  ]);
  console.log(`✅ Created ${categories.length} categories\n`);

  // 3. Create Products
  console.log('Creating products...');
  const products = await Product.insertMany([
    // Necklaces
    {
      name: 'Gold Plated Kundan Necklace',
      slug: 'gold-plated-kundan-necklace',
      description: 'Exquisite gold-plated kundan necklace with intricate design',
      price: 12500,
      category: categories[0]._id,
      sku: 'NK-001',
      stock: 15,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
          publicId: 'sample',
        },
      ],
      specifications: [
        { label: 'Material', value: 'Gold Plated' },
        { label: 'Stone', value: 'Kundan' },
        { label: 'Weight', value: '45g' },
      ],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Pearl String Necklace',
      slug: 'pearl-string-necklace',
      description: 'Classic pearl string necklace for elegant occasions',
      price: 8900,
      category: categories[0]._id,
      sku: 'NK-002',
      stock: 20,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338',
          publicId: 'sample',
        },
      ],
      specifications: [
        { label: 'Material', value: 'Pearls' },
        { label: 'Length', value: '16 inches' },
      ],
      isActive: true,
    },
    {
      name: 'Temple Jewellery Necklace Set',
      slug: 'temple-jewellery-necklace-set',
      description: 'Traditional temple jewellery necklace with earrings',
      price: 15600,
      category: categories[0]._id,
      sku: 'NK-003',
      stock: 8,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a',
          publicId: 'sample',
        },
      ],
      isActive: true,
      isFeatured: true,
    },
    // Earrings
    {
      name: 'Diamond Studded Earrings',
      slug: 'diamond-studded-earrings',
      description: 'Sparkling diamond studded earrings',
      price: 25000,
      category: categories[1]._id,
      sku: 'ER-001',
      stock: 25,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
          publicId: 'sample',
        },
      ],
      specifications: [
        { label: 'Material', value: '18K Gold' },
        { label: 'Stone', value: 'Diamond' },
        { label: 'Carat', value: '0.5ct' },
      ],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Jhumka Earrings',
      slug: 'jhumka-earrings',
      description: 'Traditional jhumka earrings with meenakari work',
      price: 4500,
      category: categories[1]._id,
      sku: 'ER-002',
      stock: 30,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1',
          publicId: 'sample',
        },
      ],
      isActive: true,
    },
    {
      name: 'Chandbali Earrings',
      slug: 'chandbali-earrings',
      description: 'Elegant chandbali earrings with pearls',
      price: 6800,
      category: categories[1]._id,
      sku: 'ER-003',
      stock: 18,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638',
          publicId: 'sample',
        },
      ],
      isActive: true,
    },
    // Rings
    {
      name: 'Solitaire Diamond Ring',
      slug: 'solitaire-diamond-ring',
      description: 'Classic solitaire diamond engagement ring',
      price: 45000,
      category: categories[2]._id,
      sku: 'RG-001',
      stock: 10,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e',
          publicId: 'sample',
        },
      ],
      specifications: [
        { label: 'Material', value: 'Platinum' },
        { label: 'Diamond', value: '1ct' },
        { label: 'Clarity', value: 'VS1' },
      ],
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Gold Band Ring',
      slug: 'gold-band-ring',
      description: 'Simple yet elegant gold band ring',
      price: 18000,
      category: categories[2]._id,
      sku: 'RG-002',
      stock: 22,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1603561596112-0a132b757442',
          publicId: 'sample',
        },
      ],
      isActive: true,
    },
    // Bracelets
    {
      name: 'Designer Gold Bracelet',
      slug: 'designer-gold-bracelet',
      description: 'Contemporary designer gold bracelet',
      price: 22000,
      category: categories[3]._id,
      sku: 'BR-001',
      stock: 12,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a',
          publicId: 'sample',
        },
      ],
      isActive: true,
    },
    {
      name: 'Silver Kada',
      slug: 'silver-kada',
      description: 'Traditional silver kada bracelet',
      price: 5600,
      category: categories[3]._id,
      sku: 'BR-002',
      stock: 28,
      images: [
        {
          url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a',
          publicId: 'sample',
        },
      ],
      isActive: true,
    },
  ]);
  console.log(`✅ Created ${products.length} products\n`);

  // 4. Create Orders with different statuses
  console.log('Creating orders...');
  const orderStatuses = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  const orders = [];
  // Generate dates for the last 30 days
  const orderDates = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    orderDates.push(date);
  }

  for (let i = 0; i < 15; i++) {
    const customer = customers[i % customers.length];
    const numItems = Math.floor(Math.random() * 3) + 1;
    const orderItems = [];
    let subtotal = 0;

    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 2) + 1;
      const price = product.price;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || 'https://via.placeholder.com/150',
        quantity,
        price,
        subtotal: price * quantity,
      });

      subtotal += price * quantity;
    }

    const shippingCharge = subtotal > 5000 ? 0 : 100;
    const tax = Math.round(subtotal * 0.03);
    const totalAmount = subtotal + shippingCharge + tax;

    orders.push({
      orderNumber: `VKJ${1000 + i}`,
      user: customer._id,
      items: orderItems,
      subtotal,
      shippingCharge,
      tax,
      totalAmount,
      orderStatus: orderStatuses[i % orderStatuses.length],
      paymentMethod: i % 3 === 0 ? 'razorpay' : 'cod',
      paymentStatus: i % 3 === 0 ? 'completed' : 'pending',
      shippingAddress: {
        fullName: customer.fullName,
        phone: customer.phone,
        addressLine1: `${i + 10} Main Street`,
        addressLine2: 'Sector 15',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
      createdAt: orderDates[i % orderDates.length],
      updatedAt: orderDates[i % orderDates.length],
    });
  }

  await Order.insertMany(orders);
  console.log(`✅ Created ${orders.length} orders\n`);

  // 5. Create Coupons
  console.log('Creating coupons...');
  await Coupon.insertMany([
    {
      code: 'WELCOME10',
      description: '10% off on first order',
      discountType: 'percentage',
      discountValue: 10,
      minimumOrderValue: 1000,
      validFrom: new Date(),
      validUntil: new Date('2025-12-31'),
      usageLimit: 100,
      isActive: true,
    },
    {
      code: 'DIWALI500',
      description: 'Flat ₹500 off on orders above ₹5000',
      discountType: 'fixed',
      discountValue: 500,
      minimumOrderValue: 5000,
      validFrom: new Date(),
      validUntil: new Date('2025-12-31'),
      usageLimit: 50,
      isActive: true,
    },
    {
      code: 'SAVE20',
      description: '20% off up to ₹2000',
      discountType: 'percentage',
      discountValue: 20,
      minimumOrderValue: 3000,
      maximumDiscount: 2000,
      validFrom: new Date(),
      validUntil: new Date('2025-12-31'),
      usageLimit: 200,
      isActive: true,
    },
  ]);
  console.log('✅ Created 3 coupons\n');

  // 6. Create Reviews
  console.log('Creating reviews...');
  const reviews = [];
  const reviewTitles = [
    'Excellent Quality!',
    'Beautiful Design',
    'Worth the Price',
    'Highly Recommended',
    'Amazing Product',
  ];
  const reviewComments = [
    'Absolutely loved this piece! The quality is outstanding and matches the description perfectly.',
    'Beautiful craftsmanship. Received many compliments when I wore it.',
    'Great value for money. The design is elegant and fits perfectly.',
    'Exceeded my expectations. The packaging was also very nice.',
    'Very satisfied with my purchase. Will definitely buy again!',
  ];

  const reviewCombinations = new Set();
  
  for (let i = 0; i < 20; i++) {
    let product, customer, combination;
    let attempts = 0;
    
    // Find unique product-customer combination
    do {
      product = products[Math.floor(Math.random() * products.length)];
      customer = customers[Math.floor(Math.random() * customers.length)];
      combination = `${customer._id}-${product._id}`;
      attempts++;
    } while (reviewCombinations.has(combination) && attempts < 50);
    
    if (attempts >= 50) break; // Exit if can't find unique combination
    
    reviewCombinations.add(combination);
    const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars

    reviews.push({
      product: product._id,
      user: customer._id,
      rating,
      title: reviewTitles[i % reviewTitles.length],
      comment: reviewComments[i % reviewComments.length],
      status: i % 5 === 0 ? 'pending' : 'approved',
      isVerifiedPurchase: i % 3 === 0,
      helpful: Math.floor(Math.random() * 10),
    });
  }

  await Review.insertMany(reviews);
  console.log(`✅ Created ${reviews.length} reviews\n`);

  console.log(' Database seeded successfully!\n');
  console.log('📋 Summary:');
  console.log(`   - Users: ${customers.length + 1} (1 admin, ${customers.length} customers)`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Products: ${products.length}`);
  console.log(`   - Orders: ${orders.length}`);
  console.log(`   - Coupons: 3`);
  console.log(`   - Reviews: ${reviews.length}`);
  console.log('\n🔐 Login Credentials:');
  console.log('   Admin: admin@vasukritijewels.com / Test123456');
  console.log('   Customer: rajesh@example.com / Test123456');
};

// Main execution
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...\n');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Coupon.deleteMany({}),
      Review.deleteMany({}),
    ]);
    console.log('✅ Existing data cleared\n');

    // Generate seed data
    await generateSeedData();

    console.log('\n✅ All done! Your database is ready for testing.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
