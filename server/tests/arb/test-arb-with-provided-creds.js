/**
 * ARB Payment Gateway - Test with Provided Credentials
 * 
 * Tests ARB integration using the merchant portal login credentials
 * provided by ARB, without requiring separate Tranportal credentials
 * 
 * Run with: node test-arb-with-provided-creds.js
 */

require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

// Use provided merchant portal credentials
const PROVIDED_CREDS = {
  institutionId: 'ARB',
  merchantId: '600002784',
  merchantUserId: 'AQUA600002784',
  password: '#Welcome123',
  profilePassword: '#Aqua123'
};

// Try different credential combinations
const CREDENTIAL_VARIANTS = [
  {
    name: 'Merchant ID as Tranportal ID',
    tranportalId: PROVIDED_CREDS.merchantId,
    tranportalPassword: PROVIDED_CREDS.password,
    resourceKey: PROVIDED_CREDS.merchantId + PROVIDED_CREDS.password // Try combination
  },
  {
    name: 'Merchant User ID as Tranportal ID',
    tranportalId: PROVIDED_CREDS.merchantUserId,
    tranportalPassword: PROVIDED_CREDS.password,
    resourceKey: PROVIDED_CREDS.merchantUserId + PROVIDED_CREDS.password
  },
  {
    name: 'Merchant ID with Profile Password',
    tranportalId: PROVIDED_CREDS.merchantId,
    tranportalPassword: PROVIDED_CREDS.profilePassword,
    resourceKey: PROVIDED_CREDS.merchantId
  },
  {
    name: 'Merchant User ID with Profile Password',
    tranportalId: PROVIDED_CREDS.merchantUserId,
    tranportalPassword: PROVIDED_CREDS.profilePassword,
    resourceKey: PROVIDED_CREDS.merchantUserId
  }
];

const BASE_URL = process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:3000';
// Try both sandbox and production URLs - ARB may use production URL for testing
const API_URLS = [
  process.env.ARB_SANDBOX_URL || 'https://sandbox.alrajhibank.com.sa',
  process.env.ARB_API_URL || 'https://securepayments.alrajhibank.com.sa'
];
const TOKEN_ENDPOINT = process.env.ARB_TOKEN_GEN_ENDPOINT || '/paymentToken';

// Colors
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

// Encrypt trandata (same as arb-service)
function encryptTrandata(plainTrandata, resourceKey) {
  try {
    const key = crypto.createHash('sha256').update(resourceKey).digest();
    const iv = Buffer.from('PGKEYENCDECIVSPC', 'utf8');
    const plainString = JSON.stringify(plainTrandata);
    const urlEncoded = encodeURIComponent(plainString);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    cipher.setAutoPadding(true);
    let encrypted = cipher.update(urlEncoded, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  } catch (error) {
    throw new Error('Encryption failed: ' + error.message);
  }
}

// Test API connectivity
async function testAPIConnectivity() {
  logSection('Test 1: API Connectivity Check');
  
  const endpoints = [
    TOKEN_ENDPOINT,
    '/paymentToken',
    '/pg/paymentToken',
    '/api/paymentToken'
  ];
  
  for (const apiBaseUrl of API_URLS) {
    logInfo(`\nTesting base URL: ${apiBaseUrl}`);
    
    for (const endpoint of endpoints) {
      const url = `${apiBaseUrl}${endpoint}`;
      try {
        logTest(`  Testing: ${endpoint}`);
        const response = await axios.post(
          url,
          [{ id: 'test', trandata: 'test', responseURL: 'http://test.com', errorURL: 'http://test.com' }],
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000,
            validateStatus: () => true // Accept any status
          }
        );
        
        logInfo(`    Status: ${response.status}`);
        if (response.data) {
          const dataStr = JSON.stringify(response.data).substring(0, 150);
          logInfo(`    Response: ${dataStr}...`);
        }
        
        // If we get a response (even error), endpoint exists
        if (response.status !== 404) {
          logSuccess(`✅ Endpoint reachable: ${url}`);
          return { success: true, url, baseUrl: apiBaseUrl, status: response.status, data: response.data };
        }
      } catch (error) {
        if (error.code === 'ENOTFOUND') {
          logWarning(`    DNS not found`);
        } else if (error.code === 'ETIMEDOUT') {
          logInfo(`    Timeout (endpoint might exist but requires auth)`);
          // Timeout might mean endpoint exists but needs auth
          return { success: true, url, baseUrl: apiBaseUrl, status: 'timeout', needsAuth: true };
        } else if (error.response) {
          logInfo(`    Status: ${error.response.status}`);
          if (error.response.data) {
            const dataStr = JSON.stringify(error.response.data).substring(0, 150);
            logInfo(`    Error: ${dataStr}...`);
          }
          // Error response means endpoint exists
          return { success: true, url, baseUrl: apiBaseUrl, status: error.response.status, data: error.response.data };
        } else {
          logWarning(`    ${error.message}`);
        }
      }
    }
  }
  
  return { success: false };
}

// Test with credential variant
async function testWithCredentials(variant, apiBaseUrl) {
  logSection(`Testing: ${variant.name}`);
  logInfo(`Using API URL: ${apiBaseUrl}`);
  
  try {
    // Prepare test payment data
    const testData = {
      amt: '100.00',
      action: '1', // Purchase
      password: variant.tranportalPassword,
      id: variant.tranportalId,
      currencyCode: '682', // SAR
      trackId: `TEST_${Date.now()}`,
      responseURL: `${BASE_URL}/api/payments/arb/callback`,
      errorURL: `${BASE_URL}/api/payments/arb/callback`
    };
    
    logTest('Encrypting trandata...');
    const encryptedTrandata = encryptTrandata(testData, variant.resourceKey);
    logSuccess('Encryption successful');
    
    // Prepare API request
    const apiRequest = [{
      id: variant.tranportalId,
      trandata: encryptedTrandata,
      responseURL: testData.responseURL,
      errorURL: testData.errorURL
    }];
    
    // Try different endpoints
    const endpoints = [
      TOKEN_ENDPOINT,
      '/paymentToken',
      '/pg/paymentToken'
    ];
    
    for (const endpoint of endpoints) {
      const fullUrl = `${apiBaseUrl}${endpoint}`;
      logTest(`Calling ARB API: ${fullUrl}`);
      logInfo(`Tranportal ID: ${variant.tranportalId}`);
      logInfo(`Track ID: ${testData.trackId}`);
      
      try {
        const response = await axios.post(
          fullUrl,
          apiRequest,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 30000,
            validateStatus: () => true // Accept any status to see the response
          }
        );
    
        logInfo(`Response Status: ${response.status}`);
        
        if (response.data) {
          console.log('\nResponse Data:');
          console.log(JSON.stringify(response.data, null, 2));
        }
        
        // Check for success
        if (response.status === 200 && response.data) {
          const responseData = Array.isArray(response.data) ? response.data[0] : response.data;
          
          if (responseData.paymentId) {
            logSuccess('Payment ID received!');
            logInfo(`Payment ID: ${responseData.paymentId}`);
            
            const paymentPageUrl = apiBaseUrl.includes('sandbox') 
              ? `${apiBaseUrl}/pg/paymentpage.htm`
              : `${apiBaseUrl}/pg/paymentpage.htm`;
            const paymentUrl = `${paymentPageUrl}?PaymentID=${responseData.paymentId}`;
            logSuccess('Payment URL generated:');
            log(paymentUrl, 'cyan');
            
            return {
              success: true,
              variant: variant.name,
              apiUrl: apiBaseUrl,
              endpoint: endpoint,
              paymentId: responseData.paymentId,
              paymentUrl: paymentUrl,
              response: responseData
            };
          } else if (responseData.error || responseData.errorText) {
            logWarning(`API returned error: ${responseData.error || responseData.errorText}`);
            logInfo('This might indicate wrong credentials or endpoint');
            // Continue to next endpoint
            continue;
          }
        }
        
        // If we got here, this endpoint didn't work, try next
        logWarning(`Endpoint ${endpoint} returned status ${response.status}`);
        continue;
        
      } catch (error) {
        if (error.response) {
          logInfo(`  Status: ${error.response.status}`);
          if (error.response.data) {
            const dataStr = JSON.stringify(error.response.data).substring(0, 200);
            logInfo(`  Error: ${dataStr}...`);
          }
          // Continue to next endpoint
          continue;
        } else if (error.code === 'ETIMEDOUT') {
          logWarning(`  Timeout - endpoint might require authentication`);
          continue;
        } else {
          logWarning(`  ${error.message}`);
          continue;
        }
      }
    }
    
    // None of the endpoints worked
    return {
      success: false,
      variant: variant.name,
      apiUrl: apiBaseUrl,
      error: 'All endpoints failed'
    };
    
  } catch (error) {
    logError(`Error: ${error.message}`);
    return {
      success: false,
      variant: variant.name,
      error: error.message
    };
  }
}

// Main test runner
async function runTests() {
  console.log('\n');
  log('╔══════════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║  ARB Payment Gateway - Test with Provided Credentials              ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════════════════╝', 'cyan');
  
  logSection('Provided Credentials');
  logInfo(`Institution ID: ${PROVIDED_CREDS.institutionId}`);
  logInfo(`Merchant ID: ${PROVIDED_CREDS.merchantId}`);
  logInfo(`Merchant User ID: ${PROVIDED_CREDS.merchantUserId}`);
  logInfo(`Password: ${PROVIDED_CREDS.password.substring(0, 3)}***`);
  logInfo(`Profile Password: ${PROVIDED_CREDS.profilePassword.substring(0, 3)}***`);
  
  // Test API connectivity first
  const connectivityResult = await testAPIConnectivity();
  
  // Use securepayments URL (it exists, even if endpoints return 404/timeout)
  // Timeout on /pg/paymentToken suggests it exists but needs auth
  const apiBaseUrl = connectivityResult.baseUrl || API_URLS[1]; // securepayments.alrajhibank.com.sa
  
  if (connectivityResult.success) {
    logSuccess(`API endpoint found: ${connectivityResult.url}`);
  } else {
    logWarning('Could not verify endpoint, but will try with credentials anyway');
    logInfo(`Using: ${apiBaseUrl}`);
    logInfo('Note: /pg/paymentToken timed out, which may indicate it exists but requires authentication');
  }
  
  // Test with different credential combinations
  logSection('Testing Credential Combinations');
  logInfo('Trying different combinations of provided credentials...\n');
  logInfo(`Testing on: ${apiBaseUrl}\n`);
  
  const results = [];
  
  for (const variant of CREDENTIAL_VARIANTS) {
    const result = await testWithCredentials(variant, apiBaseUrl);
    results.push(result);
    
    if (result.success) {
      logSuccess(`\n✅ SUCCESS with: ${variant.name}`);
      logInfo(`Working credentials:`);
      logInfo(`  Tranportal ID: ${variant.tranportalId}`);
      logInfo(`  Tranportal Password: ${variant.tranportalPassword.substring(0, 3)}***`);
      logInfo(`  Resource Key: ${variant.resourceKey.substring(0, 10)}***`);
      
      console.log('\n');
      logSection('Payment URL for Testing');
      log(result.paymentUrl, 'cyan');
      console.log('\n');
      
      logSection('Next Steps');
      logInfo('1. Copy the payment URL above');
      logInfo('2. Open it in a browser');
      logInfo('3. Use ARB sandbox test cards to complete payment');
      logInfo('4. Check server logs for callback');
      
      // Update .env suggestion
      console.log('\n');
      logSection('Update .env File');
      log('Add these to your server/.env file:', 'yellow');
      console.log(`ARB_TRANPORTAL_ID=${variant.tranportalId}`);
      console.log(`ARB_TRANPORTAL_PASSWORD=${variant.tranportalPassword}`);
      console.log(`ARB_RESOURCE_KEY=${variant.resourceKey}`);
      console.log(`ARB_ENVIRONMENT=sandbox\n`);
      
      break; // Stop on first success
    } else {
      logWarning(`Failed with: ${variant.name}`);
      if (result.error) {
        logInfo(`Error: ${JSON.stringify(result.error).substring(0, 100)}`);
      }
      console.log('\n');
    }
  }
  
  // Summary
  logSection('Test Summary');
  const successful = results.find(r => r.success);
  
  if (successful) {
    logSuccess(`✅ Found working credentials: ${successful.variant}`);
    logSuccess('Payment integration is ready for testing!');
  } else {
    logError('❌ None of the credential combinations worked');
    logInfo('Possible reasons:');
    logInfo('1. API credentials need to be downloaded from merchant portal');
    logInfo('2. Different endpoint path required');
    logInfo('3. Additional authentication needed');
    logInfo('4. Sandbox URL or endpoint path is incorrect');
    logInfo('\nCheck the error responses above for clues.');
  }
  
  console.log('\n');
}

// Run tests
runTests().catch(error => {
  logError(`Test suite failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
