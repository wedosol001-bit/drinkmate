# Tests Directory

This directory contains all test files for the DrinkMate backend.

## Structure

```
tests/
├── arb/              # ARB Payment Gateway tests
├── integration/      # Integration tests
├── unit/             # Unit tests
└── README.md         # This file
```

## ARB Payment Gateway Tests

- `test-arb-connectivity.js` - Tests DNS, connectivity, encryption, and token generation
- `test-arb-payment.js` - Tests full payment flow through API endpoints
- `test-arb-sandbox.js` - Tests sandbox environment
- `test-arb-simple.js` - Simple encryption/decryption test
- `test-arb-with-provided-creds.js` - Tests with provided credentials
- `test-arb-endpoints.js` - Tests endpoint discovery

## Integration Tests

- `test-frontend-integration.js` - Tests frontend-backend integration
- `check-accessories-subcategories.js` - Tests product category structure

## Running Tests

```bash
# Run all ARB tests
npm run test-arb-connectivity
npm run test-arb-payment
npm run test-arb-sandbox

# Run integration tests
node tests/integration/test-frontend-integration.js
```

## Test Environment

Make sure your `.env` file is configured with:
- `ARB_TRANPORTAL_ID`
- `ARB_TRANPORTAL_PASSWORD`
- `ARB_RESOURCE_KEY`
- `ARB_BASE_URL`
- `BACKEND_URL`
- `FRONTEND_URL`
