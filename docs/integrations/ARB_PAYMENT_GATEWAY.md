# ARB Payment Gateway Integration - Complete Guide

## Overview

This document provides a complete guide for the Al Rajhi Bank (ARB) Payment Gateway integration in Drinkmate. This is a production-grade implementation that follows the ARB Merchant Implementation Guide REST API specification.

## Table of Contents

1. [Implementation Summary](#implementation-summary)
2. [Architecture](#architecture)
3. [Setup Guide](#setup-guide)
4. [Payment Flow](#payment-flow)
5. [API Reference](#api-reference)
6. [Transaction Operations](#transaction-operations)
7. [Error Handling](#error-handling)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## Implementation Summary

### ✅ Completed Features

1. **Core Payment Flow**
   - Payment token generation with AES encryption
   - Payment URL framing and customer redirect
   - Callback handling (GET redirects and POST notifications)
   - Payment verification and order status updates

2. **Encryption/Decryption**
   - AES-256-CBC with PKCS5Padding (PKCS7 in Node.js)
   - Fixed IV: `PGKEYENCDECIVSPC` (as per ARB specification)
   - Resource Key derived using SHA256
   - **CRITICAL**: URL-encode before encryption, URL-decode after decryption

3. **Transaction Operations**
   - Inquiry (Action Code 8)
   - Refund (Action Code 2)
   - Void Purchase (Action Code 3)
   - Void Authorization (Action Code 9)
   - Capture (Action Code 5)

4. **Merchant Notifications/Webhooks**
   - Notification handler with quick acknowledgement
   - Idempotent processing to prevent duplicate updates

5. **Database Integration**
   - Payment model extended with ARB-specific fields
   - Automatic order status updates
   - Payment record creation/updates

6. **Frontend Integration**
   - ARB payment option added to checkout page
   - Seamless payment flow integration

---

## Architecture

### Codebase Structure

- **Frontend**: Next.js (React) - `drinkmate-main/`
- **Backend**: Node.js/Express - `server/`
- **Database**: MongoDB with Mongoose

### Key Files

**Backend:**
- `server/Services/arb-service.js` - Core ARB service (encryption, API calls, operations)
- `server/Controller/arb-controller.js` - HTTP request handlers with order updates
- `server/Router/payment-router.js` - Payment routes
- `server/Models/payment-model.js` - Extended with ARB fields

**Frontend:**
- `drinkmate-main/app/checkout/page.tsx` - ARB payment option

---

## Setup Guide

### Prerequisites

- ARB merchant account
- Access to ARB merchant portal
- Backend server with Node.js/Express
- MongoDB database

### Step 1: Obtain Credentials

Log in to your ARB merchant portal and download:

1. **Tranportal ID** - Unique identifier for your merchant account
2. **Tranportal Password** - Password for authentication
3. **Resource Key** - Key used for AES encryption/decryption
4. **API Endpoint URLs** - Base URLs for sandbox and production

**Important**: Keep these credentials secure and never commit them to version control.

### Step 2: Configure Environment Variables

Update your `.env` file:

```env
# ARB (Al Rajhi Bank) Payment Gateway
ARB_TRANPORTAL_ID=your_tranportal_id_here
ARB_TRANPORTAL_PASSWORD=your_tranportal_password_here
ARB_RESOURCE_KEY=your_resource_key_here

# API Configuration
ARB_TOKEN_GEN_ENDPOINT=/paymentToken
ARB_API_URL=https://securepayments.alrajhibank.com.sa
ARB_SANDBOX_URL=https://sandbox.alrajhibank.com.sa
ARB_ENVIRONMENT=sandbox

# Payment Page URLs
ARB_PAYMENT_PAGE_URL=https://securepayments.alrajhibank.com.sa/pg/paymentpage.htm
ARB_SANDBOX_PAYMENT_PAGE_URL=https://sandbox.alrajhibank.com.sa/pg/paymentpage.htm

# Base URLs for callbacks
DRINKMATE_BASE_URL=https://your-frontend-url.com
BACKEND_URL=https://your-backend-url.com
API_URL=${BACKEND_URL}
FRONTEND_URL=${DRINKMATE_BASE_URL}
```

### Step 3: Verify API Endpoint

**CRITICAL**: Verify the exact API endpoint path from ARB documentation. The default is `/paymentToken`, but it may vary. Update `ARB_TOKEN_GEN_ENDPOINT` accordingly.

### Step 4: Configure Callback URLs

Ensure your callback URLs are accessible from ARB servers:

- **Success/Error URL**: `https://your-backend-url.com/api/payments/arb/callback`
- **Notification URL**: `https://your-backend-url.com/api/payments/arb/notify`

These URLs must:
- Use HTTPS (required for production)
- Be publicly accessible
- Respond quickly (notification handler must acknowledge within timeout)

### Step 5: Test in Sandbox

1. Set `ARB_ENVIRONMENT=sandbox` in your `.env` file
2. Use sandbox credentials provided by ARB
3. Test the complete payment flow
4. Verify callback handling and order status updates

### Step 6: Switch to Production

Once sandbox testing is successful:

1. Update `ARB_ENVIRONMENT=production` in your `.env` file
2. Replace sandbox credentials with production credentials
3. Update all URLs to production endpoints
4. Test with a small transaction first
5. Monitor logs for any issues

---

## Payment Flow

### Complete Payment Flow

1. **Customer initiates checkout** → Selects "Credit/Debit (Al Rajhi)"
2. **Frontend calls backend** → `POST /api/payments/arb/create` or `/create/guest`
3. **Backend creates payment token**:
   - Builds plain trandata with required fields
   - URL-encodes the trandata string
   - Encrypts using AES-256-CBC with Resource Key
   - Calls ARB Payment Token Generation API
4. **ARB returns paymentId** → Backend frames payment URL
5. **Customer redirected** → `https://securepayments.alrajhibank.com.sa/pg/paymentpage.htm?PaymentID={paymentId}`
6. **Customer completes payment** → On ARB-hosted payment page
7. **ARB redirects back** → To callback URL with encrypted trandata
8. **Backend processes callback**:
   - Decrypts trandata
   - URL-decodes the decrypted string
   - Verifies payment status
   - Updates order status to 'paid' and 'confirmed'
   - Creates/updates payment record

### Payment Token Generation

**Request Format:**
```json
[{
  "id": "TRANPORTAL_ID",
  "trandata": "<AES_ENCRYPTED_DATA>",
  "responseURL": "https://merchant.com/success",
  "errorURL": "https://merchant.com/error"
}]
```

**Plain Trandata (before encryption):**
```json
{
  "amt": "100.00",
  "action": "1",  // 1 = Purchase, 4 = Authorization
  "password": "TRANPORTAL_PASSWORD",
  "id": "TRANPORTAL_ID",
  "currencyCode": "682",  // 682 = SAR
  "trackId": "ORDER_123",
  "responseURL": "https://merchant.com/success",
  "errorURL": "https://merchant.com/error",
  "langid": "ar",  // Optional: 'ar' for Arabic
  "udf1": "Additional data",  // Optional
  "udf2": "",  // Optional
  "udf3": "",  // Optional (set to 'iframe' for iframe mode)
  "udf4": "",  // Optional
  "udf5": ""   // Optional (used for inquiry/refund/void operations)
}
```

**Response Format:**
```json
[{
  "paymentId": "100201931620827468",
  "trandata": "<encrypted>",
  "error": "",
  "errorText": ""
}]
```

### Payment URL Framing

After receiving `paymentId` from the initial response:

```
https://securepayments.alrajhibank.com.sa/pg/paymentpage.htm?PaymentID={paymentId}
```

**Sandbox:**
```
https://sandbox.alrajhibank.com.sa/pg/paymentpage.htm?PaymentID={paymentId}
```

### Callback Response

**URL Redirection Format** (if notification disabled):
```
https://merchant.com/success?paymentId=100201931620827468&trandata=<encrypted>&error=&errorText=
```

**Final Response Format** (if notification enabled):
```json
[{
  "tranid": "201931951332346",
  "trandata": "<encrypted>",
  "status": "1",  // 1 = success, 2 = failure
  "error": null,
  "errorText": null
}]
```

**Decrypted Trandata Fields:**
- `paymentId` - Payment ID
- `result` - 'CAPTURED' (Purchase success) or 'APPROVED' (Authorization success)
- `transId` - Transaction ID
- `ref` - RRN (Reference Number)
- `trackId` - Merchant order ID
- `amt` - Amount
- `authRespCode` - '00' = success
- `authCode` - Authorization code
- `cardType` - 'Visa', 'MasterCard', or 'Mada'
- `actionCode` - Transaction action code
- `date` - Transaction date

---

## API Reference

### Public Endpoints

#### Create Payment (Guest)
```
POST /api/payments/arb/create/guest
```

**Request Body:**
```json
{
  "amount": 100.00,
  "currency": "SAR",
  "orderId": "ORDER_123",
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "customerPhone": "1234567890",
  "description": "Order payment"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://securepayments.alrajhibank.com.sa/pg/paymentpage.htm?PaymentID=...",
    "paymentId": "100201931620827468",
    "trackId": "ORDER_123"
  }
}
```

#### Create Payment (Authenticated)
```
POST /api/payments/arb/create
```
Same as guest endpoint, but requires authentication token.

#### Handle Callback
```
GET /api/payments/arb/callback
POST /api/payments/arb/callback
```
Handles ARB redirects and notifications. Automatically updates order status.

#### Handle Notification
```
POST /api/payments/arb/notify
```
Handles merchant notifications. Must acknowledge quickly to prevent void.

### Authenticated Endpoints

#### Verify Payment
```
POST /api/payments/arb/verify
```

**Request Body:**
```json
{
  "encryptedTrandata": "<encrypted_data>",
  "trackId": "ORDER_123"
}
```

#### Inquiry Payment Status
```
POST /api/payments/arb/inquiry
```

**Request Body:**
```json
{
  "paymentId": "100201931620827468",
  "transId": "201931951332346",
  "trackId": "ORDER_123",
  "amount": "100.00",
  "currencyCode": "682",
  "referenceType": "PaymentID"  // "PaymentID", "TRANID", or "TrackID"
}
```

#### Refund Payment
```
POST /api/payments/arb/refund
```

**Request Body:**
```json
{
  "transactionId": "201931951332346",
  "paymentId": "100201931620827468",
  "amount": "50.00",
  "currencyCode": "682",
  "referenceType": "TRANID",  // "TRANID" or "PaymentID"
  "reason": "Customer request"
}
```

#### Void Purchase
```
POST /api/payments/arb/void
```

**Request Body:**
```json
{
  "transactionId": "201931951332346",
  "amount": "100.00",
  "currencyCode": "682",
  "reason": "Void purchase"
}
```

#### Void Authorization
```
POST /api/payments/arb/void-auth
```

**Request Body:**
```json
{
  "transactionId": "201931951332346",
  "amount": "100.00",
  "currencyCode": "682",
  "reason": "Void authorization"
}
```

#### Capture Authorization
```
POST /api/payments/arb/capture
```

**Request Body:**
```json
{
  "transactionId": "201931951332346",
  "amount": "100.00",
  "currencyCode": "682",
  "reason": "Capture authorization"
}
```

#### Get Payment Details
```
GET /api/payments/arb/details/:transactionId
```

---

## Transaction Operations

### Action Codes

- `1` = Purchase (immediate capture)
- `2` = Credit (refund)
- `3` = Void Purchase
- `4` = Authorization (capture later)
- `5` = Capture
- `8` = Inquiry
- `9` = Void Authorization
- `14` = Authorization Extension (MADA)

### udf5 Field Usage

The `udf5` field is critical for transaction operations and must be set exactly as specified:

- **Inquiry**: `udf5 = "PaymentID"`, `"TRANID"`, or `"TrackID"` (case-sensitive)
- **Refund**: `udf5 = "TRANID"` or `"PaymentID"`
- **Void Purchase**: `udf5 = "TRANID"`
- **Void Authorization**: `udf5 = "TRANID"`
- **Capture**: `udf5 = "TRANID"`

### Payment Status Determination

**Success Indicators:**
- `result === 'CAPTURED'` (Purchase successful)
- `result === 'APPROVED'` (Authorization successful)
- `authRespCode === '00'`

**Failure Indicators:**
- `result !== 'CAPTURED' && result !== 'APPROVED'`
- `authRespCode !== '00'`
- `status === '2'` (in final response)
- `error` or `errorText` present

---

## Error Handling

### Encryption Errors

- Verify Resource Key is correct
- Ensure URL-encoding is applied before encryption
- Check IV is exactly `PGKEYENCDECIVSPC` (16 bytes)

### Callback Not Received

- Verify callback URLs are publicly accessible
- Check firewall/security settings
- Ensure URLs use HTTPS in production
- Check ARB merchant portal notification settings

### Payment Status Not Updating

- Check order lookup logic (orderId vs orderNumber)
- Verify idempotency checks
- Check database connection
- Review error logs

### API Errors

- Verify Tranportal ID and Password
- Check API endpoint URL
- Ensure request format matches ARB specification
- Review ARB error codes in documentation

### User-Friendly Error Messages

The implementation maps ARB error codes to customer-friendly messages:
- Network errors → "Unable to connect to payment gateway. Please try again."
- Payment failures → "Payment failed. Please try again or use another payment method."
- Validation errors → "Invalid payment information. Please check your details."

---

## Testing

### Testing Checklist

- [ ] Payment token generation
- [ ] Encryption/decryption working correctly
- [ ] Payment URL framing correct
- [ ] Customer redirect to payment page
- [ ] Payment completion on ARB page
- [ ] Callback handling (GET redirect)
- [ ] Callback handling (POST notification)
- [ ] Trandata decryption
- [ ] Payment status verification
- [ ] Order status update
- [ ] Idempotency (duplicate callbacks)
- [ ] Error handling
- [ ] Refund operation
- [ ] Void operation
- [ ] Capture operation (if using authorization)
- [ ] Inquiry operation

### Sandbox Testing

1. Set `ARB_ENVIRONMENT=sandbox`
2. Use sandbox credentials
3. Test complete payment flow
4. Test error scenarios
5. Test callback handling
6. Test idempotency

### Production Testing

1. Start with small transactions
2. Monitor logs closely
3. Test all operations (refund, void, etc.)
4. Verify notification handling
5. Check order status updates

---

## Troubleshooting

### Common Issues

#### Encryption/Decryption Failures
- **Symptom**: "Failed to encrypt/decrypt trandata" errors
- **Solution**: 
  - Verify Resource Key is correct
  - Ensure URL-encoding is applied before encryption
  - Check IV is exactly `PGKEYENCDECIVSPC`

#### Callbacks Not Received
- **Symptom**: Payment completes but order status doesn't update
- **Solution**:
  - Verify callback URLs are publicly accessible
  - Check firewall/security settings
  - Ensure URLs use HTTPS in production
  - Check ARB merchant portal notification settings

#### Payment Status Not Updating
- **Symptom**: Callback received but order remains pending
- **Solution**:
  - Check order lookup logic (orderId vs orderNumber)
  - Verify idempotency checks aren't blocking updates
  - Check database connection
  - Review error logs for details

#### API Errors
- **Symptom**: "Payment request failed" errors
- **Solution**:
  - Verify Tranportal ID and Password
  - Check API endpoint URL
  - Ensure request format matches ARB specification
  - Review ARB error codes in documentation

---

## Security Notes

- ✅ Bank-hosted payment page (no card data on Drinkmate)
- ✅ AES encryption for all sensitive data
- ✅ HTTPS required for production
- ✅ Secure credential management via environment variables
- ✅ Never log full card data (not applicable for bank-hosted flow)
- ✅ Never commit credentials to version control
- ✅ Implement rate limiting on payment endpoints
- ✅ Monitor for suspicious activity

---

## Support

- **ARB Issues**: Contact ARB merchant support
- **Integration Issues**: Refer to this documentation
- **Code Issues**: Review error logs and implementation files

---

## Important Notes

- **API Endpoint**: Verify exact endpoint path from ARB documentation (default: `/paymentToken`)
- **Resource Key**: Must be obtained from ARB merchant portal
- **Callbacks**: Must be publicly accessible and use HTTPS in production
- **Notifications**: Must acknowledge quickly to prevent void behavior
- **Idempotency**: Callbacks are idempotent - duplicate callbacks won't cause issues

---

**Last Updated**: 2024  
**Status**: ✅ Complete and Ready for Testing  
**Version**: 1.0
