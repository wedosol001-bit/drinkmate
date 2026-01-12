/**
 * ARB Payment Gateway Integration Test Script
 * 
 * This script tests the ARB payment integration endpoints
 * Run with: node test-arb-payment.js
 */

const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api/payments/arb`;

// Test configuration
const TEST_CONFIG = {
  // Test order data
  orderId: `TEST_ORDER_${Date.now()}`,
  amount: 100.00,
  currency: 'SAR',
  customerEmail: 'test@drinkmate.com',
  customerName: 'Test Customer',
  customerPhone: '1234567890',
  description: 'Test Payment'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Check environment configuration
function checkConfiguration() {
  logSection('Checking Configuration');
  
  const requiredVars = [
    'ARB_TRANPORTAL_ID',
    'ARB_TRANPORTAL_PASSWORD',
    'ARB_RESOURCE_KEY'
  ];
  
  const missing = [];
  const configured = [];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value || value.includes('your_') || value.includes('from_portal')) {
      missing.push(varName);
      logWarning(`${varName}: Not configured`);
    } else {
      configured.push(varName);
      logSuccess(`${varName}: Configured (${value.substring(0, 10)}...)`);
    }
  });
  
  if (missing.length > 0) {
    logError(`Missing required environment variables: ${missing.join(', ')}`);
    logInfo('Please update your .env file with API credentials from ARB merchant portal');
    return false;
  }
  
  logSuccess('All required environment variables are configured');
  return true;
}

// Test 1: Check if service is configured
async function testServiceConfiguration() {
  logSection('Test 1: Service Configuration Check');
  
  try {
    const arbService = require('./Services/arb-service');
    const isConfigured = arbService.isConfigured();
    
    if (isConfigured) {
      logSuccess('ARB service is properly configured');
      return true;
    } else {
      logError('ARB service is not configured');
      logInfo('Please check your environment variables');
      return false;
    }
  } catch (error) {
    logError(`Failed to check service configuration: ${error.message}`);
    return false;
  }
}

// Test 2: Test encryption/decryption
async function testEncryption() {
  logSection('Test 2: Encryption/Decryption Test');
  
  try {
    const arbService = require('./Services/arb-service');
    
    if (!arbService.isConfigured()) {
      logError('Service not configured - skipping encryption test');
      return false;
    }
    
    const testData = {
      amt: '100.00',
      action: '1',
      id: process.env.ARB_TRANPORTAL_ID,
      password: process.env.ARB_TRANPORTAL_PASSWORD,
      currencyCode: '682',
      trackId: 'TEST_123'
    };
    
    logInfo('Testing encryption...');
    const encrypted = arbService.encryptTrandata(testData);
    logSuccess(`Encryption successful (length: ${encrypted.length})`);
    
    logInfo('Testing decryption...');
    const decrypted = arbService.decryptTrandata(encrypted);
    
    // Verify decrypted data matches original
    if (decrypted.amt === testData.amt && 
        decrypted.trackId === testData.trackId) {
      logSuccess('Decryption successful - data matches original');
      return true;
    } else {
      logError('Decryption failed - data mismatch');
      return false;
    }
  } catch (error) {
    logError(`Encryption/Decryption test failed: ${error.message}`);
    return false;
  }
}

// Test 3: Test payment creation endpoint
async function testCreatePayment() {
  logSection('Test 3: Create Payment Endpoint');
  
  try {
    logInfo(`Testing payment creation for order: ${TEST_CONFIG.orderId}`);
    
    const response = await axios.post(
      `${API_BASE}/create/guest`,
      {
        amount: TEST_CONFIG.amount,
        currency: TEST_CONFIG.currency,
        orderId: TEST_CONFIG.orderId,
        customerEmail: TEST_CONFIG.customerEmail,
        customerName: TEST_CONFIG.customerName,
        customerPhone: TEST_CONFIG.customerPhone,
        description: TEST_CONFIG.description
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    if (response.data && response.data.success) {
      logSuccess('Payment creation successful');
      logInfo(`Payment URL: ${response.data.data.paymentUrl}`);
      logInfo(`Payment ID: ${response.data.data.paymentId}`);
      logInfo(`Track ID: ${response.data.data.trackId}`);
      return {
        success: true,
        data: response.data.data
      };
    } else {
      logError('Payment creation failed');
      logError(`Response: ${JSON.stringify(response.data, null, 2)}`);
      return { success: false };
    }
  } catch (error) {
    if (error.response) {
      logError(`API Error: ${error.response.status} - ${error.response.statusText}`);
      logError(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      logError('Network Error: No response from server');
      logInfo('Make sure the server is running on ' + BASE_URL);
    } else {
      logError(`Error: ${error.message}`);
    }
    return { success: false };
  }
}

// Test 4: Test server connectivity
async function testServerConnectivity() {
  logSection('Test 4: Server Connectivity');
  
  try {
    logInfo(`Testing connection to: ${BASE_URL}`);
    
    // Try to reach a health endpoint or root
    const response = await axios.get(BASE_URL, {
      timeout: 5000,
      validateStatus: () => true // Accept any status code
    });
    
    logSuccess(`Server is reachable (Status: ${response.status})`);
    return true;
  } catch (error) {
    logError(`Server is not reachable: ${error.message}`);
    logInfo('Please make sure the server is running');
    logInfo(`Expected URL: ${BASE_URL}`);
    return false;
  }
}

// Test 5: Test inquiry endpoint (if we have a transaction ID)
async function testInquiry(transId = null) {
  if (!transId) {
    logWarning('Skipping inquiry test - no transaction ID available');
    return false;
  }
  
  logSection('Test 5: Payment Inquiry');
  
  try {
    logInfo(`Testing inquiry for transaction: ${transId}`);
    
    // Note: This requires authentication token in production
    // For testing, you may need to adjust the endpoint
    logWarning('Inquiry endpoint requires authentication - skipping for now');
    return false;
  } catch (error) {
    logError(`Inquiry test failed: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     ARB Payment Gateway Integration Test Suite            ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  const results = {
    configuration: false,
    serviceConfig: false,
    encryption: false,
    serverConnectivity: false,
    createPayment: false
  };
  
  // Check configuration first
  results.configuration = checkConfiguration();
  
  if (!results.configuration) {
    logError('\n⚠️  Configuration check failed. Please configure your .env file first.');
    logInfo('See docs/ARB_CREDENTIALS_NOTES.md for instructions');
    return;
  }
  
  // Test service configuration
  results.serviceConfig = await testServiceConfiguration();
  
  // Test encryption
  results.encryption = await testEncryption();
  
  // Test server connectivity
  results.serverConnectivity = await testServerConnectivity();
  
  if (!results.serverConnectivity) {
    logError('\n⚠️  Server is not running. Please start the server first.');
    logInfo('Run: npm start or npm run dev in the server directory');
    return;
  }
  
  // Test payment creation
  const paymentResult = await testCreatePayment();
  results.createPayment = paymentResult.success;
  
  // Summary
  logSection('Test Summary');
  
  const passed = Object.values(results).filter(r => r === true).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, result]) => {
    if (result) {
      logSuccess(`${test}: PASSED`);
    } else {
      logError(`${test}: FAILED`);
    }
  });
  
  console.log('\n');
  log(`Tests Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  
  if (results.createPayment && paymentResult.data) {
    console.log('\n');
    logSection('Next Steps');
    logInfo('1. Copy the payment URL from above');
    logInfo('2. Open it in a browser to test the payment flow');
    logInfo('3. Complete the payment on ARB payment page');
    logInfo('4. Verify the callback is received and order status is updated');
  }
  
  console.log('\n');
}

// Run tests
runTests().catch(error => {
  logError(`Test suite failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
