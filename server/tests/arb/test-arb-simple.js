/**
 * Simple ARB Payment Gateway Test
 * Tests encryption/decryption without requiring API credentials
 */

require('dotenv').config();
const arbService = require('./Services/arb-service');

console.log('\n=== ARB Payment Gateway - Simple Encryption Test ===\n');

// Test encryption/decryption with a test resource key
const testResourceKey = 'test_resource_key_for_encryption_testing_only';
const originalResourceKey = process.env.ARB_RESOURCE_KEY;

// Temporarily set a test resource key if none is configured
if (!originalResourceKey || originalResourceKey.includes('your_') || originalResourceKey.includes('from_portal')) {
  console.log('⚠️  No Resource Key configured - using test key for encryption test only');
  process.env.ARB_RESOURCE_KEY = testResourceKey;
  arbService.resourceKey = testResourceKey;
}

try {
  console.log('Testing encryption/decryption...\n');
  
  const testData = {
    amt: '100.00',
    action: '1',
    id: 'TEST_ID',
    password: 'TEST_PASSWORD',
    currencyCode: '682',
    trackId: 'TEST_ORDER_123',
    responseURL: 'https://example.com/success',
    errorURL: 'https://example.com/error'
  };
  
  console.log('Original data:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\n');
  
  // Test encryption
  console.log('1. Encrypting data...');
  const encrypted = arbService.encryptTrandata(testData);
  console.log(`   ✅ Encryption successful`);
  console.log(`   Encrypted length: ${encrypted.length} characters`);
  console.log(`   Encrypted (first 50 chars): ${encrypted.substring(0, 50)}...\n`);
  
  // Test decryption
  console.log('2. Decrypting data...');
  const decrypted = arbService.decryptTrandata(encrypted);
  console.log(`   ✅ Decryption successful\n`);
  
  // Verify
  console.log('3. Verifying decrypted data...');
  const matches = (
    decrypted.amt === testData.amt &&
    decrypted.action === testData.action &&
    decrypted.trackId === testData.trackId &&
    decrypted.currencyCode === testData.currencyCode
  );
  
  if (matches) {
    console.log('   ✅ Decrypted data matches original!\n');
    console.log('Decrypted data:');
    console.log(JSON.stringify(decrypted, null, 2));
    console.log('\n✅ Encryption/Decryption test PASSED\n');
  } else {
    console.log('   ❌ Decrypted data does not match original\n');
    console.log('Expected:', JSON.stringify(testData, null, 2));
    console.log('Got:', JSON.stringify(decrypted, null, 2));
    console.log('\n❌ Encryption/Decryption test FAILED\n');
  }
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error(error.stack);
} finally {
  // Restore original resource key
  if (originalResourceKey) {
    process.env.ARB_RESOURCE_KEY = originalResourceKey;
    arbService.resourceKey = originalResourceKey;
  }
}

console.log('\n=== Test Complete ===\n');
console.log('Note: To test the full payment flow, you need:');
console.log('1. ARB_TRANPORTAL_ID (from merchant portal)');
console.log('2. ARB_TRANPORTAL_PASSWORD (from merchant portal)');
console.log('3. ARB_RESOURCE_KEY (from merchant portal)');
console.log('\nSee docs/ARB_CREDENTIALS_NOTES.md for instructions\n');
