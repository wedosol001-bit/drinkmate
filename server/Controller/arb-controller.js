const { createErrorResponse, logError } = require('../Utils/error-handler');
const arbService = require('../Services/arb-service');
const Order = require('../Models/order-model');
const Payment = require('../Models/payment-model');
const mongoose = require('mongoose');
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';


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

    // Find order by ObjectId or orderNumber
    const searchCriteria = {
      $or: []
    };

    // Check if orderId is a valid ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(orderId) && /^[0-9a-fA-F]{24}$/.test(orderId);

    if (isValidObjectId) {
      searchCriteria.$or.push({ _id: orderId });
      console.log('🔍 Searching by ObjectId:', orderId);
    }

    // Also search by orderNumber (case-insensitive, but schema stores uppercase)
    searchCriteria.$or.push({ orderNumber: orderId.toUpperCase() });
    console.log('🔍 Searching by orderNumber:', orderId.toUpperCase());

    console.log('🔍 Search criteria:', JSON.stringify(searchCriteria, null, 2));

    let order = null;
    try {
      order = await Order.findOne(searchCriteria);
    } catch (dbError) {
      console.error('❌ Database error finding order:', {
        error: dbError.message,
        stack: dbError.stack,
        searchCriteria: searchCriteria
      });
      throw dbError;
    }

    if (!order) {
      console.error('❌ Order not found:', {
        orderId: orderId,
        searchCriteria: searchCriteria,
        isValidObjectId: isValidObjectId
      });
      return res.status(404).json(createErrorResponse(
        'Order not found',
        `Order with ID or number "${orderId}" does not exist`
      ));
    }

    console.log('✅ Order found:', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      hasOrderNumber: !!order.orderNumber
    });

    // CRITICAL: Ensure orderNumber exists (generate if missing)
    if (!order.orderNumber) {
      console.warn('⚠️ Order number missing, generating now...');
      try {
        const OrderNumberGenerator = require('../Utils/order-number-generator');
        order.orderNumber = await OrderNumberGenerator.generateOrderNumber(Order);
        await order.save(); // This will trigger pre-save middleware
        console.log('✅ Order number generated and saved:', order.orderNumber);
      } catch (error) {
        console.error('❌ Failed to generate order number:', {
          error: error.message,
          stack: error.stack
        });
        // Fallback
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        order.orderNumber = `DM-${timestamp}-${random}`;
        try {
          await order.save();
          console.log('✅ Order number generated (fallback):', order.orderNumber);
        } catch (saveError) {
          console.error('❌ Failed to save order with fallback orderNumber:', {
            error: saveError.message,
            stack: saveError.stack
          });
          throw saveError;
        }
      }
    }

    // Use ObjectId for ARB trackId (more reliable)
    const orderObjectId = order._id.toString();
    const orderNumber = order.orderNumber; // For frontend display

    console.log('📋 Order prepared for payment:', {
      orderObjectId,
      orderNumber,
      hasOrderNumber: !!order.orderNumber
    });

    // Prepare payment data - use ObjectId for ARB, orderNumber for frontend
    // IMPORTANT: returnUrl and cancelUrl should point to BACKEND first
    // Backend will process payment, update order, then redirect to frontend
    const backendUrl = process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:3000';


    const paymentData = {
      amount,
      currency,
      orderId: orderObjectId, // ✅ Use ObjectId for ARB trackId
      orderNumber: orderNumber, // Keep orderNumber for reference
      customerEmail,
      customerName: customerName || '',
      customerPhone: customerPhone || '',
      description: description || `DrinkMate Order ${orderNumber}`,
      // User browser redirects go to backend first (GET request)
      returnUrl: `${backendUrl}/api/payments/arb/callback`,
      cancelUrl: `${backendUrl}/api/payments/arb/callback`,
      // Server notifications also go to backend (POST request)
      callbackUrl: `${backendUrl}/api/payments/arb/callback`
    };

    console.log('📤 Calling ARB service with payment data:', {
      amount: paymentData.amount,
      currency: paymentData.currency,
      orderId: paymentData.orderId,
      orderNumber: paymentData.orderNumber,
      returnUrl: paymentData.returnUrl,
      cancelUrl: paymentData.cancelUrl,
      callbackUrl: paymentData.callbackUrl,
      backendUrl: backendUrl,
      frontendUrl: frontendUrl
    });

    // Process payment with ARB
    let result;
    try {
      result = await arbService.processPayment(paymentData);
    } catch (arbError) {
      console.error('❌ ARB service error:', {
        error: arbError.message,
        stack: arbError.stack,
        paymentData: {
          amount: paymentData.amount,
          orderId: paymentData.orderId,
          orderNumber: paymentData.orderNumber
        }
      });
      throw arbError;
    }

    if (result.success) {
      res.json({
        success: true,
        data: {
          paymentUrl: result.paymentUrl,
          paymentId: result.paymentId,
          trackId: result.trackId, // This will be the ObjectId
          orderId: orderObjectId, // Return ObjectId
          orderNumber: orderNumber, // Return orderNumber for frontend
          transactionId: result.transactionId,
          message: 'Payment URL generated successfully. Redirect customer to paymentUrl.'
        }
      });
    } else {
      console.error('❌ ARB payment request failed:', {
        error: result.error,
        code: result.code,
        details: result.details
      });
      res.status(400).json(createErrorResponse(
        'Payment request failed',
        result.error || 'Failed to create payment request',
        result.code || 'PAYMENT_ERROR',
        result.details || {}
      ));
    }

  } catch (error) {
    console.error('❌ CRITICAL ERROR in createPayment:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      orderId: req.body?.orderId,
      amount: req.body?.amount
    });
    logError(error, 'ArbController', {
      context: 'createPayment',
      orderId: req.body?.orderId,
      amount: req.body?.amount
    });
    res.status(500).json(createErrorResponse(
      'Internal server error',
      error.message || 'An error occurred while processing your payment request'
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
 * Verify payment status by orderId/orderNumber
 * Useful when callback is missed or for manual verification
 */
const verifyPaymentByOrder = async (req, res) => {
  try {
    console.log('🚀 Verifying payment by order...');

    const { orderId, orderNumber } = req.body;

    if (!orderId && !orderNumber) {
      return res.status(400).json(createErrorResponse(
        'Order ID or Order Number required',
        'Either orderId or orderNumber must be provided'
      ));
    }

    console.log('🔍 Looking up order:', { orderId, orderNumber });

    // Build search criteria
    const searchCriteria = {
      $or: []
    };

    // Only add _id search if orderId is a valid ObjectId format
    if (orderId && mongoose.Types.ObjectId.isValid(orderId) && /^[0-9a-fA-F]{24}$/.test(orderId)) {
      searchCriteria.$or.push({ _id: orderId });
    }

    // Add orderNumber search if provided
    if (orderNumber) {
      searchCriteria.$or.push({ orderNumber: orderNumber.toUpperCase() });
    }

    // Find order
    const order = await Order.findOne(searchCriteria);

    if (!order) {
      console.error('❌ Order not found:', { orderId, orderNumber });
      return res.status(404).json(createErrorResponse(
        'Order not found',
        'Order with the specified ID or number does not exist'
      ));
    }

    console.log('✅ Order found:', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      currentPaymentStatus: order.paymentDetails.paymentStatus,
      orderTotal: order.total
    });

    // Check if already paid
    if (order.paymentDetails.paymentStatus === 'paid') {
      console.log('✅ Payment already verified');
      return res.json({
        success: true,
        message: 'Payment already verified',
        data: {
          orderId: order._id,
          orderNumber: order.orderNumber,
          paymentStatus: 'paid',
          transactionId: order.paymentDetails.transactionId,
          verified: true
        }
      });
    }

    // Find payment record
    const payment = await Payment.findOne({
      order: order._id,
      method: 'arb'
    });

    if (!payment) {
      console.error('❌ Payment record not found for order:', order._id);
      return res.status(404).json(createErrorResponse(
        'Payment record not found',
        'No payment record found for this order'
      ));
    }

    // Get payment IDs from payment record
    const paymentId = payment.gateway?.arbPaymentId;
    const transId = payment.gateway?.arbTransId || payment.gateway?.transactionId;
    const trackId = order.orderNumber;

    console.log('📋 Payment record data:', {
      paymentId: paymentId || 'N/A',
      transId: transId || 'N/A',
      trackId: trackId
    });

    if (!paymentId && !transId) {
      console.error('❌ Payment IDs missing from payment record');
      return res.status(400).json(createErrorResponse(
        'Payment IDs missing',
        'Payment record does not have paymentId or transId for verification'
      ));
    }

    // Perform inquiry
    console.log('🔍 Performing inquiry verification with ARB...');
    const inquiryResult = await arbService.inquiryPayment({
      paymentId: paymentId || null,
      transId: transId || null,
      trackId: trackId,
      amount: order.total.toFixed(2),
      currencyCode: '682',
      referenceType: paymentId ? 'PaymentID' : (transId ? 'TRANID' : 'TrackID')
    });

    if (!inquiryResult.success) {
      console.error('❌ Inquiry verification failed:', inquiryResult.error);
      return res.status(400).json(createErrorResponse(
        'Payment verification failed',
        inquiryResult.error || 'Failed to verify payment with ARB',
        inquiryResult.code || 'VERIFICATION_ERROR'
      ));
    }

    // Verify amount and currency
    const verifiedAmount = parseFloat(inquiryResult.data?.amt || inquiryResult.amount || '0');
    const verifiedCurrency = inquiryResult.data?.currencyCode || inquiryResult.currencyCode || '682';

    console.log('📊 Verification results:', {
      verifiedAmount,
      verifiedCurrency,
      orderAmount: order.total,
      amountMatch: Math.abs(verifiedAmount - order.total) <= 0.01
    });

    if (Math.abs(verifiedAmount - order.total) > 0.01) {
      console.error('❌ Amount mismatch');
      return res.status(400).json(createErrorResponse(
        'Amount mismatch',
        `Payment amount mismatch: expected ${order.total}, got ${verifiedAmount}`
      ));
    }

    if (verifiedCurrency !== '682') {
      console.error('❌ Currency mismatch');
      return res.status(400).json(createErrorResponse(
        'Currency mismatch',
        `Currency mismatch: expected 682 (SAR), got ${verifiedCurrency}`
      ));
    }

    // Verify payment status
    const verifiedResult = inquiryResult.data?.result || inquiryResult.result;
    if (verifiedResult !== 'CAPTURED' && verifiedResult !== 'APPROVED') {
      console.error('❌ Payment not captured/approved:', verifiedResult);
      return res.status(400).json(createErrorResponse(
        'Payment not captured',
        `Payment status is ${verifiedResult}, expected CAPTURED or APPROVED`
      ));
    }

    console.log('✅ Verification successful, updating order...');

    // Update order payment status
    await order.updatePaymentStatus('paid', transId || payment.gateway?.arbTransId);

    // Update order status if pending
    if (order.status === 'pending') {
      await order.updateStatus('confirmed', 'Payment verified via inquiry', 'system');
    }

    // Update payment record
    payment.status = 'completed';
    payment.gateway.arbPaymentId = paymentId || payment.gateway.arbPaymentId;
    payment.gateway.arbTransId = transId || payment.gateway.arbTransId;
    payment.gateway.arbResult = verifiedResult;
    await payment.save();

    // Verify the update
    const updatedOrder = await Order.findById(order._id);

    console.log('✅ Payment verified and order updated:', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      paymentStatus: updatedOrder.paymentDetails.paymentStatus,
      orderStatus: updatedOrder.status,
      transactionId: transId
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: 'paid',
        transactionId: transId,
        amount: verifiedAmount,
        currency: 'SAR',
        result: verifiedResult,
        verified: true
      }
    });

  } catch (error) {
    console.error('❌ Error in verifyPaymentByOrder:', error);
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
    console.log('🚀 ==================== ARB CALLBACK START ====================');
    console.log('🚀 Request method:', req.method);
    console.log('🚀 Request URL:', req.originalUrl);
    console.log('🚀 Request body:', JSON.stringify(req.body, null, 2));
    console.log('🚀 Query params:', JSON.stringify(req.query, null, 2));
    console.log('🚀 Headers:', {
      'content-type': req.headers['content-type'],
      'user-agent': req.headers['user-agent'],
      'x-forwarded-for': req.headers['x-forwarded-for'],
      'x-real-ip': req.headers['x-real-ip']
    });
    console.log('🚀 Is GET request (user redirect):', req.method === 'GET');
    console.log('🚀 Is POST request (server notification):', req.method === 'POST');

    // ARB can send data in body (POST notification) or query params (GET redirect)
    const callbackData = req.method === 'GET' ? req.query : req.body;

    // Handle empty callback data gracefully
    if (!callbackData || (typeof callbackData === 'object' && Object.keys(callbackData).length === 0)) {
      console.error('❌ Empty or invalid callback data received:', {
        method: req.method,
        hasBody: !!req.body,
        hasQuery: !!req.query,
        bodyKeys: req.body ? Object.keys(req.body) : [],
        queryKeys: req.query ? Object.keys(req.query) : []
      });

      if (req.method === 'GET' || req.method === 'POST') {

        console.log('🔄 Redirecting to frontend error page (empty callback data)');
        return res.redirect(`${frontendUrl}/payment/cancel?error=${encodeURIComponent('No callback data received from payment gateway')}`);
      }

      return res.status(400).json({
        success: false,
        error: 'Invalid callback data',
        message: 'No callback data received from payment gateway',
        timestamp: new Date().toISOString(),
        code: 'INVALID_CALLBACK_DATA'
      });
    }

    // Check for cancellation/error indicators in callback data BEFORE processing
    const hasError = callbackData.error || callbackData.errorText;
    const hasErrorStatus = callbackData.status === '2' || callbackData.status === 2; // ARB uses status='2' for failure
    const isCancelled = hasError || hasErrorStatus;

    console.log('🔍 Callback status check:', {
      hasError: !!hasError,
      hasErrorStatus: hasErrorStatus,
      isCancelled: isCancelled,
      error: callbackData.error || 'N/A',
      errorText: callbackData.errorText || 'N/A',
      status: callbackData.status || 'N/A'
    });

    // Process callback with ARB service
    console.log('🔄 Processing callback with ARB service...');
    let result;
    try {
      result = await arbService.handleCallback(callbackData);
      console.log('📋 ARB service callback result:', {
        success: result.success,
        result: result.result,
        orderId: result.orderId || result.trackId,
        transactionId: result.transactionId,
        paymentId: result.paymentId,
        amount: result.amount,
        status: result.status,
        hasError: !!result.error,
        error: result.error || 'N/A'
      });
    } catch (serviceError) {
      console.error('❌ ARB service handleCallback error:', {
        error: serviceError.message,
        stack: serviceError.stack,
        callbackData: callbackData
      });

      // If service error, still try to redirect or return error
      if (req.method === 'GET' || req.method === 'POST') {

        const orderId = callbackData.trackId || callbackData.orderId || 'unknown';
        console.log('🔄 Redirecting to frontend error page (service error)');
        return res.redirect(`${frontendUrl}/payment/cancel?orderId=${orderId}&error=${encodeURIComponent(serviceError.message || 'Payment processing error')}`);
      }

      return res.status(500).json({
        success: false,
        error: 'Payment processing error',
        message: serviceError.message || 'Failed to process payment callback',
        timestamp: new Date().toISOString(),
        code: 'SERVICE_ERROR'
      });
    }

    // Check if payment was cancelled or failed
    const paymentResult = result.result; // 'CAPTURED', 'APPROVED', or error status
    const isPaymentSuccessful = paymentResult === 'CAPTURED' || paymentResult === 'APPROVED';
    const isPaymentCancelled = isCancelled || (!isPaymentSuccessful && result.success === false);

    console.log('🔍 Payment result analysis:', {
      paymentResult: paymentResult,
      isPaymentSuccessful: isPaymentSuccessful,
      isPaymentCancelled: isPaymentCancelled,
      hasError: isCancelled,
      willProcess: result.success && isPaymentSuccessful && !isCancelled
    });

    if (result.success && isPaymentSuccessful && !isCancelled) {
      // Idempotency: Check if payment already processed
      const orderId = result.orderId || result.trackId;

      // Store orderNumber for redirect (accessible outside order lookup block)
      let orderNumberForRedirect = null;

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
        // orderId from ARB callback is now the ObjectId (trackId)
        // Direct lookup by ObjectId - simple and fast!
        console.log('🔍 Looking up order by ObjectId:', {
          orderId: orderId,
          isValidObjectId: mongoose.Types.ObjectId.isValid(orderId)
        });

        let order = null;

        // If it's a valid ObjectId, use direct lookup (primary path)
        if (mongoose.Types.ObjectId.isValid(orderId) && /^[0-9a-fA-F]{24}$/.test(orderId)) {
          order = await Order.findById(orderId);
        } else {
          // Fallback: might be orderNumber (for backward compatibility with old orders)
          console.warn('⚠️ orderId is not a valid ObjectId, trying orderNumber lookup:', orderId);
          order = await Order.findOne({ orderNumber: orderId.toUpperCase() });
        }

        if (!order) {
          console.error('❌ CRITICAL: Order not found for callback:', {
            orderId,
            paymentId,
            transId,
            timestamp: new Date().toISOString()
          });

          // Still return success to ARB (don't break their flow)
          // But log this as a critical error that needs investigation
          if (req.method === 'GET' || req.method === 'POST') {

            return res.redirect(`${frontendUrl}/payment/success?orderId=${orderId}&status=success`);
          }
          return res.json({
            success: true,
            message: 'Payment processed but order not found',
            warning: `Order ${orderId} not found in database - manual verification required`
          });
        }

        // Ensure orderNumber exists (should already exist, but double-check)
        if (!order.orderNumber) {
          console.warn('⚠️ Order number missing in callback, generating now...');
          try {
            const OrderNumberGenerator = require('../Utils/order-number-generator');
            order.orderNumber = await OrderNumberGenerator.generateOrderNumber(Order);
            await order.save();
            console.log('✅ Order number generated in callback:', order.orderNumber);
          } catch (error) {
            console.error('❌ Failed to generate order number in callback:', error);
            // Fallback
            const timestamp = Date.now().toString().slice(-8);
            const random = Math.random().toString(36).substr(2, 4).toUpperCase();
            order.orderNumber = `DM-${timestamp}-${random}`;
            await order.save();
          }
        }

        // Store orderNumber for redirect (accessible outside this block)
        orderNumberForRedirect = order.orderNumber || orderId;

        console.log('✅ Order found:', {
          orderId: order._id,
          orderNumber: order.orderNumber,
          currentPaymentStatus: order.paymentDetails.paymentStatus,
          currentOrderStatus: order.status,
          orderTotal: order.total,
          orderDetails: {
            _id: order._id.toString(),
            orderNumber: order.orderNumber,
            status: order.status,
            paymentMethod: order.paymentMethod,
            paymentDetails: {
              paymentStatus: order.paymentDetails.paymentStatus,
              transactionId: order.paymentDetails.transactionId,
              paymentDate: order.paymentDetails.paymentDate
            },
            total: order.total,
            subtotal: order.subtotal,
            shippingCost: order.shippingCost,
            tax: order.tax,
            discount: order.discount,
            itemsCount: order.items?.length || 0,
            customer: order.user ? order.user.toString() : null,
            guestInfo: order.guestInfo ? {
              email: order.guestInfo.email,
              name: order.guestInfo.name
            } : null,
            shippingAddress: order.shippingAddress ? {
              city: order.shippingAddress.city,
              district: order.shippingAddress.district,
              country: order.shippingAddress.country
            } : null,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
          }
        });

        // Check if already paid (idempotency check)
        if (order.paymentDetails.paymentStatus === 'paid') {
          console.log('⚠️ Payment already processed (idempotency):', {
            orderId: order._id,
            orderNumber: order.orderNumber,
            transactionId: transId,
            existingTransactionId: order.paymentDetails.transactionId
          });

          // Store orderNumber for redirect
          orderNumberForRedirect = order.orderNumber || orderId;

          // Still return success
          if (req.method === 'GET' || req.method === 'POST') {

            const redirectOrderId = orderNumberForRedirect || order.orderNumber || orderId; // Use orderNumber for frontend
            return res.redirect(`${frontendUrl}/payment/success?orderId=${redirectOrderId}&status=success`);
          }
          return res.json({
            success: true,
            message: 'Payment already processed',
            data: result
          });
        }

        // CRITICAL: Always perform server-to-server status verification before fulfilling order
        console.log('🔍 Performing server-to-server status verification...');

        // Check if we have valid payment result from callback
        const hasValidPaymentResult = paymentResult === 'CAPTURED' || paymentResult === 'APPROVED';
        // Normalize and validate paymentId
        const normalizedPaymentId = paymentId ? String(paymentId).trim() : null;
        const hasValidPaymentId = normalizedPaymentId && normalizedPaymentId.length > 0 && /^\d+$/.test(normalizedPaymentId);
        const hasValidTransId = transId && String(transId).trim().length > 0;

        console.log('📋 Verification prerequisites:', {
          hasValidPaymentResult,
          hasValidPaymentId,
          hasValidTransId,
          paymentId: normalizedPaymentId || 'N/A',
          transId: transId || 'N/A',
          paymentResult: paymentResult || 'N/A'
        });

        let verificationPassed = false;
        let verificationError = null;

        try {
          // ALWAYS attempt inquiry if we have paymentId or transId (even if callback looks valid)
          // This ensures we verify with ARB's authoritative system
          if (hasValidPaymentId || hasValidTransId) {
            console.log('✅ Performing inquiry verification with ARB...');

            const verificationResult = await arbService.inquiryPayment({
              paymentId: hasValidPaymentId ? normalizedPaymentId : null,
              transId: hasValidTransId ? String(transId).trim() : null,
              trackId: orderId,
              amount: order.total.toFixed(2),
              currencyCode: '682',
              referenceType: hasValidPaymentId ? 'PaymentID' : (hasValidTransId ? 'TRANID' : 'TrackID')
            });

            if (verificationResult.success) {
              // Verify amount and currency match
              const verifiedAmount = parseFloat(verificationResult.data?.amt || verificationResult.amount || '0');
              const verifiedCurrency = verificationResult.data?.currencyCode || verificationResult.currencyCode || '682';

              console.log('📊 Inquiry verification results:', {
                verifiedAmount,
                verifiedCurrency,
                orderAmount: order.total,
                amountMatch: Math.abs(verifiedAmount - order.total) <= 0.01
              });

              if (Math.abs(verifiedAmount - order.total) > 0.01) {
                throw new Error(`Amount mismatch: expected ${order.total}, got ${verifiedAmount}`);
              }

              if (verifiedCurrency !== '682') {
                throw new Error(`Currency mismatch: expected 682 (SAR), got ${verifiedCurrency}`);
              }

              // Verify payment status
              const verifiedResult = verificationResult.data?.result || verificationResult.result;
              if (verifiedResult !== 'CAPTURED' && verifiedResult !== 'APPROVED') {
                throw new Error(`Payment status invalid: ${verifiedResult}`);
              }

              verificationPassed = true;
              console.log('✅ Inquiry verification successful:', {
                paymentId: normalizedPaymentId || 'N/A',
                transId: transId || 'N/A',
                result: verifiedResult,
                amount: verifiedAmount
              });
            } else {
              throw new Error(`Inquiry failed: ${verificationResult.error}`);
            }
          } else if (hasValidPaymentResult) {
            // No IDs but have valid payment result - log warning but proceed
            console.warn('⚠️ No paymentId/transId for inquiry, but callback shows valid payment result');
            console.warn('⚠️ Proceeding with callback data (inquiry not possible without IDs)');
            verificationPassed = true; // Trust callback if no way to verify
          } else {
            throw new Error('Cannot verify payment - missing paymentId, transId, and payment result');
          }
        } catch (verifyError) {
          verificationError = verifyError;
          console.error('❌ Payment verification failed:', {
            error: verifyError.message,
            stack: verifyError.stack,
            hasValidPaymentResult,
            hasValidPaymentId,
            hasValidTransId
          });

          // If we have valid payment result from callback, log warning but proceed
          if (hasValidPaymentResult) {
            console.warn('⚠️ Inquiry verification failed but callback shows valid payment result - proceeding with callback data');
            verificationPassed = true; // Fallback to callback data
          } else {
            // No valid payment result and verification failed - reject
            console.error('❌ CRITICAL: Payment verification failed and no valid callback result');
            throw new Error(`Payment verification failed: ${verifyError.message}`);
          }
        }

        // Only proceed with order update if verification passed
        if (!verificationPassed) {
          throw new Error('Payment verification failed - cannot update order');
        }

        // ENHANCED: Wrap update in try-catch with better error handling
        try {
          console.log('💾 Updating order payment status...');

          // Make all updates to the order object BEFORE saving (prevents parallel save errors)
          order.paymentDetails.paymentStatus = 'paid';
          order.paymentDetails.transactionId = transId;
          order.paymentDetails.paymentDate = new Date();
          order.addTimelineEntry('payment_paid', 'Payment paid', 'system');

          // Update order status if pending
          if (order.status === 'pending') {
            order.status = 'confirmed';
            order.addTimelineEntry('confirmed', 'Payment received via ARB', 'system');
          }

          // Single atomic save
          await order.save();
          console.log('✅ Order updated successfully:', {
            paymentStatus: order.paymentDetails.paymentStatus,
            orderStatus: order.status,
            transactionId: transId
          });

          // Update or create payment record
          let payment = await Payment.findOne({
            $or: [
              { 'gateway.arbPaymentId': paymentId },
              { 'gateway.arbTransId': transId },
              { order: order._id, method: 'arb' }
            ]
          });

          if (!payment) {
            console.log('💾 Creating new payment record...');
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
            console.log('✅ Payment record created');
          } else {
            console.log('💾 Updating existing payment record...');
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
            console.log('✅ Payment record updated');
          }

          // Verify the update actually worked
          const updatedOrder = await Order.findById(order._id);
          if (!updatedOrder) {
            throw new Error('Order not found after update - database consistency issue');
          }

          if (updatedOrder.paymentDetails.paymentStatus !== 'paid') {
            throw new Error(`Order payment status update failed - status is ${updatedOrder.paymentDetails.paymentStatus}, expected 'paid'`);
          }

          console.log('✅ Order and payment updated successfully - Full updated order data:', {
            orderId: order._id,
            orderNumber: order.orderNumber,
            transactionId: transId,
            paymentId: paymentId,
            paymentStatus: updatedOrder.paymentDetails.paymentStatus,
            orderStatus: updatedOrder.status,
            paymentRecordId: payment._id,
            timestamp: new Date().toISOString(),
            updatedOrderDetails: {
              _id: updatedOrder._id.toString(),
              orderNumber: updatedOrder.orderNumber,
              status: updatedOrder.status,
              paymentMethod: updatedOrder.paymentMethod,
              paymentDetails: {
                paymentStatus: updatedOrder.paymentDetails.paymentStatus,
                transactionId: updatedOrder.paymentDetails.transactionId,
                paymentDate: updatedOrder.paymentDetails.paymentDate
              },
              total: updatedOrder.total,
              subtotal: updatedOrder.subtotal,
              shippingCost: updatedOrder.shippingCost,
              tax: updatedOrder.tax,
              discount: updatedOrder.discount,
              itemsCount: updatedOrder.items?.length || 0,
              timeline: updatedOrder.timeline?.slice(-3) || [], // Last 3 timeline entries
              updatedAt: updatedOrder.updatedAt
            },
            paymentRecordDetails: {
              _id: payment._id.toString(),
              paymentId: payment.paymentId,
              status: payment.status,
              amount: payment.amount,
              currency: payment.currency,
              method: payment.method,
              gateway: {
                transactionId: payment.gateway.transactionId,
                arbPaymentId: payment.gateway.arbPaymentId,
                arbTransId: payment.gateway.arbTransId,
                arbResult: payment.gateway.arbResult
              },
              createdAt: payment.createdAt,
              updatedAt: payment.updatedAt || payment.createdAt
            }
          });



          const redirectOrderId = orderNumberForRedirect || order.orderNumber || orderId;
          return res.redirect(`${frontendUrl}/payment/success?orderId=${redirectOrderId}&status=success`);
        } catch (updateError) {
          console.error('❌ CRITICAL: Failed to update order/payment:', {
            error: updateError.message,
            stack: updateError.stack,
            orderId: order._id,
            orderNumber: order.orderNumber,
            transactionId: transId,
            timestamp: new Date().toISOString()
          });

          // Log this as a critical error but don't fail the callback
          // ARB expects a response, so we still return success
          // But this needs to be investigated and fixed
          logError(updateError, 'ArbController', {
            context: 'handleCallback_orderUpdate',
            orderId: order._id,
            orderNumber: order.orderNumber
          });

          // Still return success to ARB to avoid breaking their flow
          // The order can be manually verified later using verify-order endpoint
          console.warn('⚠️ Returning success to ARB despite update failure - manual verification required');
        }
      } else {
        console.error('❌ No orderId in callback result:', {
          result: result,
          callbackData: callbackData,
          timestamp: new Date().toISOString()
        });

        // Even without orderId, if it's a GET request and payment was successful, redirect to frontend
        if (req.method === 'GET' || req.method === 'POST' && result.success) {

          const fallbackOrderId = result.trackId || 'unknown';
          const redirectUrl = `${frontendUrl}/payment/success?orderId=${fallbackOrderId}&status=success`;

          console.log('🔄 Redirecting to frontend (no orderId in result, using fallback):', {
            fallbackOrderId,
            redirectUrl
          });

          return res.redirect(redirectUrl);
        }
      }

      console.log('✅ Payment processed successfully:', {
        transactionId: result.transactionId,
        orderId: result.orderId,
        amount: result.amount,
        status: result.status,
        requestMethod: req.method
      });

      // For GET requests (redirects), process payment server-side then redirect to frontend
      if (req.method === 'GET' || req.method === 'POST') {
        const orderIdFromResult = result.orderId || result.trackId;


        console.log('🔄 Preparing redirect for GET request:', {
          orderIdFromResult,
          orderNumberForRedirect,
          frontendUrl,
          hasOrderNumber: !!orderNumberForRedirect
        });

        // Use stored orderNumber if available, otherwise try to fetch it
        let redirectOrderId = orderNumberForRedirect || orderIdFromResult;

        // If we don't have orderNumber, try to fetch it (fallback)
        if (!orderNumberForRedirect && orderIdFromResult && mongoose.Types.ObjectId.isValid(orderIdFromResult)) {
          try {
            console.log('🔍 Fetching orderNumber for redirect (fallback)...');
            const orderForRedirect = await Order.findById(orderIdFromResult);
            if (orderForRedirect && orderForRedirect.orderNumber) {
              redirectOrderId = orderForRedirect.orderNumber;
              console.log('✅ Found orderNumber for redirect:', redirectOrderId);
            } else {
              console.warn('⚠️ Order found but no orderNumber, using orderId:', orderIdFromResult);
            }
          } catch (err) {
            // Fallback to orderId if lookup fails
            console.warn('⚠️ Could not fetch orderNumber for redirect, using orderId:', err.message);
          }
        }

        const redirectUrl = `${frontendUrl}/payment/success?orderId=${redirectOrderId}&status=success`;

        console.log('🔄 ========== REDIRECTING TO FRONTEND ==========');
        console.log('🔄 Request Method:', req.method);
        console.log('🔄 Order ID:', orderIdFromResult);
        console.log('🔄 Order Number:', redirectOrderId);
        console.log('🔄 Frontend URL:', frontendUrl);
        console.log('🔄 Full Redirect URL:', redirectUrl);
        console.log('🔄 Timestamp:', new Date().toISOString());
        console.log('🔄 ===============================================');

        return res.redirect(redirectUrl);
      }

      // For POST requests (notifications), return JSON
      console.log('📬 Returning JSON response for POST notification', frontendUrl, redirectOrderId);
      // res.json({
      //   success: true,
      //   message: 'Payment processed successfully',
      //   data: result
      // });
      return res.redirect(`${frontendUrl}/payment/success?orderId=${redirectOrderId}&status=success`);
    } else {
      console.log('❌ Payment processing failed or cancelled:', {
        error: result.error,
        isCancelled: isPaymentCancelled,
        paymentResult: paymentResult,
        requestMethod: req.method
      });

      // For GET requests (redirects), redirect to cancel/error page
      if (req.method === 'GET' || req.method === 'POST') {
        const orderId = result.orderId || callbackData.trackId || callbackData.trackId || 'unknown';

        const errorMessage = isPaymentCancelled
          ? 'Payment was cancelled'
          : (result.error || 'Payment failed');

        console.log('🔄 ========== REDIRECTING TO FRONTEND ERROR PAGE ==========');
        console.log('🔄 Request Method:', req.method);S
        console.log('🔄 Order ID:', orderId);
        console.log('🔄 Error Message:', errorMessage);
        console.log('🔄 Frontend URL:', frontendUrl);
        console.log('🔄 Redirect URL:', `${frontendUrl}/payment/cancel?orderId=${orderId}&error=${encodeURIComponent(errorMessage)}`);
        console.log('🔄 ==========================================================');

        return res.redirect(`${frontendUrl}/payment/cancel?orderId=${orderId}&error=${encodeURIComponent(errorMessage)}`);
      }

      // For POST requests (notifications), return JSON error
      res.status(400).json(createErrorResponse(
        'Payment processing failed',
        result.error || 'Failed to process payment',
        result.code || 'CALLBACK_ERROR'
      ));
    }

  } catch (error) {
    // Enhanced error logging
    console.error('❌ CRITICAL: Unhandled error in handleCallback:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      query: req.query,
      timestamp: new Date().toISOString()
    });

    logError(error, 'ArbController', {
      context: 'handleCallback',
      method: req.method,
      url: req.originalUrl
    });

    // For GET requests, always redirect to error page (don't break ARB's flow)
    if (req.method === 'GET' || req.method === 'POST') {

      const orderId = req.query?.orderId || req.query?.trackId || req.body?.orderId || req.body?.trackId || 'unknown';
      const errorMessage = error.message || 'Payment processing error';

      console.log('🔄 Redirecting to frontend error page (unhandled error):', {
        orderId: orderId,
        errorMessage: errorMessage,
        redirectUrl: `${frontendUrl}/payment/cancel?orderId=${orderId}&error=${encodeURIComponent(errorMessage)}`
      });

      return res.redirect(`${frontendUrl}/payment/cancel?orderId=${orderId}&error=${encodeURIComponent(errorMessage)}`);
    }

    // For POST requests, return JSON error
    const errorResponse = createErrorResponse(error, req);
    console.log('📤 Returning error response (POST):', {
      status: errorResponse.status,
      error: errorResponse.data.error,
      code: errorResponse.data.code
    });

    res.status(errorResponse.status).json(errorResponse.data);
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
  verifyPaymentByOrder,
  handleCallback,
  refundPayment,
  getPaymentDetails,
  inquiryPayment,
  voidPurchase,
  voidAuthorization,
  captureAuthorization,
  handleNotification
};
