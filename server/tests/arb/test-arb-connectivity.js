/**
 * ARB Payment Gateway - Connectivity Test Harness
 * 
 * Tests DNS/connectivity to ARB_BASE_URL and verifies endpoint reachability
 * Tests token generation with correct HEX encryption output format
 * 
 * Run with: node test-arb-connectivity.js
 */

require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const dns = require('dns').promises;

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

// Extract hostname from URL
function getHostname(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return null;
  }
}

// Test DNS resolution
async function testDNS(hostname) {
  logSection('Test 1: DNS Resolution');
  
  if (!hostname) {
    logError('No hostname provided');
    return { success: false, error: 'No hostname' };
  }
  
  try {
    logTest(`Resolving DNS for: ${hostname}`);
    const addresses = await dns.resolve4(hostname);
    logSuccess(`DNS resolved successfully`);
    logInfo(`IP addresses: ${addresses.join(', ')}`);
    return { success: true, addresses };
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      logError(`DNS not found: ${hostname}`);
      logInfo('This indicates the hostname is incorrect or unreachable');
    } else if (error.code === 'ECONNREFUSED') {
      logError(`Connection refused`);
    } else {
      logError(`DNS resolution failed: ${error.message}`);
    }
    return { success: false, error: error.message, code: error.code };
  }
}

// Test endpoint connectivity
async function testEndpointConnectivity(baseUrl, endpointPath) {
  logSection('Test 2: Endpoint Connectivity');
  
  const fullUrl = `${baseUrl}${endpointPath}`;
  logTest(`Testing endpoint: ${fullUrl}`);
  
  try {
    // Send a minimal test request
    const testRequest = [{
      id: 'test',
      trandata: 'test',
      responseURL: 'http://test.com',
      errorURL: 'http://test.com'
    }];
    
    const response = await axios.post(
      fullUrl,
      testRequest,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
        validateStatus: () => true // Accept any status
      }
    );
    
    logInfo(`Response Status: ${response.status}`);
    
    if (response.status === 200) {
      logSuccess('Endpoint is reachable and responding');
      return { success: true, status: response.status, data: response.data };
    } else if (response.status === 404) {
      logWarning('Endpoint returned 404 - path may be incorrect');
      return { success: false, status: response.status, error: 'Not Found' };
    } else if (response.status >= 400 && response.status < 500) {
      logWarning(`Endpoint returned ${response.status} - may require authentication`);
      logInfo('This is expected - endpoint exists but needs valid credentials');
      return { success: true, status: response.status, needsAuth: true };
    } else {
      logInfo(`Endpoint responded with status ${response.status}`);
      return { success: true, status: response.status };
    }
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      logError('DNS not found - check ARB_BASE_URL');
      return { success: false, error: 'DNS not found', code: error.code };
    } else if (error.code === 'ECONNREFUSED') {
      logError('Connection refused - check firewall/VPN');
      return { success: false, error: 'Connection refused', code: error.code };
    } else if (error.code === 'ETIMEDOUT') {
      logWarning('Connection timeout - endpoint may exist but is slow or requires auth');
      return { success: false, error: 'Timeout', code: error.code };
    } else if (error.response) {
      logInfo(`HTTP ${error.response.status} - endpoint exists`);
      return { success: true, status: error.response.status, needsAuth: true };
    } else {
      logError(`Connectivity test failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

// Test HEX encryption format
async function testHEXEncryption() {
  logSection('Test 3: HEX Encryption Format');
  
  const resourceKey = process.env.ARB_RESOURCE_KEY;
  
  if (!resourceKey || resourceKey.includes('your_') || resourceKey.includes('from_portal')) {
    logWarning('ARB_RESOURCE_KEY not configured - using test key');
    logInfo('This test verifies encryption format only');
  }
  
  try {
    const testKey = resourceKey || 'test_resource_key_for_encryption_format_test';
    const testData = {
      amt: '100.00',
      action: '1',
      id: 'TEST_ID',
      password: 'TEST_PASSWORD',
      currencyCode: '682',
      trackId: 'TEST_ORDER_123',
      responseURL: 'https://test.com/success',
      errorURL: 'https://test.com/error'
    };
    
    logTest('Encrypting test data...');
    
    // Encrypt using same method as arb-service
    const key = crypto.createHash('sha256').update(testKey).digest();
    const iv = Buffer.from('PGKEYENCDECIVSPC', 'utf8');
    const plainString = JSON.stringify(testData);
    const urlEncoded = encodeURIComponent(plainString);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    cipher.setAutoPadding(true);
    
    // CRITICAL: Output in HEX format (not base64)
    let encrypted = cipher.update(urlEncoded, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    logSuccess('Encryption successful');
    logInfo(`Output format: HEX`);
    logInfo(`Encrypted length: ${encrypted.length} characters`);
    logInfo(`First 50 chars: ${encrypted.substring(0, 50)}...`);
    
    // Verify it's valid HEX
    const hexPattern = /^[0-9a-fA-F]+$/;
    if (hexPattern.test(encrypted)) {
      logSuccess('Encrypted output is valid HEX format');
    } else {
      logError('Encrypted output is NOT valid HEX format!');
      return { success: false };
    }
    
    // Test decryption
    logTest('Testing decryption...');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    decipher.setAutoPadding(true);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    const urlDecoded = decodeURIComponent(decrypted);
    const decryptedData = JSON.parse(urlDecoded);
    
    if (decryptedData.amt === testData.amt && decryptedData.trackId === testData.trackId) {
      logSuccess('Decryption successful - data integrity verified');
      return { success: true, encrypted };
    } else {
      logError('Decryption failed - data mismatch');
      return { success: false };
    }
  } catch (error) {
    logError(`Encryption test failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Test token generation (if credentials available)
async function testTokenGeneration() {
  logSection('Test 4: Token Generation (if credentials available)');
  
  const tranportalId = process.env.ARB_TRANPORTAL_ID;
  const tranportalPassword = process.env.ARB_TRANPORTAL_PASSWORD;
  const resourceKey = process.env.ARB_RESOURCE_KEY;
  const baseUrl = process.env.ARB_BASE_URL || process.env.ARB_API_URL || 'https://securepayments.alrajhibank.com.sa';
  const endpointPath = process.env.ARB_TOKEN_ENDPOINT_PATH || process.env.ARB_TOKEN_GEN_ENDPOINT || '/paymentToken';
  
  if (!tranportalId || !tranportalPassword || !resourceKey ||
      tranportalId.includes('your_') || tranportalPassword.includes('your_') || resourceKey.includes('your_')) {
    logWarning('ARB credentials not fully configured');
    logInfo('Skipping token generation test');
    logInfo('Configure ARB_TRANPORTAL_ID, ARB_TRANPORTAL_PASSWORD, and ARB_RESOURCE_KEY to test');
    return { success: false, skipped: true };
  }
  
  try {
    logTest('Creating test payment token...');
    
    // Prepare test payment data
    const testData = {
      amt: '100.00',
      action: '1',
      password: tranportalPassword,
      id: tranportalId,
      currencyCode: '682',
      trackId: `TEST_${Date.now()}`,
      responseURL: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/payments/arb/callback`,
      errorURL: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/payments/arb/callback`
    };
    
    // Encrypt (HEX format) - Use raw resource key bytes (not SHA-256 hash)
    const key = Buffer.from(resourceKey, 'utf8');
    const iv = Buffer.from('PGKEYENCDECIVSPC', 'utf8');
    // CRITICAL: Plain trandata must be a JSON ARRAY per PDF specification
    const plainTrandataArray = [testData];
    const plainString = JSON.stringify(plainTrandataArray);
    const urlEncoded = encodeURIComponent(plainString);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    cipher.setAutoPadding(true);
    let encrypted = cipher.update(urlEncoded, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    encrypted = encrypted.toUpperCase(); // ARB expects uppercase HEX
    
    // Prepare API request (as per ARB specification - array format)
    const apiRequest = [{
      id: tranportalId,
      trandata: encrypted,
      responseURL: testData.responseURL,
      errorURL: testData.errorURL
    }];
    
    logInfo(`Request format: Array with id, trandata, responseURL, errorURL`);
    logInfo(`Trandata length: ${encrypted.length} characters (HEX)`);
    
    const fullUrl = `${baseUrl}${endpointPath}`;
    logTest(`Calling: ${fullUrl}`);
    
    const response = await axios.post(
      fullUrl,
      apiRequest,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
        validateStatus: () => true
      }
    );
    
    logInfo(`Response Status: ${response.status}`);
    
    if (response.status === 200 && response.data) {
      const responseData = Array.isArray(response.data) ? response.data[0] : response.data;
      
      // ARB returns success with status="1" and result="paymentId:paymentPageUrl"
      if (responseData.status === '1' && responseData.result) {
        const [paymentId, paymentPageUrl] = responseData.result.split(':');
        if (paymentId && paymentPageUrl) {
          logSuccess('Token generation successful!');
          logInfo(`Payment ID: ${paymentId}`);
          logInfo(`Payment Page URL: ${paymentPageUrl}`);
          return { success: true, paymentId, paymentPageUrl, data: responseData };
        }
      }
      
      // Check for direct paymentId field (fallback)
      if (responseData.paymentId) {
        logSuccess('Token generation successful!');
        logInfo(`Payment ID: ${responseData.paymentId}`);
        return { success: true, paymentId: responseData.paymentId, data: responseData };
      }
      
      // Check for error
      if (responseData.error) {
        logWarning(`API returned error: ${responseData.error} - ${responseData.errorText || ''}`);
        logInfo('This may indicate incorrect credentials or endpoint path');
        return { success: false, error: responseData.error, errorText: responseData.errorText };
      }
    }
    
    logWarning(`Unexpected response: ${JSON.stringify(response.data).substring(0, 200)}`);
    return { success: false, status: response.status, data: response.data };
    
  } catch (error) {
    if (error.response) {
      logError(`API Error: ${error.response.status}`);
      if (error.response.data) {
        logInfo(`Error: ${JSON.stringify(error.response.data).substring(0, 200)}`);
      }
    } else {
      logError(`Error: ${error.message}`);
    }
    return { success: false, error: error.message };
  }
}

// Main test runner
async function runTests() {
  console.log('\n');
  log('╔══════════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║     ARB Payment Gateway - Connectivity Test Harness                 ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════════════════╝', 'cyan');
  
  // Get configuration
  const baseUrl = process.env.ARB_BASE_URL || process.env.ARB_API_URL || process.env.ARB_SANDBOX_URL || 'https://securepayments.alrajhibank.com.sa';
  const endpointPath = process.env.ARB_TOKEN_ENDPOINT_PATH || process.env.ARB_TOKEN_GEN_ENDPOINT || '/pg/payment/hosted.htm';
  
  logSection('Configuration');
  logInfo(`ARB_BASE_URL: ${baseUrl}`);
  logInfo(`ARB_TOKEN_ENDPOINT_PATH: ${endpointPath}`);
  logInfo(`ARB_TRANPORTAL_ID: ${process.env.ARB_TRANPORTAL_ID ? '✅ Configured' : '❌ Not configured'}`);
  logInfo(`ARB_RESOURCE_KEY: ${process.env.ARB_RESOURCE_KEY ? '✅ Configured' : '❌ Not configured'}`);
  
  const results = {
    dns: false,
    connectivity: false,
    encryption: false,
    tokenGeneration: false
  };
  
  // Test 1: DNS
  const hostname = getHostname(baseUrl);
  if (hostname) {
    const dnsResult = await testDNS(hostname);
    results.dns = dnsResult.success;
  } else {
    logError('Invalid base URL format');
  }
  
  // Test 2: Endpoint connectivity
  const connectivityResult = await testEndpointConnectivity(baseUrl, endpointPath);
  results.connectivity = connectivityResult.success;
  
  // Test 3: HEX encryption
  const encryptionResult = await testHEXEncryption();
  results.encryption = encryptionResult.success;
  
  // Test 4: Token generation (if credentials available)
  const tokenResult = await testTokenGeneration();
  if (!tokenResult.skipped) {
    results.tokenGeneration = tokenResult.success;
  }
  
  // Summary
  logSection('Test Summary');
  
  Object.entries(results).forEach(([test, result]) => {
    if (result) {
      logSuccess(`${test}: PASSED`);
    } else {
      logError(`${test}: FAILED`);
    }
  });
  
  const passed = Object.values(results).filter(r => r === true).length;
  const total = Object.keys(results).length;
  
  console.log('\n');
  log(`Tests Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  
  if (!results.dns) {
    log('\n⚠️  DNS resolution failed - check ARB_BASE_URL', 'yellow');
    log('   Error code indicates:', 'yellow');
    log('   - ENOTFOUND: Wrong hostname/URL', 'yellow');
    log('   - ECONNREFUSED: Firewall/VPN blocking', 'yellow');
  }
  
  if (!results.connectivity && results.dns) {
    log('\n⚠️  Endpoint not reachable - verify endpoint path', 'yellow');
    log(`   Current path: ${endpointPath}`, 'yellow');
    log('   Check ARB documentation for correct path', 'yellow');
  }
  
  console.log('\n');
}

// Run tests
runTests().catch(error => {
  logError(`Test suite failed: ${error.message}`);
  console.error(error);
  process.exit(1);
});
