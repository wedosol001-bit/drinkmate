/**
 * ARB Payment Gateway - Sandbox Testing Script
 * 
 * This script tests the ARB payment integration with sandbox credentials
 * Run with: node test-arb-sandbox.js
 */

require('dotenv').config();
const axios = require('axios');
const arbService = require('./Services/arb-service');

const BASE_URL = process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api/payments/arb`;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(70));
  log(title, 'cyan');
  console.log('='.repeat(70));
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

function logTest(message) {
  log(`🧪 ${message}`, 'magenta');
}

// Test configuration
const TEST_CONFIG = {
  orderId: `TEST_ARB_${Date.now()}`,
  amount: 100.00,
  currency: 'SAR',
  customerEmail: 'test@drinkmate.com',
  customerName: 'Test Customer',
  customerPhone: '1234567890',
  description: 'ARB Sandbox Test Payment'
};

// Check if we're using sandbox
function checkSandboxConfig() {
  logSection('Sandbox Configuration Check');
  
  const env = process.env.ARB_ENVIRONMENT || 'sandbox';
  if (env === 'sandbox') {
    logSuccess(`Environment: ${env}`);
    logInfo(`Sandbox URL: ${process.env.ARB_SANDBOX_URL || 'https://sandbox.alrajhibank.com.sa'}`);
  } else {
    logWarning(`Environment: ${env} (should be 'sandbox' for testing)`);
  }
  
  // Check credentials
  const hasTranportalId = process.env.ARB_TRANPORTAL_ID && 
                          !process.env.ARB_TRANPORTAL_ID.includes('your_') &&
                          !process.env.ARB_TRANPORTAL_ID.includes('from_portal');
  const hasPassword = process.env.ARB_TRANPORTAL_PASSWORD &&
                     !process.env.ARB_TRANPORTAL_PASSWORD.includes('your_') &&
                     !process.env.ARB_TRANPORTAL_PASSWORD.includes('from_portal');
  const hasResourceKey = process.env.ARB_RESOURCE_KEY &&
                        !process.env.ARB_RESOURCE_KEY.includes('your_') &&
                        !process.env.ARB_RESOURCE_KEY.includes('from_portal');
  
  if (hasTranportalId) {
    logSuccess('ARB_TRANPORTAL_ID: Configured');
  } else {
    logError('ARB_TRANPORTAL_ID: Not configured (needed for API calls)');
  }
  
  if (hasPassword) {
    logSuccess('ARB_TRANPORTAL_PASSWORD: Configured');
  } else {
    logError('ARB_TRANPORTAL_PASSWORD: Not configured (needed for API calls)');
  }
  
  if (hasResourceKey) {
    logSuccess('ARB_RESOURCE_KEY: Configured');
  } else {
    logError('ARB_RESOURCE_KEY: Not configured (needed for encryption)');
  }
  
  return hasTranportalId && hasPassword && hasResourceKey;
}

// Test encryption with actual credentials
async function testEncryptionWithCredentials() {
  logSection('Test 1: Encryption with Actual Credentials');
  
  if (!arbService.isConfigured()) {
    logError('Service not configured - cannot test encryption');
    return false;
  }
  
  try {
    const testData = {
      amt: TEST_CONFIG.amount.toFixed(2),
      action: '1',
      id: process.env.ARB_TRANPORTAL_ID,
      password: process.env.ARB_TRANPORTAL_PASSWORD,
      currencyCode: '682',
      trackId: TEST_CONFIG.orderId,
      responseURL: `${BASE_URL}/api/payments/arb/callback`,
      errorURL: `${BASE_URL}/api/payments/arb/callback`
    };
    
    logTest('Encrypting test data...');
    const encrypted = arbService.encryptTrandata(testData);
    logSuccess(`Encryption successful (${encrypted.length} chars)`);
    
    logTest('Decrypting to verify...');
    const decrypted = arbService.decryptTrandata(encrypted);
    
    if (decrypted.amt === testData.amt && decrypted.trackId === testData.trackId) {
      logSuccess('Decryption verified - data integrity confirmed');
      return true;
    } else {
      logError('Decryption failed - data mismatch');
      return false;
    }
  } catch (error) {
    logError(`Encryption test failed: ${error.message}`);
    return false;
  }
}

// Test payment creation
async function testPaymentCreation() {
  logSection('Test 2: Payment Creation (Sandbox)');
  
  try {
    logTest(`Creating payment for order: ${TEST_CONFIG.orderId}`);
    logInfo(`Amount: ${TEST_CONFIG.amount} ${TEST_CONFIG.currency}`);
    
    const response = await axios.post(
      `${API_BASE}/create/guest`,
      TEST_CONFIG,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    if (response.data && response.data.success) {
      logSuccess('Payment creation successful!');
      logInfo(`Payment URL: ${response.data.data.paymentUrl}`);
      logInfo(`Payment ID: ${response.data.data.paymentId}`);
      logInfo(`Track ID: ${response.data.data.trackId}`);
      
      console.log('\n');
      logSection('Next Steps for Manual Testing');
      logInfo('1. Copy the Payment URL above');
      logInfo('2. Open it in a browser');
      logInfo('3. Use ARB sandbox test cards to complete payment');
      logInfo('4. Verify callback is received');
      logInfo('5. Check order status in database');
      
      return {
        success: true,
        paymentUrl: response.data.data.paymentUrl,
        paymentId: response.data.data.paymentId,
        trackId: response.data.data.trackId
      };
    } else {
      logError('Payment creation failed');
      if (response.data) {
        logError(`Response: ${JSON.stringify(response.data, null, 2)}`);
      }
      return { success: false };
    }
  } catch (error) {
    if (error.response) {
      logError(`API Error: ${error.response.status} ${error.response.statusText}`);
      if (error.response.data) {
        logError(`Error Details: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    } else if (error.request) {
      logError('Network Error: Server not reachable');
      logInfo(`Make sure server is running on: ${BASE_URL}`);
      logInfo('Start server with: npm start');
    } else {
      logError(`Error: ${error.message}`);
    }
    return { success: false };
  }
}

// Test server connectivity
async function testServerConnectivity() {
  logSection('Test 0: Server Connectivity');
  
  try {
    logTest(`Testing connection to: ${BASE_URL}`);
    const response = await axios.get(BASE_URL, {
      timeout: 5000,
      validateStatus: () => true
    });
    
    logSuccess(`Server is reachable (Status: ${response.status})`);
    return true;
  } catch (error) {
    logError(`Server is not reachable: ${error.message}`);
    logInfo('Please start the server first:');
    logInfo('  cd server');
    logInfo('  npm start');
    return false;
  }
}

// Main test runner
async function runSandboxTests() {
  console.log('\n');
  log('╔══════════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     ARB Payment Gateway - Sandbox Testing Suite                     ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════════════════╝', 'cyan');
  
  const results = {
    sandboxConfig: false,
    serverConnectivity: false,
    encryption: false,
    paymentCreation: false
  };
  
  // Check sandbox configuration
  results.sandboxConfig = checkSandboxConfig();
  
  if (!results.sandboxConfig) {
    logError('\n⚠️  Sandbox configuration incomplete.');
    logInfo('Please configure ARB_TRANPORTAL_ID, ARB_TRANPORTAL_PASSWORD, and ARB_RESOURCE_KEY');
    logInfo('These credentials can be obtained from the ARB Merchant Portal');
    logInfo('See docs/ARB_CREDENTIALS_NOTES.md for instructions');
    return;
  }
  
  // Test server connectivity
  results.serverConnectivity = await testServerConnectivity();
  
  if (!results.serverConnectivity) {
    logError('\n⚠️  Server is not running. Please start the server first.');
    return;
  }
  
  // Test encryption
  results.encryption = await testEncryptionWithCredentials();
  
  // Test payment creation
  const paymentResult = await testPaymentCreation();
  results.paymentCreation = paymentResult.success;
  
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
  
  if (results.paymentCreation && paymentResult.paymentUrl) {
    console.log('\n');
    logSection('Test Card Information');
    logInfo('Use these test cards in ARB sandbox (check ARB documentation for exact numbers):');
    logInfo('- Visa: 4111111111111111');
    logInfo('- MasterCard: 5555555555554444');
    logInfo('- Mada: Check ARB sandbox documentation');
    logInfo('Use any future expiry date and any CVV');
    
    console.log('\n');
    logSection('Payment URL for Testing');
    log(paymentResult.paymentUrl, 'cyan');
    console.log('\n');
  }
  
  console.log('\n');
}

// Run tests
runSandboxTests().catch(error => {
  logError(`Test suite failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
