const axios = require('axios');
const crypto = require('crypto');

/**
 * ARB (Al Rajhi Bank) Payment Gateway Service
 * Handles all communication with ARB Payment Gateway REST API
 * Based on ARB Merchant Implementation Guide - REST APIs
 */
class ArbService {
    constructor() {
        // Tranportal credentials (downloaded from merchant portal)
        this.tranportalId = process.env.ARB_TRANPORTAL_ID || process.env.ARB_MERCHANT_ID || '';
        this.tranportalPassword = process.env.ARB_TRANPORTAL_PASSWORD || process.env.ARB_PASSWORD || '';
        
        // Resource Key for AES encryption (from merchant portal)
        this.resourceKey = process.env.ARB_RESOURCE_KEY || '';
        
        // AES Encryption IV (as per ARB specification)
        this.encryptionIV = 'PGKEYENCDECIVSPC';
        
        // Environment configuration
        this.environment = process.env.ARB_ENVIRONMENT || 'test';
        
        // Set base URL - ARB_BASE_URL takes precedence (provided by ARB)
        // Otherwise use environment-specific URLs
        if (process.env.ARB_BASE_URL) {
            this.apiBaseUrl = process.env.ARB_BASE_URL;
        } else {
            this.apiBaseUrl = this.environment === 'production'
                ? process.env.ARB_API_URL || 'https://securepayments.alrajhibank.com.sa'
                : process.env.ARB_SANDBOX_URL || process.env.ARB_CERTIFICATION_URL || 'https://securepayments.alrajhibank.com.sa';
        }
        
        // Payment page URL (where customers are redirected)
        // Use same base URL for payment page
        this.paymentPageBaseUrl = this.apiBaseUrl;
        
        // Token endpoint path (configurable, default from ARB)
        // CRITICAL: Must be set from environment variable
        // Note: According to ARB, /pg/payment/hosted.htm is for Bank Hosted/iFrame/JS Widget
        //       /pg/payment/tranportal.htm is for Merchant Hosted/Supporting Transactions
        //       Token generation might use tranportal.htm - verify with ARB
        this.tokenEndpointPath = process.env.ARB_TOKEN_ENDPOINT_PATH || 
                                 process.env.ARB_TOKEN_GEN_ENDPOINT || 
                                 '/pg/payment/hosted.htm';
        
        // Validate endpoint path is set
        if (!this.tokenEndpointPath || this.tokenEndpointPath === 'undefined') {
            console.warn('⚠️  ARB_TOKEN_ENDPOINT_PATH not set, using default: /pg/payment/hosted.htm');
            this.tokenEndpointPath = '/pg/payment/hosted.htm';
        }
        
        console.log('ARB Service Configuration:', {
            environment: this.environment,
            apiBaseUrl: this.apiBaseUrl,
            tokenEndpointPath: this.tokenEndpointPath,
            tranportalId: this.tranportalId ? 'Set' : 'Not set'
        });
    }

    /**
     * Encrypt trandata using AES-CBC with PKCS5Padding
     * As per ARB specification: AES algorithm with CBC Mode, PKCS5Padding
     * IV: PGKEYENCDECIVSPC
     * 
     * CRITICAL: URL-encode the plain trandata string BEFORE encrypting
     */
    encryptTrandata(plainTrandata) {
        try {
            if (!this.resourceKey) {
                throw new Error('ARB Resource Key is required for encryption');
            }

            // CRITICAL FIX #1: Use raw resource key bytes directly (per ARB PDF sample code)
            // DO NOT hash the resource key - ARB uses it directly as the AES key
            // The Resource Key from ARB should be exactly 32 bytes for AES-256
            const key = Buffer.from(this.resourceKey, 'utf8');

            // Validate key length (AES-256 requires 32 bytes)
            if (key.length !== 32) {
                console.warn(`⚠️  Resource Key length is ${key.length} bytes, expected 32 bytes for AES-256`);
                console.warn('   If encryption fails, verify the Resource Key from ARB is correct');
            }

            // Convert IV to buffer (must be exactly 16 bytes)
            const iv = Buffer.from(this.encryptionIV, 'utf8');

            // CRITICAL FIX #2: Plain trandata must be a JSON ARRAY (per PDF specification)
            // PDF shows: [{ "amt":"12.00", ... }] not { "amt":"12.00", ... }
            // Wrap the object in an array before stringifying
            const plainTrandataArray = [plainTrandata];
            const plainTrandataString = JSON.stringify(plainTrandataArray);
            
            // Step 2: URL-encode the JSON string BEFORE encryption (as per ARB spec)
            const urlEncodedTrandata = encodeURIComponent(plainTrandataString);

            // Step 3: Create cipher with AES-256-CBC
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            cipher.setAutoPadding(true); // PKCS5Padding equivalent (PKCS7 in Node.js)

            // Step 4: Encrypt the URL-encoded string
            // CRITICAL: ARB expects HEX output format (not base64)
            // Java sample outputs uppercase, but lowercase should also work
            let encrypted = cipher.update(urlEncodedTrandata, 'utf8', 'hex');
            encrypted += cipher.final('hex');

            // Convert to uppercase (matching Java sample behavior)
            return encrypted.toUpperCase();
        } catch (error) {
            console.error('ARB Encryption Error:', error);
            if (error.message.includes('Invalid key length')) {
                throw new Error(`Invalid Resource Key length. ARB Resource Key must be exactly 32 bytes for AES-256. Current length: ${Buffer.from(this.resourceKey, 'utf8').length} bytes. Please verify the Resource Key from ARB.`);
            }
            throw new Error(`Failed to encrypt trandata: ${error.message}`);
        }
    }

    /**
     * Decrypt trandata (for callback verification)
     * 
     * CRITICAL: URL-decode the decrypted string AFTER decrypting
     */
    decryptTrandata(encryptedTrandata) {
        try {
            if (!this.resourceKey) {
                throw new Error('ARB Resource Key is required for decryption');
            }

            // CRITICAL FIX: Use raw resource key bytes directly (per ARB PDF sample code)
            // DO NOT hash the resource key - ARB uses it directly as the AES key
            const key = Buffer.from(this.resourceKey, 'utf8');

            // Convert IV to buffer (must be exactly 16 bytes)
            const iv = Buffer.from(this.encryptionIV, 'utf8');

            // Step 1: Create decipher with AES-256-CBC
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            decipher.setAutoPadding(true);

            // Step 2: Decrypt from HEX (ARB sends encrypted data in HEX format, case-insensitive)
            // ARB may send uppercase or lowercase HEX
            const normalizedHex = encryptedTrandata.toLowerCase();
            let decrypted = decipher.update(normalizedHex, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            // Step 3: URL-decode the decrypted string AFTER decryption (as per ARB spec)
            const urlDecodedTrandata = decodeURIComponent(decrypted);

            // Step 4: Parse JSON array, then extract first object
            // CRITICAL: Plain trandata is a JSON array per PDF: [{ ... }]
            const plainTrandataArray = JSON.parse(urlDecodedTrandata);
            
            // Extract the first object from the array
            if (Array.isArray(plainTrandataArray) && plainTrandataArray.length > 0) {
                return plainTrandataArray[0];
            } else {
                // Fallback: if it's already an object, return it
                return plainTrandataArray;
            }
        } catch (error) {
            console.error('ARB decryption error:', error);
            throw new Error('Failed to decrypt trandata: ' + error.message);
        }
    }

    /**
     * Generate request headers for ARB API
     */
    getHeaders() {
        return {
            'Content-Type': 'application/json'
        };
    }

    /**
     * Process payment with ARB
     * Creates a payment token and returns payment URL
     * Based on ARB Payment Token Generation API
     */
    async processPayment(paymentData) {
        try {
            const {
                amount,
                currency = 'SAR',
                orderId,
                customerEmail,
                customerName,
                customerPhone,
                description,
                returnUrl,
                cancelUrl,
                callbackUrl,
                language = 'en',
                customerId = null // For faster checkout
            } = paymentData;

            // Validate required fields
            if (!amount || !orderId) {
                throw new Error('Missing required payment data: amount and orderId are required');
            }

            if (!this.tranportalId || !this.tranportalPassword) {
                throw new Error('ARB Tranportal credentials not configured');
            }

            // Currency code: 682 for SAR (Saudi Riyal)
            const currencyCode = currency === 'SAR' ? '682' : '682'; // Default to SAR

            // Prepare plain trandata (before encryption)
            const plainTrandata = {
                amt: parseFloat(amount).toFixed(2),
                action: '1', // 1 = Purchase, 4 = Authorization
                password: this.tranportalPassword,
                id: this.tranportalId,
                currencyCode: currencyCode,
                trackId: orderId.toString(),
                responseURL: returnUrl || callbackUrl || `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/success?orderId=${orderId}`,
                errorURL: cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/cancel?orderId=${orderId}`
            };

            // Add optional fields
            if (language === 'ar' || language === 'AR') {
                plainTrandata.langid = 'ar';
            }

            if (customerId) {
                plainTrandata.custid = customerId;
            }

            if (customerName) {
                plainTrandata.cust_cardHolderName = customerName;
            }

            if (customerPhone) {
                plainTrandata.cust_mobile_number = customerPhone.replace(/\D/g, ''); // Remove non-digits
            }

            if (customerEmail) {
                plainTrandata.cust_emailId = customerEmail;
            }

            // Add UDF fields if needed (for additional merchant data)
            if (description) {
                plainTrandata.udf1 = description.substring(0, 100); // Limit length
            }
            
            // Iframe support: set udf3='iframe' for iframe integration
            if (paymentData.iframeMode === true || paymentData.useIframe === true) {
                plainTrandata.udf3 = 'iframe';
            }
            
            // Store orderId in udf2 for easy retrieval
            plainTrandata.udf2 = orderId.toString();

            // Validate all required fields are present in plainTrandata
            const requiredFields = ['amt', 'action', 'password', 'id', 'currencyCode', 'trackId', 'responseURL', 'errorURL'];
            const missingFields = requiredFields.filter(field => !plainTrandata[field]);
            if (missingFields.length > 0) {
                throw new Error(`Missing required trandata fields: ${missingFields.join(', ')}`);
            }

            // Encrypt trandata
            const encryptedTrandata = this.encryptTrandata(plainTrandata);

            // Validate encryption result
            if (!encryptedTrandata || typeof encryptedTrandata !== 'string' || encryptedTrandata.length === 0) {
                throw new Error('Failed to encrypt trandata');
            }

            // Prepare API request (as per ARB specification - JSON array format)
            const apiRequest = [{
                id: this.tranportalId,
                trandata: encryptedTrandata,
                responseURL: plainTrandata.responseURL,
                errorURL: plainTrandata.errorURL
            }];

            // Debug logging (without sensitive data)
            console.log('ARB Payment Request Structure:', {
                requestFormat: 'JSON Array',
                arrayLength: apiRequest.length,
                hasId: !!apiRequest[0].id,
                hasTrandata: !!apiRequest[0].trandata,
                trandataLength: apiRequest[0].trandata ? apiRequest[0].trandata.length : 0,
                trandataType: typeof apiRequest[0].trandata,
                hasResponseURL: !!apiRequest[0].responseURL,
                hasErrorURL: !!apiRequest[0].errorURL,
                responseURL: apiRequest[0].responseURL,
                errorURL: apiRequest[0].errorURL,
                trackId: orderId
            });

            console.log('Plain Trandata Fields (before encryption):', {
                amt: plainTrandata.amt,
                action: plainTrandata.action,
                password: '***', // Masked
                id: plainTrandata.id,
                currencyCode: plainTrandata.currencyCode,
                trackId: plainTrandata.trackId,
                responseURL: plainTrandata.responseURL,
                errorURL: plainTrandata.errorURL,
                hasOptionalFields: !!(plainTrandata.langid || plainTrandata.custid || plainTrandata.udf1 || plainTrandata.udf2)
            });

            // Make API call to ARB Payment Token Generation endpoint
            // Use configured endpoint path (provided by ARB)
            const tokenEndpointUrl = `${this.apiBaseUrl}${this.tokenEndpointPath}`;
            
            console.log('ARB Payment Token API Call:', {
                url: tokenEndpointUrl,
                trackId: orderId,
                amount: amount,
                currency: currency
            });
            
            // Make API call with explicit headers
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            console.log('Sending request to ARB:', {
                url: tokenEndpointUrl,
                method: 'POST',
                contentType: 'application/json',
                bodyFormat: 'JSON Array',
                bodySize: JSON.stringify(apiRequest).length,
                trandataLength: encryptedTrandata.length,
                trandataFormat: 'HEX'
            });

            const response = await axios.post(
                tokenEndpointUrl,
                apiRequest,
                {
                    headers: headers,
                    timeout: 30000,
                    validateStatus: () => true // Accept all status codes
                }
            );

            console.log('ARB API Response:', {
                status: response.status,
                statusText: response.statusText,
                dataType: Array.isArray(response.data) ? 'Array' : typeof response.data,
                response: response.data
            });

            // Parse initial response from ARB
            // Format: [{ paymentId, trandata, error, errorText }]
            let responseData = null;
            
            if (Array.isArray(response.data) && response.data[0]) {
                responseData = response.data[0];
            } else if (response.data) {
                responseData = response.data;
            }

            // Check for errors in response
            if (responseData && (responseData.error || responseData.errorText)) {
                return {
                    success: false,
                    error: responseData.errorText || responseData.error || 'Payment request failed',
                    code: responseData.error || 'PAYMENT_ERROR',
                    paymentId: responseData.paymentId || null
                };
            }

            // Check for success status
            if (responseData && responseData.status === '1' && responseData.result) {
                // ARB returns result in format: "paymentId:paymentPageUrl"
                // Example: "600202601209616797:https://securepayments.alrajhibank.com.sa/pg/paymentpage.htm"
                // OR for 3DS: "7002...:https://securepayments.../pg/TranportalVbv.htm?paymentId=7002...&id=XXXXX"
                const { paymentId, paymentUrl } = this.buildArbPaymentUrl(
                    responseData.result,
                    this.paymentPageBaseUrl
                );
                
                if (paymentId) {
                    return {
                        success: true,
                        paymentId: paymentId,
                        paymentUrl: paymentUrl,
                        trackId: orderId,
                        data: responseData
                    };
                }
            }

            // Fallback: Try to extract paymentId from response fields
            const paymentId = responseData?.paymentId || responseData?.PaymentID || responseData?.paymentID;
            
            if (!paymentId) {
                throw new Error('Payment ID not received from ARB gateway. Response: ' + JSON.stringify(responseData));
            }

            // Frame payment URL as per ARB specification
            // Format: https://securepayments.alrajhibank.com.sa/pg/paymentpage.htm?PaymentID={paymentId}
            const paymentUrl = `${this.paymentPageBaseUrl}/pg/paymentpage.htm?PaymentID=${paymentId}`;

            return {
                success: true,
                paymentUrl: paymentUrl,
                paymentId: paymentId,
                trackId: orderId,
                // Store encrypted trandata for later verification if needed
                encryptedTrandata: responseData?.trandata || null
            };

        } catch (error) {
            console.error('ARB payment error:', error);
            
            if (error.response) {
                // API error response
                return {
                    success: false,
                    error: error.response.data?.error || error.response.data?.message || 'Payment processing failed',
                    code: error.response.data?.code || 'PAYMENT_ERROR',
                    details: error.response.data || {}
                };
            } else if (error.request) {
                // Network error
                return {
                    success: false,
                    error: 'Unable to connect to payment gateway',
                    code: 'NETWORK_ERROR'
                };
            } else {
                // Other error
                return {
                    success: false,
                    error: error.message || 'Payment processing failed',
                    code: 'UNKNOWN_ERROR'
                };
            }
        }
    }

    /**
     * Verify payment status with ARB
     * ARB returns encrypted trandata in callback, so we decrypt it
     * Handles both URL redirection format and final response format
     */
    async verifyPayment(encryptedTrandata, trackId = null, paymentId = null) {
        try {
            if (!encryptedTrandata) {
                return {
                    success: false,
                    error: 'Encrypted trandata is required for verification',
                    code: 'MISSING_DATA'
                };
            }

            // Decrypt the trandata
            const decryptedData = this.decryptTrandata(encryptedTrandata);

            // ARB response can be an array or single object
            let paymentData = null;
            if (Array.isArray(decryptedData) && decryptedData[0]) {
                paymentData = decryptedData[0];
            } else if (typeof decryptedData === 'object') {
                paymentData = decryptedData;
            } else {
                throw new Error('Invalid trandata format');
            }

            // Verify trackId matches if provided
            const responseTrackId = paymentData.trackId || paymentData.TrackId;
            if (trackId && responseTrackId && responseTrackId.toString() !== trackId.toString()) {
                return {
                    success: false,
                    error: 'Track ID mismatch',
                    code: 'TRACK_ID_MISMATCH',
                    expected: trackId,
                    received: responseTrackId
                };
            }

            // Verify paymentId matches if provided
            const responsePaymentId = paymentData.paymentId || paymentData.PaymentId || paymentData.PaymentID;
            if (paymentId && responsePaymentId && responsePaymentId.toString() !== paymentId.toString()) {
                return {
                    success: false,
                    error: 'Payment ID mismatch',
                    code: 'PAYMENT_ID_MISMATCH'
                };
            }

            // Parse payment result from decrypted data
            // ARB response format per documentation
            const result = paymentData.result || paymentData.Result;
            const authRespCode = paymentData.authRespCode || paymentData.AuthRespCode;
            const transId = paymentData.transId || paymentData.TransId || paymentData.transactionId;
            const ref = paymentData.ref || paymentData.Ref; // RRN
            const amount = paymentData.amt || paymentData.Amt;
            const authCode = paymentData.authCode || paymentData.AuthCode;
            const cardType = paymentData.cardType || paymentData.CardType;
            const actionCode = paymentData.actionCode || paymentData.ActionCode;
            const date = paymentData.date || paymentData.Date;

            // Determine payment status
            // 'CAPTURED' = Purchase successful, 'APPROVED' = Authorization successful
            // authRespCode '00' = success
            const isSuccess = result === 'CAPTURED' || 
                            result === 'APPROVED' ||
                            authRespCode === '00';

            return {
                success: isSuccess,
                transactionId: transId,
                paymentId: responsePaymentId,
                orderId: responseTrackId,
                status: isSuccess ? 'completed' : 'failed',
                amount: parseFloat(amount || 0),
                currency: 'SAR',
                paymentDate: date ? this.parseARBDate(date) : new Date().toISOString(),
                authRespCode: authRespCode,
                authCode: authCode,
                result: result,
                ref: ref, // RRN
                cardType: cardType,
                actionCode: actionCode,
                isPaid: isSuccess,
                rawData: paymentData // Include for debugging
            };

        } catch (error) {
            console.error('ARB verification error:', error);
            return {
                success: false,
                error: error.message || 'Payment verification failed',
                code: 'VERIFICATION_ERROR'
            };
        }
    }

    /**
     * Parse ARB date format (MMDD or similar)
     */
    parseARBDate(dateString) {
        try {
            // ARB date format may vary - adjust based on actual format
            // For now, return current date if parsing fails
            if (!dateString) return new Date().toISOString();
            
            // Try to parse if it's a standard format
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toISOString();
            }
            
            return new Date().toISOString();
        } catch (error) {
            return new Date().toISOString();
        }
    }

    /**
     * Transaction Status Inquiry (Action Code 8)
     * Per ARB spec: Use action code 8 for inquiry
     * udf5 must be exactly: "PaymentID", "TRANID", or "TrackID" (case-sensitive)
     */
    async inquiryPayment({ paymentId = null, transId = null, trackId = null, amount, currencyCode = '682', referenceType = 'PaymentID' }) {
        try {
            if (!this.tranportalId || !this.tranportalPassword) {
                throw new Error('ARB Tranportal credentials not configured');
            }

            // Determine reference value and udf5 based on referenceType
            let referenceValue;
            let udf5Value;
            
            // Validate and normalize reference values
            if (referenceType === 'PaymentID' && paymentId) {
                const normalizedPaymentId = String(paymentId).trim();
                if (!/^\d+$/.test(normalizedPaymentId)) {
                    throw new Error(`Invalid PaymentID format: ${normalizedPaymentId} (must be numeric)`);
                }
                referenceValue = normalizedPaymentId;
                udf5Value = 'PaymentID';
            } else if (referenceType === 'TRANID' && transId) {
                const normalizedTransId = String(transId).trim();
                if (normalizedTransId.length === 0) {
                    throw new Error('TRANID cannot be empty');
                }
                referenceValue = normalizedTransId;
                udf5Value = 'TRANID';
            } else if (referenceType === 'TrackID' && trackId) {
                const normalizedTrackId = String(trackId).trim();
                if (normalizedTrackId.length === 0) {
                    throw new Error('TrackID cannot be empty');
                }
                referenceValue = normalizedTrackId;
                udf5Value = 'TrackID';
            } else {
                throw new Error(`Invalid reference type or missing reference value: referenceType=${referenceType}, paymentId=${paymentId}, transId=${transId}, trackId=${trackId}`);
            }

            // Prepare plain trandata for inquiry
            const plainTrandata = {
                amt: parseFloat(amount).toFixed(2),
                action: '8', // Inquiry action code
                password: this.tranportalPassword,
                id: this.tranportalId,
                currencyCode: currencyCode,
                trackId: trackId || referenceValue,
                udf5: udf5Value, // Must be exactly "PaymentID", "TRANID", or "TrackID"
                responseURL: `${process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:3000'}/api/payments/arb/callback`,
                errorURL: `${process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:3000'}/api/payments/arb/callback`
            };

            // Add reference value to appropriate field based on udf5
            // For ARB inquiry, the reference value should be in the appropriate field
            // ARB expects exact field names - use capitalized versions as primary
            if (udf5Value === 'PaymentID') {
                // ARB expects PaymentID field (capitalized) for PaymentID inquiries
                // CRITICAL: Use capitalized "PaymentID" as the primary field name
                plainTrandata.PaymentID = referenceValue;
                plainTrandata.paymentId = referenceValue; // Also include camelCase as fallback
                // Also ensure it's in the correct format (numeric string)
                if (typeof referenceValue === 'string' && !/^\d+$/.test(referenceValue)) {
                    throw new Error('PaymentID must be numeric');
                }
                console.log('✅ Added PaymentID to inquiry trandata:', referenceValue);
            } else if (udf5Value === 'TRANID') {
                // ARB expects TRANID field (all caps) for TRANID inquiries
                plainTrandata.TRANID = referenceValue;
                plainTrandata.transId = referenceValue; // Also include camelCase as fallback
                console.log('✅ Added TRANID to inquiry trandata:', referenceValue);
            } else if (udf5Value === 'TrackID') {
                // trackId already set above, but ensure it matches referenceValue
                plainTrandata.TrackID = referenceValue;
                plainTrandata.trackId = referenceValue; // Also include camelCase as fallback
                console.log('✅ Added TrackID to inquiry trandata:', referenceValue);
            }

            // Log plain trandata before encryption (for debugging)
            console.log('ARB Inquiry Plain Trandata:', {
                action: plainTrandata.action,
                udf5: plainTrandata.udf5,
                hasPaymentId: !!(plainTrandata.paymentId || plainTrandata.PaymentID),
                hasTransId: !!(plainTrandata.transId || plainTrandata.TRANID),
                hasTrackId: !!(plainTrandata.trackId || plainTrandata.TrackID),
                paymentId: plainTrandata.PaymentID || plainTrandata.paymentId || 'N/A',
                transId: plainTrandata.TRANID || plainTrandata.transId || 'N/A',
                trackId: plainTrandata.TrackID || plainTrandata.trackId || 'N/A',
                amount: plainTrandata.amt,
                referenceType: udf5Value,
                allFields: Object.keys(plainTrandata).join(', ')
            });

            // Encrypt trandata
            const encryptedTrandata = this.encryptTrandata(plainTrandata);

            // Validate encryption
            if (!encryptedTrandata || encryptedTrandata.length === 0) {
                throw new Error('Failed to encrypt inquiry trandata');
            }

            // Prepare API request
            const apiRequest = [{
                id: this.tranportalId,
                trandata: encryptedTrandata,
                responseURL: plainTrandata.responseURL,
                errorURL: plainTrandata.errorURL
            }];

            // Supporting transactions (inquiry, refund, void, capture) use different endpoint
            const supportingEndpoint = process.env.ARB_SUPPORTING_TRANSACTIONS_ENDPOINT || '/pg/payment/tranportal.htm';
            const inquiryEndpointUrl = `${this.apiBaseUrl}${supportingEndpoint}`;
            
            console.log('ARB Inquiry Request:', {
                url: inquiryEndpointUrl,
                referenceType: udf5Value,
                referenceValue: referenceValue,
                hasTrandata: !!encryptedTrandata,
                trandataLength: encryptedTrandata.length
            });
            const response = await axios.post(
                inquiryEndpointUrl,
                apiRequest,
                {
                    headers: this.getHeaders(),
                    timeout: 30000
                }
            );

            // Parse response
            let responseData = null;
            if (Array.isArray(response.data) && response.data[0]) {
                responseData = response.data[0];
            } else if (response.data) {
                responseData = response.data;
            }

            // Check for errors
            if (responseData && (responseData.error || responseData.errorText)) {
                return {
                    success: false,
                    error: responseData.errorText || responseData.error || 'Inquiry failed',
                    code: responseData.error || 'INQUIRY_ERROR'
                };
            }

            // Decrypt trandata from response
            if (responseData && responseData.trandata) {
                const decryptedData = this.decryptTrandata(responseData.trandata);
                return {
                    success: true,
                    data: decryptedData,
                    paymentId: responseData.paymentId
                };
            }

            return {
                success: false,
                error: 'Invalid response from ARB gateway',
                code: 'INVALID_RESPONSE'
            };

        } catch (error) {
            console.error('ARB inquiry error:', error);
            return {
                success: false,
                error: error.message || 'Inquiry processing failed',
                code: 'INQUIRY_ERROR'
            };
        }
    }

    /**
     * Get payment details by transaction ID (wrapper for inquiry)
     */
    async getPaymentDetails(transactionId) {
        // Use inquiry with TRANID reference type
        return this.inquiryPayment({
            transId: transactionId,
            amount: '0.00', // Amount not required for inquiry
            referenceType: 'TRANID'
        });
    }

    /**
     * Handle payment callback from ARB
     * ARB sends encrypted trandata in the callback response
     * Handles both URL redirection format and final response format
     */
    async handleCallback(callbackData) {
        try {
            // ARB callback can be in two formats:
            // 1. URL redirection: { paymentId, trandata, error, errorText }
            // 2. Final response: { tranid, trandata, status, error, errorText }
            
            const encryptedTrandata = callbackData.trandata || callbackData.Trandata;
            const paymentId = callbackData.paymentId || callbackData.PaymentID || callbackData.PaymentId;
            const tranid = callbackData.tranid || callbackData.Tranid;
            const status = callbackData.status; // 1 = success, 2 = failure
            const error = callbackData.error;
            const errorText = callbackData.errorText;
            
            // Check for errors in callback
            if (error || errorText) {
                return {
                    success: false,
                    error: errorText || error || 'Payment processing error',
                    code: error || 'CALLBACK_ERROR',
                    paymentId: paymentId,
                    status: 'failed'
                };
            }

            // Check status field (if present)
            if (status !== undefined && status !== null) {
                if (status === '2' || status === 2) {
                    return {
                        success: false,
                        error: errorText || 'Transaction failed',
                        code: 'TRANSACTION_FAILED',
                        paymentId: paymentId,
                        status: 'failed'
                    };
                }
            }
            
            if (!encryptedTrandata) {
                throw new Error('Encrypted trandata not found in callback');
            }

            // Use verifyPayment to decrypt and parse
            const result = await this.verifyPayment(encryptedTrandata, null, paymentId);
            
            // Add callback-specific fields
            if (paymentId) {
                result.paymentId = paymentId;
            }
            if (tranid) {
                result.transactionId = tranid;
            }

            return result;

        } catch (error) {
            console.error('ARB callback error:', error);
            return {
                success: false,
                error: error.message || 'Callback processing failed',
                code: 'CALLBACK_ERROR'
            };
        }
    }

    /**
     * Refund payment (Action Code 2)
     * Per ARB spec: Use action code 2 for refund
     * udf5 must be "TRANID" or "PaymentID"
     */
    async refundPayment({ transId = null, paymentId = null, amount, currencyCode = '682', referenceType = 'TRANID', reason = 'Customer request' }) {
        try {
            if (!this.tranportalId || !this.tranportalPassword) {
                throw new Error('ARB Tranportal credentials not configured');
            }

            if (!transId && !paymentId) {
                throw new Error('Transaction ID or Payment ID is required for refund');
            }

            // Determine reference value and udf5
            let referenceValue;
            let udf5Value;
            
            if (referenceType === 'TRANID' && transId) {
                referenceValue = transId;
                udf5Value = 'TRANID';
            } else if (referenceType === 'PaymentID' && paymentId) {
                referenceValue = paymentId;
                udf5Value = 'PaymentID';
            } else {
                throw new Error('Invalid reference type or missing reference value');
            }

            // Generate unique trackId for refund
            const refundTrackId = `REFUND_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Prepare plain trandata for refund
            const plainTrandata = {
                amt: parseFloat(amount).toFixed(2),
                action: '2', // Refund action code
                password: this.tranportalPassword,
                id: this.tranportalId,
                currencyCode: currencyCode,
                trackId: refundTrackId,
                udf1: reason.substring(0, 100), // Reason in udf1
                udf5: udf5Value, // Must be "TRANID" or "PaymentID"
                responseURL: `${process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:3000'}/api/payments/arb/callback`,
                errorURL: `${process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:3000'}/api/payments/arb/callback`
            };

            // Add reference value
            if (udf5Value === 'TRANID') {
                plainTrandata.transId = referenceValue;
            } else if (udf5Value === 'PaymentID') {
                plainTrandata.paymentId = referenceValue;
            }

            // Encrypt trandata
            const encryptedTrandata = this.encryptTrandata(plainTrandata);

            // Prepare API request
            const apiRequest = [{
                id: this.tranportalId,
                trandata: encryptedTrandata,
                responseURL: plainTrandata.responseURL,
                errorURL: plainTrandata.errorURL
            }];

            // Supporting transactions use /pg/payment/tranportal.htm endpoint
            const supportingEndpoint = process.env.ARB_SUPPORTING_TRANSACTIONS_ENDPOINT || '/pg/payment/tranportal.htm';
            const endpointUrl = `${this.apiBaseUrl}${supportingEndpoint}`;
            const response = await axios.post(
                endpointUrl,
                apiRequest,
                {
                    headers: this.getHeaders(),
                    timeout: 30000
                }
            );

            // Parse response
            let responseData = null;
            if (Array.isArray(response.data) && response.data[0]) {
                responseData = response.data[0];
            } else if (response.data) {
                responseData = response.data;
            }

            // Check for errors
            if (responseData && (responseData.error || responseData.errorText)) {
                return {
                    success: false,
                    error: responseData.errorText || responseData.error || 'Refund failed',
                    code: responseData.error || 'REFUND_ERROR'
                };
            }

            // Decrypt trandata from response
            if (responseData && responseData.trandata) {
                const decryptedData = this.decryptTrandata(responseData.trandata);
                return {
                    success: true,
                    refundId: refundTrackId,
                    transactionId: decryptedData.transId,
                    amount: parseFloat(decryptedData.amt || amount),
                    status: decryptedData.result === 'CAPTURED' ? 'completed' : 'processing',
                    result: decryptedData.result,
                    ref: decryptedData.ref,
                    data: decryptedData
                };
            }

            return {
                success: false,
                error: 'Invalid response from ARB gateway',
                code: 'INVALID_RESPONSE'
            };

        } catch (error) {
            console.error('ARB refund error:', error);
            return {
                success: false,
                error: error.message || 'Refund processing failed',
                code: 'REFUND_ERROR'
            };
        }
    }

    /**
     * Void Purchase (Action Code 3)
     * Per ARB spec: Use action code 3 for void purchase
     * udf5 must be "TRANID"
     */
    async voidPurchase({ transId, amount, currencyCode = '682', reason = 'Void purchase' }) {
        try {
            if (!this.tranportalId || !this.tranportalPassword) {
                throw new Error('ARB Tranportal credentials not configured');
            }

            if (!transId) {
                throw new Error('Transaction ID is required for void');
            }

            const voidTrackId = `VOID_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const plainTrandata = {
                amt: parseFloat(amount).toFixed(2),
                action: '3', // Void purchase action code
                password: this.tranportalPassword,
                id: this.tranportalId,
                currencyCode: currencyCode,
                trackId: voidTrackId,
                transId: transId,
                udf1: reason.substring(0, 100),
                udf5: 'TRANID', // Must be "TRANID" for void
                responseURL: `${process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:3000'}/api/payments/arb/callback`,
                errorURL: `${process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:3000'}/api/payments/arb/callback`
            };

            const encryptedTrandata = this.encryptTrandata(plainTrandata);

            const apiRequest = [{
                id: this.tranportalId,
                trandata: encryptedTrandata,
                responseURL: plainTrandata.responseURL,
                errorURL: plainTrandata.errorURL
            }];

            const response = await axios.post(
                `${this.apiBaseUrl}/paymentToken`,
                apiRequest,
                {
                    headers: this.getHeaders(),
                    timeout: 30000
                }
            );

            let responseData = null;
            if (Array.isArray(response.data) && response.data[0]) {
                responseData = response.data[0];
            } else if (response.data) {
                responseData = response.data;
            }

            if (responseData && (responseData.error || responseData.errorText)) {
                return {
                    success: false,
                    error: responseData.errorText || responseData.error || 'Void failed',
                    code: responseData.error || 'VOID_ERROR'
                };
            }

            if (responseData && responseData.trandata) {
                const decryptedData = this.decryptTrandata(responseData.trandata);
                return {
                    success: true,
                    voidId: voidTrackId,
                    transactionId: decryptedData.transId,
                    status: decryptedData.result === 'CAPTURED' ? 'voided' : 'processing',
                    result: decryptedData.result,
                    data: decryptedData
                };
            }

            return {
                success: false,
                error: 'Invalid response from ARB gateway',
                code: 'INVALID_RESPONSE'
            };

        } catch (error) {
            console.error('ARB void error:', error);
            return {
                success: false,
                error: error.message || 'Void processing failed',
                code: 'VOID_ERROR'
            };
        }
    }

    /**
     * Void Authorization (Action Code 9)
     * Per ARB spec: Use action code 9 for void authorization
     * udf5 must be "TRANID"
     */
    async voidAuthorization({ transId, amount, currencyCode = '682', reason = 'Void authorization' }) {
        try {
            if (!this.tranportalId || !this.tranportalPassword) {
                throw new Error('ARB Tranportal credentials not configured');
            }

            if (!transId) {
                throw new Error('Transaction ID is required for void');
            }

            const voidTrackId = `VOIDAUTH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const plainTrandata = {
                amt: parseFloat(amount).toFixed(2),
                action: '9', // Void authorization action code
                password: this.tranportalPassword,
                id: this.tranportalId,
                currencyCode: currencyCode,
                trackId: voidTrackId,
                transId: transId,
                udf1: reason.substring(0, 100),
                udf5: 'TRANID', // Must be "TRANID" for void
                responseURL: `${process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:3000'}/api/payments/arb/callback`,
                errorURL: `${process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:3000'}/api/payments/arb/callback`
            };

            const encryptedTrandata = this.encryptTrandata(plainTrandata);

            const apiRequest = [{
                id: this.tranportalId,
                trandata: encryptedTrandata,
                responseURL: plainTrandata.responseURL,
                errorURL: plainTrandata.errorURL
            }];

            const response = await axios.post(
                `${this.apiBaseUrl}/paymentToken`,
                apiRequest,
                {
                    headers: this.getHeaders(),
                    timeout: 30000
                }
            );

            let responseData = null;
            if (Array.isArray(response.data) && response.data[0]) {
                responseData = response.data[0];
            } else if (response.data) {
                responseData = response.data;
            }

            if (responseData && (responseData.error || responseData.errorText)) {
                return {
                    success: false,
                    error: responseData.errorText || responseData.error || 'Void authorization failed',
                    code: responseData.error || 'VOID_AUTH_ERROR'
                };
            }

            if (responseData && responseData.trandata) {
                const decryptedData = this.decryptTrandata(responseData.trandata);
                return {
                    success: true,
                    voidId: voidTrackId,
                    transactionId: decryptedData.transId,
                    status: decryptedData.result === 'APPROVED' ? 'voided' : 'processing',
                    result: decryptedData.result,
                    data: decryptedData
                };
            }

            return {
                success: false,
                error: 'Invalid response from ARB gateway',
                code: 'INVALID_RESPONSE'
            };

        } catch (error) {
            console.error('ARB void authorization error:', error);
            return {
                success: false,
                error: error.message || 'Void authorization processing failed',
                code: 'VOID_AUTH_ERROR'
            };
        }
    }

    /**
     * Capture Authorization (Action Code 5)
     * Per ARB spec: Use action code 5 for capture
     * udf5 must be "TRANID"
     */
    async captureAuthorization({ transId, amount, currencyCode = '682', reason = 'Capture authorization' }) {
        try {
            if (!this.tranportalId || !this.tranportalPassword) {
                throw new Error('ARB Tranportal credentials not configured');
            }

            if (!transId) {
                throw new Error('Transaction ID is required for capture');
            }

            const captureTrackId = `CAPTURE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const plainTrandata = {
                amt: parseFloat(amount).toFixed(2),
                action: '5', // Capture action code
                password: this.tranportalPassword,
                id: this.tranportalId,
                currencyCode: currencyCode,
                trackId: captureTrackId,
                transId: transId,
                udf1: reason.substring(0, 100),
                udf5: 'TRANID', // Must be "TRANID" for capture
                responseURL: `${process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:3000'}/api/payments/arb/callback`,
                errorURL: `${process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:3000'}/api/payments/arb/callback`
            };

            const encryptedTrandata = this.encryptTrandata(plainTrandata);

            const apiRequest = [{
                id: this.tranportalId,
                trandata: encryptedTrandata,
                responseURL: plainTrandata.responseURL,
                errorURL: plainTrandata.errorURL
            }];

            const response = await axios.post(
                `${this.apiBaseUrl}/paymentToken`,
                apiRequest,
                {
                    headers: this.getHeaders(),
                    timeout: 30000
                }
            );

            let responseData = null;
            if (Array.isArray(response.data) && response.data[0]) {
                responseData = response.data[0];
            } else if (response.data) {
                responseData = response.data;
            }

            if (responseData && (responseData.error || responseData.errorText)) {
                return {
                    success: false,
                    error: responseData.errorText || responseData.error || 'Capture failed',
                    code: responseData.error || 'CAPTURE_ERROR'
                };
            }

            if (responseData && responseData.trandata) {
                const decryptedData = this.decryptTrandata(responseData.trandata);
                return {
                    success: true,
                    captureId: captureTrackId,
                    transactionId: decryptedData.transId,
                    amount: parseFloat(decryptedData.amt || amount),
                    status: decryptedData.result === 'CAPTURED' ? 'captured' : 'processing',
                    result: decryptedData.result,
                    ref: decryptedData.ref,
                    data: decryptedData
                };
            }

            return {
                success: false,
                error: 'Invalid response from ARB gateway',
                code: 'INVALID_RESPONSE'
            };

        } catch (error) {
            console.error('ARB capture error:', error);
            return {
                success: false,
                error: error.message || 'Capture processing failed',
                code: 'CAPTURE_ERROR'
            };
        }
    }

    /**
     * Get available payment methods
     */
    getAvailablePaymentMethods() {
        return [
            {
                id: 'arb',
                name: 'Al Rajhi Bank',
                description: 'Pay with credit/debit card via Al Rajhi Bank',
                icon: 'credit-card',
                supportedCards: ['visa', 'mastercard', 'mada', 'amex']
            }
        ];
    }

    /**
     * Check if service is configured
     */
    isConfigured() {
        // Check for Tranportal credentials and Resource Key
        return !!(this.tranportalId && this.tranportalPassword && this.resourceKey);
    }
}

module.exports = new ArbService();
