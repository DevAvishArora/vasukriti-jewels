const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

// Test credentials - use the test user from auth tests
const testAdmin = {
  email: 'test1763097811367@example.com',
  password: 'Test123456',
};

let authToken = '';
let categoryId = '';
let productId = '';

async function testProductAPIs() {
  console.log('🧪 Testing Product & Category APIs\n');
  console.log('================================\n');

  try {
    // Step 1: Login to get admin token
    console.log('1️⃣  Logging in as admin...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, testAdmin);
    authToken = loginResponse.data.data.token;
    console.log('✅ Login successful!\n');

    // Step 2: Create a category
    console.log('2️⃣  Creating a category...');
    const categoryData = {
      name: `Gold Necklaces ${Date.now()}`,
      description: 'Beautiful gold necklace collection',
    };

    const categoryResponse = await axios.post(
      `${API_URL}/categories`,
      categoryData,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    categoryId = categoryResponse.data.data.category._id;
    console.log('✅ Category created!');
    console.log(`   ID: ${categoryId}`);
    console.log(`   Name: ${categoryResponse.data.data.category.name}\n`);

    // Step 3: Get all categories
    console.log('3️⃣  Fetching all categories...');
    const categoriesResponse = await axios.get(`${API_URL}/categories`);
    console.log(`✅ Found ${categoriesResponse.data.data.categories.length} categories\n`);

    // Step 4: Create a product
    console.log('4️⃣  Creating a product...');
    const productData = {
      name: `Elegant Gold Necklace ${Date.now()}`,
      description: 'A stunning 22K gold necklace with intricate design',
      price: 85000,
      discountPrice: 80000,
      category: categoryId,
      material: 'Gold',
      purity: '22K',
      weight: 25.5,
      dimensions: { length: 45, width: 0.5 },
      stockQuantity: 5,
      sku: `GN-${Date.now()}`,
      images: [
        {
          url: 'https://example.com/image1.jpg',
          alt: 'Front view',
          isPrimary: true,
        },
        {
          url: 'https://example.com/image2.jpg',
          alt: 'Side view',
          isPrimary: false,
        },
      ],
      tags: ['wedding', 'bridal', 'traditional'],
    };

    const productResponse = await axios.post(
      `${API_URL}/products`,
      productData,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    productId = productResponse.data.data.product._id;
    const productSlug = productResponse.data.data.product.slug;
    console.log('✅ Product created!');
    console.log(`   ID: ${productId}`);
    console.log(`   Name: ${productResponse.data.data.product.name}`);
    console.log(`   Slug: ${productSlug}\n`);

    // Step 5: Get all products
    console.log('5️⃣  Fetching all products...');
    const productsResponse = await axios.get(`${API_URL}/products`);
    console.log(`✅ Found ${productsResponse.data.data.products.length} products`);
    console.log(`   Total: ${productsResponse.data.data.pagination.totalProducts}\n`);

    // Step 6: Get single product by slug
    console.log('6️⃣  Fetching product by slug...');
    const singleProductResponse = await axios.get(`${API_URL}/products/${productSlug}`);
    console.log('✅ Product fetched!');
    console.log(`   Name: ${singleProductResponse.data.data.product.name}`);
    console.log(`   Price: ₹${singleProductResponse.data.data.product.price}\n`);

    // Step 7: Update product
    console.log('7️⃣  Updating product...');
    const updateData = {
      price: 87000,
      discountPrice: 82000,
      stockQuantity: 10,
    };

    const updateResponse = await axios.put(
      `${API_URL}/products/${productId}`,
      updateData,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log('✅ Product updated!');
    console.log(`   New Price: ₹${updateResponse.data.data.product.price}`);
    console.log(`   New Stock: ${updateResponse.data.data.product.stockQuantity}\n`);

    // Step 8: Get featured products
    console.log('8️⃣  Fetching featured products...');
    const featuredResponse = await axios.get(`${API_URL}/products/featured`);
    console.log(`✅ Found ${featuredResponse.data.data.products.length} featured products\n`);

    // Step 9: Update stock
    console.log('9️⃣  Updating product stock...');
    const stockResponse = await axios.patch(
      `${API_URL}/products/${productId}/stock`,
      { stockQuantity: 15 },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log('✅ Stock updated!');
    console.log(`   New Stock: ${stockResponse.data.data.product.stockQuantity}\n`);

    // Step 10: Test product filtering
    console.log('🔟  Testing product filters...');
    const filterResponse = await axios.get(`${API_URL}/products`, {
      params: {
        category: categoryId,
        minPrice: 80000,
        maxPrice: 90000,
        material: 'Gold',
      },
    });
    console.log(`✅ Found ${filterResponse.data.data.products.length} products matching filters\n`);

    console.log('================================');
    console.log('✅ All Product & Category API tests passed!');
    console.log('================================\n');

    // Cleanup note
    console.log('📝 Note: Test data created in database:');
    console.log(`   Category ID: ${categoryId}`);
    console.log(`   Product ID: ${productId}`);
    console.log('   You can delete these manually if needed.\n');

  } catch (error) {
    console.error('❌ Test failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

testProductAPIs();
