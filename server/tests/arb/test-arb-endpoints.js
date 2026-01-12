/**
 * ARB Payment Gateway - Endpoint Discovery
 * 
 * Tests different possible ARB API endpoints to find the correct one
 */

require('dotenv').config();
const axios = require('axios');

// Possible base URLs
const BASE_URLS = [
  'https://sandbox.alrajhibank.com.sa',
  'https://securepayments.alrajhibank.com.sa',
  'https://test.alrajhibank.com.sa',
  'https://api.alrajhibank.com.sa',
  'https://pg.alrajhibank.com.sa',
  'https://payments.alrajhibank.com.sa'
];

// Possible endpoints
const ENDPOINTS = [
  '/paymentToken',
  '/api/paymentToken',
  '/api/v1/paymentToken',
  '/PaymentToken',
  '/pg/paymentToken',
  '/payment/token',
  '/transaction/paymentToken'
];

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
  console.log('\n' + '='.repeat(70));
  log(title, 'cyan');
  console.log('='.repeat(70));
}

async function testEndpoint(baseUrl, endpoint) {
  const fullUrl = `${baseUrl}${endpoint}`;
  
  try {
    log(`Testing: ${fullUrl}`, 'blue');
    
    const response = await axios.post(
      fullUrl,
      [{ id: 'test', trandata: 'test', responseURL: 'http://test.com', errorURL: 'http://test.com' }],
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
        validateStatus: () => true
      }
    );
    
    log(`  Status: ${response.status}`, response.status === 200 ? 'green' : 'yellow');
    
    if (response.data) {
      const dataStr = JSON.stringify(response.data).substring(0, 150);
      log(`  Response: ${dataStr}...`, 'blue');
    }
    
    if (response.status !== 404 && response.status !== 0) {
      return { success: true, url: fullUrl, status: response.status, data: response.data };
    }
    
    return { success: false };
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      log(`  ❌ DNS not found`, 'red');
    } else if (error.code === 'ECONNREFUSED') {
      log(`  ❌ Connection refused`, 'red');
    } else if (error.code === 'ETIMEDOUT') {
      log(`  ⏱️  Timeout`, 'yellow');
    } else if (error.response) {
      log(`  Status: ${error.response.status}`, 'yellow');
      if (error.response.data) {
        const dataStr = JSON.stringify(error.response.data).substring(0, 150);
        log(`  Error Response: ${dataStr}...`, 'blue');
      }
      // Even errors mean the endpoint exists
      return { 
        success: true, 
        url: fullUrl, 
        status: error.response.status, 
        data: error.response.data 
      };
    } else {
      log(`  Error: ${error.message}`, 'yellow');
    }
    
    return { success: false };
  }
}

async function discoverEndpoints() {
  logSection('ARB Endpoint Discovery');
  log('Testing different base URLs and endpoints...\n', 'yellow');
  
  const found = [];
  
  for (const baseUrl of BASE_URLS) {
    log(`\nBase URL: ${baseUrl}`, 'cyan');
    
    for (const endpoint of ENDPOINTS) {
      const result = await testEndpoint(baseUrl, endpoint);
      if (result.success) {
        found.push(result);
        log(`\n✅ FOUND: ${result.url}`, 'green');
      }
    }
  }
  
  logSection('Discovery Summary');
  
  if (found.length > 0) {
    log('Found working endpoints:', 'green');
    found.forEach((f, i) => {
      log(`\n${i + 1}. ${f.url}`, 'cyan');
      log(`   Status: ${f.status}`, 'blue');
    });
  } else {
    log('❌ No working endpoints found', 'red');
    log('\nPossible reasons:', 'yellow');
    log('1. Network/firewall blocking access');
    log('2. Endpoints require authentication first');
    log('3. Different URL structure than expected');
    log('4. Need to check ARB documentation for exact URLs');
  }
  
  console.log('\n');
}

discoverEndpoints().catch(error => {
  log(`Discovery failed: ${error.message}`, 'red');
  console.error(error);
});
