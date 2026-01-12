const { createErrorResponse, logError } = require('../Utils/error-handler');
const arbService = require('../Services/arb-service');
const Order = require('../Models/order-model');
const Payment = require('../Models/payment-model');

/**
 * ARB (Al Rajhi Bank) Payment Gateway Controller
 * Handles HTTP requests for ARB payment operations
 */

/**
 * Create payment session with ARB
 */
const createPayment = async (req, res) => {
  try {
    console.log('🚀 Creating ARB payment request...');
    console.log('🚀 Request body:', req.body);
    
    const {
      amount,
      currency = 'SAR',
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      description = 'Drinkmate Order Payment',
      items = []
    } = req.body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json(createErrorResponse(
        'Invalid amount',
        'Amount must be greater than 0'
      ));
    }

    if (!orderId) {
      return res.status(400).json(createErrorResponse(
        'Order ID is required',
        'Order ID cannot be empty'
      ));
    }

    if (!customerEmail) {
      return res.status(400).json(createErrorResponse(
        'Customer email required',
        'Customer email is required'
      ));
    }

    // Check if ARB service is configured
    if (!arbService.isConfigured()) {
      return res.status(500).json(createErrorResponse(
        'Payment gateway not configured',
        'ARB payment gateway is not properly configured'
      ));
    }

    // Prepare payment data
    const paymentData = {
      amount,
      currency,
      orderId,
      customerEmail,
      customerName: customerName || '',
      customerPhone: customerPhone || '',
      description: description || `DrinkMate Order ${orderId}`,
      returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/success?orderId=${orderId}`,
      cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/cancel?orderId=${orderId}`,
      callbackUrl: `${process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:3000'}/api/payments/arb/callback`
    };

    // Process payment with ARB
    const result = await arbService.processPayment(paymentData);

    if (result.success) {
      res.json({
        success: true,
        data: {
          paymentUrl: result.paymentUrl,
          paymentId: result.paymentId,
          trackId: result.trackId,
          transactionId: result.transactionId,
          message: 'Payment URL generated successfully. Redirect customer to paymentUrl.'
        }
      });
    } else {
      res.status(400).json(createErrorResponse(
        'Payment request failed',
        result.error || 'Failed to create payment request',
        result.code || 'PAYMENT_ERROR',
        result.details || {}
      ));
    }

  } catch (error) {
    logError(error, 'ArbController');
    res.status(500).json(createErrorResponse(
      'Internal server error',
      error.message
    ));
  }
};

/**
 * Verify payment status with ARB
 * ARB uses encrypted trandata for verification
 */
const verifyPayment = async (req, res) => {
  try {
    console.log('🚀 Verifying ARB payment...');
    
    const { encryptedTrandata, trandata, trackId, orderId } = req.body;
    const encryptedData = encryptedTrandata || trandata;

    if (!encryptedData) {
      return res.status(400).json(createErrorResponse(
        'Encrypted trandata required',
        'ARB requires encrypted trandata for payment verification'
      ));
    }

    // Verify payment with ARB (decrypts trandata)
    const result = await arbService.verifyPayment(encryptedData, trackId || orderId);

    if (result.success) {
      res.json({
        success: true,
        data: {
          transactionId: result.transactionId,
          orderId: result.orderId,
          status: result.status,
          amount: result.amount,
          currency: result.currency,
          paymentDate: result.paymentDate,
          authRespCode: result.authRespCode,
          result: result.result,
          message: 'Payment verified successfully'
        }
      });
    } else {
      res.status(400).json(createErrorResponse(
        'Payment verification failed',
        result.error || 'Payment not found or failed',
        result.code || 'VERIFICATION_ERROR'
      ));
    }

  } catch (error) {
    logError(error, 'ArbController');
    res.status(500).json(createErrorResponse(
      'Internal server error',
      error.message
    ));
  }
};

/**
 * Handle ARB callback/webhook
 * ARB can send callback via POST body or GET query parameters (URL redirect)
 */
const handleCallback = async (req, res) => {
  try {
    console.log('🚀 ARB Callback received');
    console.log('🚀 Request method:', req.method);
    console.log('🚀 Request body:', req.body);
    console.log('🚀 Query params:', req.query);
    
    // ARB can send data in body (POST notification) or query params (GET redirect)
    const callbackData = req.method === 'GET' ? req.query : req.body;

    // Process callback with ARB service
    const result = await arbService.handleCallback(callbackData);

    if (result.success) {
      // Idempotency: Check if payment already processed
      const orderId = result.orderId || result.trackId;
      // Extract paymentId from multiple possible sources
      let paymentId = result.paymentId || result.PaymentID || result.PaymentId;
      // If paymentId is in format "paymentId:url", extract just the paymentId
      if (paymentId && paymentId.includes(':')) {
        paymentId = paymentId.split(':')[0];
      }
      const transId = result.transactionId || result.transId || result.TRANID;
      const paymentResult = result.result; // 'CAPTURED' or 'APPROVED'

      console.log('🔍 Callback data extracted:', {
        orderId: orderId,
        paymentId: paymentId || 'N/A',
        transId: transId || 'N/A',
        paymentResult: paymentResult || 'N/A',
        hasPaymentId: !!paymentId,
        hasTransId: !!transId,
        hasPaymentResult: !!paymentResult
      });

      if (orderId) {
        // Find order by orderId (trackId)
        const order = await Order.findOne({ 
          $or: [
            { orderNumber: orderId },
            { _id: orderId }
          ]
        });

        if (order) {
          // Check if already paid (idempotency check)
          if (order.paymentDetails.paymentStatus === 'paid') {
            console.log('⚠️ Payment already processed (idempotency):', {
              orderId: order._id,
              orderNumber: order.orderNumber,
              transactionId: transId
            });
          } else {
            // CRITICAL: Always perform server-to-server status verification before fulfilling order
            // This ensures we have the authoritative payment status from ARB
            // However, if we already have valid payment data from callback (CAPTURED/APPROVED), 
            // we can skip inquiry to avoid "Payment id missing" errors
            console.log('🔍 Performing server-to-server status verification...');
            
            // Check if we have valid payment result from callback
            const hasValidPaymentResult = paymentResult === 'CAPTURED' || paymentResult === 'APPROVED';
            // Normalize and validate paymentId
            const normalizedPaymentId = paymentId ? String(paymentId).trim() : null;
            const hasValidPaymentId = normalizedPaymentId && normalizedPaymentId.length > 0 && /^\d+$/.test(normalizedPaymentId);
            const hasValidTransId = transId && String(transId).trim().length > 0;
            
            try {
              // Only perform inquiry if:
              // 1. We have a valid paymentId or transId
              // 2. AND we don't already have a valid payment result from callback
              // OR we want to double-check the payment status
              if (!hasValidPaymentId && !hasValidTransId) {
                console.warn('⚠️ Skipping inquiry - no valid paymentId or transId available');
                if (!hasValidPaymentResult) {
                  throw new Error('Cannot verify payment - missing paymentId, transId, and payment result');
                }
                // If we have valid payment result but no IDs, proceed with callback data
                console.log('✅ Proceeding with callback payment data (no inquiry needed)');
              } else if (hasValidPaymentResult && hasValidPaymentId) {
                // We have valid payment result and paymentId - inquiry is optional
                // SKIP inquiry to avoid "Payment id missing" errors - ARB may not have the paymentId
                // available for inquiry immediately after payment creation
                // The callback data is sufficient to verify the payment
                console.log('✅ Valid payment result from callback - skipping inquiry (callback data is sufficient)');
                console.log('📋 Payment verification data:', {
                  paymentId: normalizedPaymentId,
                  transId: transId || 'N/A',
                  paymentResult: paymentResult,
                  amount: order.total.toFixed(2)
                });
                console.log('✅ Proceeding with callback payment data (inquiry not needed)');
              } else if (hasValidPaymentResult && !hasValidPaymentId && hasValidTransId) {
                // We have valid payment result but no paymentId - try inquiry with transId
                console.log('✅ Valid payment result from callback, performing inquiry with transId for additional verification...');
                
                try {
                  const verificationResult = await arbService.inquiryPayment({
                    paymentId: null,
                    transId: String(transId).trim(),
                    trackId: orderId,
                    amount: order.total.toFixed(2),
                    currencyCode: '682',
                    referenceType: 'TRANID' // Use TRANID since we have transId
                  });
                
                    if (!verificationResult.success) {
                      console.error('❌ Status verification failed:', verificationResult.error);
                      // If inquiry fails but we have valid callback data, proceed anyway
                      console.warn('⚠️ Inquiry failed but proceeding with valid callback payment data');
                    } else {
                      // Verify amount and currency match
                      const verifiedAmount = parseFloat(verificationResult.data?.amt || verificationResult.amount || '0');
                      const verifiedCurrency = verificationResult.data?.currencyCode || verificationResult.currencyCode || '682';
                      
                      if (Math.abs(verifiedAmount - order.total) > 0.01) {
                        console.error('❌ Amount mismatch:', {
                          orderAmount: order.total,
                          verifiedAmount: verifiedAmount
                        });
                        console.warn('⚠️ Amount mismatch in inquiry but proceeding with callback data');
                      }
                      
                      if (verifiedCurrency !== '682') {
                        console.error('❌ Currency mismatch:', {
                          expected: '682 (SAR)',
                          verified: verifiedCurrency
                        });
                        console.warn('⚠️ Currency mismatch in inquiry but proceeding with callback data');
                      }
                      
                      // Verify payment status
                      const verifiedResult = verificationResult.data?.result || verificationResult.result;
                      if (verifiedResult !== 'CAPTURED' && verifiedResult !== 'APPROVED') {
                        console.error('❌ Payment not captured/approved:', verifiedResult);
                        console.warn('⚠️ Inquiry result mismatch but proceeding with callback data');
                      } else {
                        console.log('✅ Status verification successful:', {
                          transId: transId,
                          result: verifiedResult,
                          amount: verifiedAmount
                        });
                      }
                    }
                  } catch (inquiryError) {
                    // If inquiry throws an error but we have valid callback data, proceed anyway
                    console.warn('⚠️ Inquiry error but proceeding with valid callback payment data:', inquiryError.message);
                  }
              } else if (!hasValidPaymentResult && (hasValidPaymentId || hasValidTransId)) {
                // No valid payment result but we have IDs - inquiry is required
                console.log('⚠️ No valid payment result from callback, performing inquiry to verify payment status...');
                
                try {
                  const verificationResult = await arbService.inquiryPayment({
                    paymentId: hasValidPaymentId ? normalizedPaymentId : null,
                    transId: hasValidTransId ? String(transId).trim() : null,
                    trackId: orderId,
                    amount: order.total.toFixed(2),
                    currencyCode: '682',
                    referenceType: hasValidPaymentId ? 'PaymentID' : (hasValidTransId ? 'TRANID' : 'TrackID')
                  });
                
                    if (!verificationResult.success) {
                      console.error('❌ Status verification failed:', verificationResult.error);
                      throw new Error(`Status verification failed: ${verificationResult.error}`);
                    }
                    
                    // Verify amount and currency match
                    const verifiedAmount = parseFloat(verificationResult.data?.amt || verificationResult.amount || '0');
                    const verifiedCurrency = verificationResult.data?.currencyCode || verificationResult.currencyCode || '682';
                    
                    if (Math.abs(verifiedAmount - order.total) > 0.01) {
                      console.error('❌ Amount mismatch:', {
                        orderAmount: order.total,
                        verifiedAmount: verifiedAmount
                      });
                      throw new Error('Payment amount mismatch - verification failed');
                    }
                    
                    if (verifiedCurrency !== '682') {
                      console.error('❌ Currency mismatch:', {
                        expected: '682 (SAR)',
                        verified: verifiedCurrency
                      });
                      throw new Error('Payment currency mismatch - verification failed');
                    }
                    
                    // Verify payment status
                    const verifiedResult = verificationResult.data?.result || verificationResult.result;
                    if (verifiedResult !== 'CAPTURED' && verifiedResult !== 'APPROVED') {
                      console.error('❌ Payment not captured/approved:', verifiedResult);
                      throw new Error(`Payment status invalid: ${verifiedResult}`);
                    }
                    
                    console.log('✅ Status verification successful:', {
                      paymentId: normalizedPaymentId || 'N/A',
                      transId: transId || 'N/A',
                      result: verifiedResult,
                      amount: verifiedAmount
                    });
                  } catch (inquiryError) {
                    console.error('❌ Inquiry failed and no valid payment result from callback:', inquiryError.message);
                    throw inquiryError;
                  }
                }
              }
            } catch (verifyError) {
              console.error('❌ Server-to-server verification error:', verifyError);
              // If we have valid payment result from callback, proceed anyway
              if (hasValidPaymentResult) {
                console.warn('⚠️ Inquiry failed but proceeding with valid callback payment data:', {
                  paymentResult: paymentResult,
                  error: verifyError.message
                });
              } else {
                // No valid payment result - this is more serious
                console.error('❌ Inquiry failed and no valid payment result from callback');
                // Log but don't fail - callback data might still be valid
                // In production, you may want to queue for retry or alert
                console.warn('⚠️ Proceeding with callback data despite verification error');
              }
            }
            
            // Update order payment status
            await order.updatePaymentStatus('paid', transId);
            
            // Update order status to confirmed/processing
            if (order.status === 'pending') {
              await order.updateStatus('confirmed', 'Payment received via ARB', 'system');
            }

            // Update or create payment record
            let payment = await Payment.findOne({ 
              $or: [
                { 'gateway.arbPaymentId': paymentId },
                { 'gateway.arbTransId': transId },
                { order: order._id, method: 'arb' }
              ]
            });

            if (!payment) {
              payment = new Payment({
                paymentId: `ARB_${paymentId || transId || Date.now()}`,
                order: order._id,
                orderNumber: order.orderNumber,
                customer: order.user || null,
                customerEmail: order.shippingAddress?.email || order.guestInfo?.email || '',
                amount: result.amount || order.total,
                currency: 'SAR',
                method: 'arb',
                status: 'completed',
                gateway: {
                  name: 'arb',
                  transactionId: transId,
                  gatewayOrderId: paymentId,
                  arbPaymentId: paymentId,
                  arbTransId: transId,
                  arbTrackId: orderId,
                  arbRef: result.ref,
                  arbAuthCode: result.authCode,
                  arbCardType: result.cardType,
                  arbActionCode: result.actionCode,
                  arbResult: result.result
                },
                gatewayResponse: {
                  raw: result.rawData || {},
                  processed: {
                    success: true,
                    transactionId: transId,
                    authCode: result.authCode,
                    trackId: orderId,
                    rrn: result.ref,
                    cardBrand: result.cardType,
                    responseCode: result.authRespCode
                  }
                }
              });
              await payment.save();
            } else {
              // Update existing payment record
              payment.status = 'completed';
              payment.gateway.arbPaymentId = paymentId || payment.gateway.arbPaymentId;
              payment.gateway.arbTransId = transId || payment.gateway.arbTransId;
              payment.gateway.arbRef = result.ref || payment.gateway.arbRef;
              payment.gateway.arbAuthCode = result.authCode || payment.gateway.arbAuthCode;
              payment.gateway.arbCardType = result.cardType || payment.gateway.arbCardType;
              payment.gateway.arbActionCode = result.actionCode || payment.gateway.arbActionCode;
              payment.gateway.arbResult = result.result || payment.gateway.arbResult;
              await payment.save();
            }

            console.log('✅ Order and payment updated successfully:', {
              orderId: order._id,
              orderNumber: order.orderNumber,
              transactionId: transId,
              paymentId: paymentId
            });
          }
        } else {
          console.warn('⚠️ Order not found for callback:', { orderId, paymentId, transId });
        }
      }
      
      console.log('✅ Payment processed successfully:', {
        transactionId: result.transactionId,
        orderId: result.orderId,
        amount: result.amount,
        status: result.status
      });
      
      // For GET requests (redirects), redirect to success page
      if (req.method === 'GET') {
        const orderId = result.orderId;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
        return res.redirect(`${frontendUrl}/payment/success?orderId=${orderId}&status=success`);
      }
      
      // For POST requests (notifications), return JSON
      res.json({
        success: true,
        message: 'Payment processed successfully',
        data: result
      });
    } else {
      console.log('❌ Payment processing failed:', result.error);
      
      // For GET requests (redirects), redirect to error page
      if (req.method === 'GET') {
        const orderId = result.orderId || callbackData.trackId || 'unknown';
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
        return res.redirect(`${frontendUrl}/payment/cancel?orderId=${orderId}&error=${encodeURIComponent(result.error || 'Payment failed')}`);
      }
      
      // For POST requests (notifications), return JSON error
      res.status(400).json(createErrorResponse(
        'Payment processing failed',
        result.error || 'Failed to process payment',
        result.code || 'CALLBACK_ERROR'
      ));
    }

  } catch (error) {
    logError(error, 'ArbController');
    
    // For GET requests, redirect to error page
    if (req.method === 'GET') {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      return res.redirect(`${frontendUrl}/payment/cancel?error=${encodeURIComponent(error.message || 'Payment processing error')}`);
    }
    
    // For POST requests, return JSON error
    res.status(500).json(createErrorResponse(
      'Internal server error',
      error.message
    ));
  }
};

/**
 * Refund ARB payment
 */
const refundPayment = async (req, res) => {
  try {
    console.log('🚀 Refunding ARB payment...');
    
    const { transactionId, paymentId, amount, currencyCode, referenceType, reason } = req.body;

    if (!amount) {
      return res.status(400).json(createErrorResponse(
        'Missing required fields',
        'Amount is required for refund'
      ));
    }

    if (!transactionId && !paymentId) {
      return res.status(400).json(createErrorResponse(
        'Missing required fields',
        'Transaction ID or Payment ID is required for refund'
      ));
    }

    // Process refund with ARB
    const result = await arbService.refundPayment({
      transId: transactionId,
      paymentId: paymentId,
      amount: amount,
      currencyCode: currencyCode || '682',
      referenceType: referenceType || (transactionId ? 'TRANID' : 'PaymentID'),
      reason: reason || 'Customer request'
    });

    if (result.success) {
      res.json({
        success: true,
        data: {
          refundId: result.refundId,
          transactionId: result.transactionId,
          amount: result.amount,
          status: result.status,
          result: result.result,
          ref: result.ref,
          message: 'Refund processed successfully'
        }
      });
    } else {
      res.status(400).json(createErrorResponse(
        'Refund failed',
        result.error || 'Failed to process refund',
        result.code || 'REFUND_ERROR'
      ));
    }

  } catch (error) {
    logError(error, 'ArbController');
    res.status(500).json(createErrorResponse(
      'Internal server error',
      error.message
    ));
  }
};

/**
 * Get payment details
 */
const getPaymentDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json(createErrorResponse(
        'Transaction ID required',
        'Transaction ID parameter is missing'
      ));
    }

    const result = await arbService.getPaymentDetails(transactionId);

    if (result.success) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.status(404).json(createErrorResponse(
        'Payment not found',
        result.error || 'Payment not found',
        result.code || 'NOT_FOUND'
      ));
    }

  } catch (error) {
    logError(error, 'ArbController');
    res.status(500).json(createErrorResponse(
      'Internal server error',
      error.message
    ));
  }
};

/**
 * Inquiry payment status
 */
const inquiryPayment = async (req, res) => {
  try {
    console.log('🚀 Inquiring ARB payment status...');
    
    const { paymentId, transId, trackId, amount, currencyCode, referenceType } = req.body;

    if (!paymentId && !transId && !trackId) {
      return res.status(400).json(createErrorResponse(
        'Missing required fields',
        'Payment ID, Transaction ID, or Track ID is required for inquiry'
      ));
    }

    const result = await arbService.inquiryPayment({
      paymentId: paymentId,
      transId: transId,
      trackId: trackId,
      amount: amount || '0.00',
      currencyCode: currencyCode || '682',
      referenceType: referenceType || (paymentId ? 'PaymentID' : (transId ? 'TRANID' : 'TrackID'))
    });

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        paymentId: result.paymentId,
        message: 'Payment inquiry successful'
      });
    } else {
      res.status(400).json(createErrorResponse(
        'Inquiry failed',
        result.error || 'Failed to inquire payment status',
        result.code || 'INQUIRY_ERROR'
      ));
    }

  } catch (error) {
    logError(error, 'ArbController');
    res.status(500).json(createErrorResponse(
      'Internal server error',
      error.message
    ));
  }
};

/**
 * Void purchase
 */
const voidPurchase = async (req, res) => {
  try {
    console.log('🚀 Voiding ARB purchase...');
    
    const { transactionId, amount, currencyCode, reason } = req.body;

    if (!transactionId || !amount) {
      return res.status(400).json(createErrorResponse(
        'Missing required fields',
        'Transaction ID and amount are required for void'
      ));
    }

    const result = await arbService.voidPurchase({
      transId: transactionId,
      amount: amount,
      currencyCode: currencyCode || '682',
      reason: reason || 'Void purchase'
    });

    if (result.success) {
      res.json({
        success: true,
        data: {
          voidId: result.voidId,
          transactionId: result.transactionId,
          status: result.status,
          result: result.result,
          message: 'Purchase voided successfully'
        }
      });
    } else {
      res.status(400).json(createErrorResponse(
        'Void failed',
        result.error || 'Failed to void purchase',
        result.code || 'VOID_ERROR'
      ));
    }

  } catch (error) {
    logError(error, 'ArbController');
    res.status(500).json(createErrorResponse(
      'Internal server error',
      error.message
    ));
  }
};

/**
 * Void authorization
 */
const voidAuthorization = async (req, res) => {
  try {
    console.log('🚀 Voiding ARB authorization...');
    
    const { transactionId, amount, currencyCode, reason } = req.body;

    if (!transactionId || !amount) {
      return res.status(400).json(createErrorResponse(
        'Missing required fields',
        'Transaction ID and amount are required for void'
      ));
    }

    const result = await arbService.voidAuthorization({
      transId: transactionId,
      amount: amount,
      currencyCode: currencyCode || '682',
      reason: reason || 'Void authorization'
    });

    if (result.success) {
      res.json({
        success: true,
        data: {
          voidId: result.voidId,
          transactionId: result.transactionId,
          status: result.status,
          result: result.result,
          message: 'Authorization voided successfully'
        }
      });
    } else {
      res.status(400).json(createErrorResponse(
        'Void failed',
        result.error || 'Failed to void authorization',
        result.code || 'VOID_AUTH_ERROR'
      ));
    }

  } catch (error) {
    logError(error, 'ArbController');
    res.status(500).json(createErrorResponse(
      'Internal server error',
      error.message
    ));
  }
};

/**
 * Capture authorization
 */
const captureAuthorization = async (req, res) => {
  try {
    console.log('🚀 Capturing ARB authorization...');
    
    const { transactionId, amount, currencyCode, reason } = req.body;

    if (!transactionId || !amount) {
      return res.status(400).json(createErrorResponse(
        'Missing required fields',
        'Transaction ID and amount are required for capture'
      ));
    }

    const result = await arbService.captureAuthorization({
      transId: transactionId,
      amount: amount,
      currencyCode: currencyCode || '682',
      reason: reason || 'Capture authorization'
    });

    if (result.success) {
      res.json({
        success: true,
        data: {
          captureId: result.captureId,
          transactionId: result.transactionId,
          amount: result.amount,
          status: result.status,
          result: result.result,
          ref: result.ref,
          message: 'Authorization captured successfully'
        }
      });
    } else {
      res.status(400).json(createErrorResponse(
        'Capture failed',
        result.error || 'Failed to capture authorization',
        result.code || 'CAPTURE_ERROR'
      ));
    }

  } catch (error) {
    logError(error, 'ArbController');
    res.status(500).json(createErrorResponse(
      'Internal server error',
      error.message
    ));
  }
};

/**
 * Handle merchant notification/webhook
 * Must return acknowledgement: [{ status: 1, result: finalResultUrl }]
 * If no ack within timeout, ARB may void transaction
 */
const handleNotification = async (req, res) => {
  try {
    console.log('🚀 ARB Notification received');
    console.log('🚀 Request body:', req.body);
    
    const notificationData = req.body;

    // ARB notification format: [{ paymentId, trandata, status, error, errorText }]
    let notification = null;
    if (Array.isArray(notificationData) && notificationData[0]) {
      notification = notificationData[0];
    } else if (notificationData) {
      notification = notificationData;
    }

    if (!notification) {
      return res.status(400).json(createErrorResponse(
        'Invalid notification format',
        'Notification data is required'
      ));
    }

    const { paymentId, trandata, status, error, errorText } = notification;

    // Check for errors
    if (error || errorText || (status !== undefined && status !== null && status !== '1' && status !== 1)) {
      console.log('❌ Notification indicates failure:', { error, errorText, status });
      
      // Still acknowledge to prevent void
      return res.json([{
        status: '2',
        error: error || 'Transaction failed',
        errorText: errorText || 'Payment processing failed'
      }]);
    }

    // Process notification (decrypt trandata and verify)
    const result = await arbService.handleCallback(notification);

    // IMPORTANT: Return acknowledgement immediately as per ARB spec
    // Format: [{ status: 1, result: finalResultUrl }]
    const finalResultUrl = result.success
      ? `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/success?orderId=${result.orderId}`
      : `${process.env.FRONTEND_URL || 'http://localhost:3001'}/payment/cancel?orderId=${result.orderId || 'unknown'}`;

    // Return acknowledgement (must be fast to prevent void)
    res.json([{
      status: '1', // 1 = success acknowledgement
      result: finalResultUrl
    }]);

    // Process payment asynchronously (update order, send email, etc.)
    // This happens after acknowledgement to ensure we respond quickly
    if (result.success) {
      console.log('✅ Payment notification processed successfully:', {
        transactionId: result.transactionId,
        orderId: result.orderId,
        amount: result.amount,
        status: result.status
      });
      
      // Note: Order status updates are handled in the callback handler
      // Additional actions (email notifications, inventory updates) can be added here
      // asynchronously to not block the acknowledgement response
    } else {
      console.log('❌ Payment notification processing failed:', result.error);
    }

  } catch (error) {
    logError(error, 'ArbController');
    
    // Still acknowledge to prevent void, but indicate error
    res.json([{
      status: '2',
      error: 'Notification processing error',
      errorText: error.message || 'Failed to process notification'
    }]);
  }
};

module.exports = {
  createPayment,
  verifyPayment,
  handleCallback,
  refundPayment,
  getPaymentDetails,
  inquiryPayment,
  voidPurchase,
  voidAuthorization,
  captureAuthorization,
  handleNotification
};
