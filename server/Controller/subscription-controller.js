const Subscription = require('../Models/subscription-model');
const Product = require('../Models/product-model');

// Get all subscriptions for the authenticated user
exports.getSubscriptions = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const subscriptions = await Subscription.find({ 
      user: userId,
      status: { $ne: 'cancelled' }
    })
    .populate('product', 'name nameAr slug images price')
    .sort({ createdAt: -1 });

    const formattedSubscriptions = subscriptions.map(sub => ({
      id: sub._id,
      productId: sub.product?._id || sub.product,
      productName: sub.productName,
      variant: sub.variant,
      quantity: sub.quantity,
      nextChargeAt: sub.nextChargeAt,
      interval: sub.interval,
      status: sub.status,
      createdAt: sub.createdAt
    }));

    res.status(200).json({
      success: true,
      subscriptions: formattedSubscriptions
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions',
      error: error.message
    });
  }
};

// Create a new subscription
exports.createSubscription = async (req, res) => {
  try {
    const { productId, productName, variant, quantity, interval, shippingAddress } = req.body;

    if (!productId || !quantity || !interval) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, quantity, and interval are required'
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Calculate next charge date
    const weeks = parseInt(interval.replace('w', '')) || 4;
    const nextChargeAt = new Date();
    nextChargeAt.setDate(nextChargeAt.getDate() + (weeks * 7));

    const userId = req.user._id || req.user.id;
    const subscription = new Subscription({
      user: userId,
      product: productId,
      productName: productName || product.name,
      variant: variant || null,
      quantity,
      interval,
      nextChargeAt,
      price: product.price * quantity,
      shippingAddress: shippingAddress || {}
    });

    await subscription.save();

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      subscription: {
        id: subscription._id,
        productId: subscription.product,
        productName: subscription.productName,
        variant: subscription.variant,
        quantity: subscription.quantity,
        nextChargeAt: subscription.nextChargeAt,
        interval: subscription.interval,
        status: subscription.status,
        createdAt: subscription.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
      error: error.message
    });
  }
};

// Update subscription
exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, interval, shippingAddress } = req.body;

    const subscription = await Subscription.findOne({
      _id: id,
      user: req.user._id || req.user.id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    if (quantity) subscription.quantity = quantity;
    if (interval) {
      subscription.interval = interval;
      const weeks = parseInt(interval.replace('w', '')) || 4;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + (weeks * 7));
      subscription.nextChargeAt = nextDate;
    }
    if (shippingAddress) subscription.shippingAddress = shippingAddress;

    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      subscription: {
        id: subscription._id,
        productId: subscription.product,
        productName: subscription.productName,
        variant: subscription.variant,
        quantity: subscription.quantity,
        nextChargeAt: subscription.nextChargeAt,
        interval: subscription.interval,
        status: subscription.status,
        createdAt: subscription.createdAt
      }
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription',
      error: error.message
    });
  }
};

// Pause subscription
exports.pauseSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findOne({
      _id: id,
      user: req.user._id || req.user.id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.status = 'paused';
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription paused successfully',
      subscription: {
        id: subscription._id,
        status: subscription.status
      }
    });
  } catch (error) {
    console.error('Error pausing subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to pause subscription',
      error: error.message
    });
  }
};

// Resume subscription
exports.resumeSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findOne({
      _id: id,
      user: req.user._id || req.user.id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.status = 'active';
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription resumed successfully',
      subscription: {
        id: subscription._id,
        status: subscription.status
      }
    });
  } catch (error) {
    console.error('Error resuming subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resume subscription',
      error: error.message
    });
  }
};

// Skip next delivery
exports.skipNextDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findOne({
      _id: id,
      user: req.user._id || req.user.id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.nextChargeAt = subscription.calculateNextCharge();
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Next delivery skipped successfully',
      subscription: {
        id: subscription._id,
        nextChargeAt: subscription.nextChargeAt
      }
    });
  } catch (error) {
    console.error('Error skipping next delivery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to skip next delivery',
      error: error.message
    });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findOne({
      _id: id,
      user: req.user._id || req.user.id
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: {
        id: subscription._id,
        status: subscription.status
      }
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
      error: error.message
    });
  }
};

