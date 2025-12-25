#!/usr/bin/env node

/**
 * Environment Configuration Tester
 * Tests all environment variables and external services
 */

require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');

console.log('🔍 Testing Environment Configuration...\n');

// Color codes for terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

const success = (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`);
const error = (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`);
const warning = (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`);
const info = (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`);

// Test results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

// 1. Test Basic Environment Variables
console.log('1️⃣  Testing Basic Configuration...');
if (process.env.NODE_ENV) {
  success(`NODE_ENV: ${process.env.NODE_ENV}`);
  results.passed++;
} else {
  error('NODE_ENV not set');
  results.failed++;
}

if (process.env.PORT) {
  success(`PORT: ${process.env.PORT}`);
  results.passed++;
} else {
  warning('PORT not set, will use default 5000');
  results.warnings++;
}

console.log('');

// 2. Test JWT Configuration
console.log('2️⃣  Testing JWT Configuration...');
if (process.env.JWT_SECRET && process.env.JWT_SECRET !== 'your-super-secret-jwt-key-change-this-in-production') {
  success('JWT_SECRET is configured');
  results.passed++;
} else {
  error('JWT_SECRET not configured or using default');
  results.failed++;
}

if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET !== 'your-super-secret-refresh-token-key-change-this') {
  success('JWT_REFRESH_SECRET is configured');
  results.passed++;
} else {
  error('JWT_REFRESH_SECRET not configured or using default');
  results.failed++;
}

console.log('');

// 3. Test MongoDB Connection
console.log('3️⃣  Testing MongoDB Connection...');
async function testMongoDB() {
  if (!process.env.MONGODB_URI) {
    error('MONGODB_URI not set');
    results.failed++;
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    success('MongoDB connection successful');
    success(`Database: ${mongoose.connection.name}`);
    results.passed++;
    await mongoose.connection.close();
  } catch (err) {
    error(`MongoDB connection failed: ${err.message}`);
    results.failed++;
  }
}

// 4. Test Cloudinary Configuration
console.log('\n4️⃣  Testing Cloudinary Configuration...');
function testCloudinary() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME === 'your-cloud-name'
  ) {
    warning('Cloudinary CLOUD_NAME not configured');
    results.warnings++;
    return;
  }

  if (
    !process.env.CLOUDINARY_API_KEY ||
    process.env.CLOUDINARY_API_KEY === 'your-api-key'
  ) {
    warning('Cloudinary API_KEY not configured');
    results.warnings++;
    return;
  }

  if (
    !process.env.CLOUDINARY_API_SECRET ||
    process.env.CLOUDINARY_API_SECRET === 'your-api-secret'
  ) {
    warning('Cloudinary API_SECRET not configured');
    results.warnings++;
    return;
  }

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  success('Cloudinary configuration looks good');
  info(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  results.passed++;
}

// 5. Test Email Configuration
console.log('\n5️⃣  Testing Email Configuration...');
async function testEmail() {
  if (
    !process.env.EMAIL_USER ||
    process.env.EMAIL_USER === 'your-email@gmail.com'
  ) {
    warning('Email not configured (optional for now)');
    results.warnings++;
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.verify();
    success('Email configuration successful');
    success(`Email: ${process.env.EMAIL_USER}`);
    results.passed++;
  } catch (err) {
    warning(`Email verification failed: ${err.message} (optional for now)`);
    results.warnings++;
  }
}

// 6. Test Razorpay Configuration
console.log('\n6️⃣  Testing Razorpay Configuration...');
function testRazorpay() {
  if (
    !process.env.RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID === 'your-razorpay-key-id'
  ) {
    warning('Razorpay KEY_ID not configured (optional for now)');
    results.warnings++;
    return;
  }

  if (
    !process.env.RAZORPAY_KEY_SECRET ||
    process.env.RAZORPAY_KEY_SECRET === 'your-razorpay-key-secret'
  ) {
    warning('Razorpay KEY_SECRET not configured (optional for now)');
    results.warnings++;
    return;
  }

  success('Razorpay configuration looks good');
  info(`Key ID: ${process.env.RAZORPAY_KEY_ID.substring(0, 15)}...`);
  results.passed++;
}

// Run all tests
async function runTests() {
  testCloudinary();
  testRazorpay();
  await testMongoDB();
  await testEmail();

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary:');
  console.log('='.repeat(50));
  success(`Passed: ${results.passed}`);
  error(`Failed: ${results.failed}`);
  warning(`Warnings: ${results.warnings}`);
  console.log('='.repeat(50));

  if (results.failed === 0) {
    console.log('');
    success('🎉 All critical tests passed!');
    info('You can start the server now with: npm run dev');
  } else {
    console.log('');
    error('⚠️  Some critical tests failed. Please check the configuration.');
    info('Review CREDENTIALS_SETUP.md for help setting up services.');
  }

  console.log('');
  process.exit(results.failed === 0 ? 0 : 1);
}

runTests().catch((err) => {
  error(`Test failed: ${err.message}`);
  process.exit(1);
});
