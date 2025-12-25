const axios = require('axios');

const API_URL = 'http://localhost:5001/api/auth';

async function testAuthentication() {
  console.log('🧪 Testing Authentication API\n');
  console.log('================================\n');

  try {
    // Test 1: Register a new user
    console.log('1️⃣  Testing User Registration...');
    const registerData = {
      fullName: 'Test User',
      email: `test${Date.now()}@example.com`, // Unique email
      password: 'Test123456',
      phone: '+919876543210'
    };

    const registerResponse = await axios.post(`${API_URL}/register`, registerData);
    console.log('✅ Registration successful!');
    console.log('Response:', JSON.stringify(registerResponse.data, null, 2));
    
    const { token, refreshToken } = registerResponse.data.data;
    console.log('Token length:', token.length);
    console.log('RefreshToken length:', refreshToken.length);
    console.log('\n');

    // Test 2: Get current user with token
    console.log('2️⃣  Testing Get Current User...');
    const meResponse = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Get user successful!');
    console.log('User:', JSON.stringify(meResponse.data, null, 2));
    console.log('\n');

    // Test 3: Test refresh token
    console.log('3️⃣  Testing Refresh Token...');
    const refreshResponse = await axios.post(`${API_URL}/refresh-token`, {
      refreshToken
    });
    console.log('✅ Token refresh successful!');
    const newToken = refreshResponse.data.data?.token || refreshResponse.data.token;
    if (newToken) {
      console.log('New Token:', newToken.substring(0, 20) + '...');
    }
    console.log('\n');

    // Test 4: Login with the same user
    console.log('4️⃣  Testing User Login...');
    const loginResponse = await axios.post(`${API_URL}/login`, {
      email: registerData.email,
      password: registerData.password
    });
    console.log('✅ Login successful!');
    console.log('Response:', JSON.stringify(loginResponse.data, null, 2));
    console.log('\n');

    console.log('================================');
    console.log('✅ All authentication tests passed!');
    console.log('================================\n');

  } catch (error) {
    console.error('❌ Test failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

testAuthentication();
