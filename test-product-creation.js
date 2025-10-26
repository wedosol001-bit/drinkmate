const axios = require('axios');

async function testProductCreation() {
  try {
    console.log('Testing product creation with minimal mandatory fields...');
    
    // First, let's login to get admin token
    console.log('Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'aisha.mutairi@example.com',
      password: 'Faizanhassan1999.'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful, token received');
    
    // Now create a product with minimal mandatory fields
    const productData = {
      name: 'Test Product',
      price: 25,
      category: 'energy-drink',
      description: 'Test product description'
    };
    
    console.log('Creating product with data:', productData);
    
    const createResponse = await axios.post('http://localhost:5000/api/products', productData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Product created successfully!');
    console.log('Response:', createResponse.data);
    
  } catch (error) {
    console.error('Error occurred:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testProductCreation();
