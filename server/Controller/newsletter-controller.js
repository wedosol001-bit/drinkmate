const Newsletter = require('../Models/newsletter-model');

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
  try {
    const { email, source = 'footer' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Check if email already exists
    let subscriber = await Newsletter.findOne({ email: email.toLowerCase().trim() });

    if (subscriber) {
      if (subscriber.subscribed) {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to our newsletter',
          subscribed: true
        });
      } else {
        // Resubscribe
        subscriber.subscribed = true;
        subscriber.subscribedAt = new Date();
        subscriber.unsubscribedAt = null;
        subscriber.source = source;
        await subscriber.save();

        return res.status(200).json({
          success: true,
          message: 'Successfully resubscribed to newsletter',
          subscribed: true
        });
      }
    }

    // Create new subscription
    subscriber = new Newsletter({
      email: email.toLowerCase().trim(),
      subscribed: true,
      source: source,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || null,
      userAgent: req.headers['user-agent'] || null
    });

    await subscriber.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscribed: true
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter',
      error: error.message
    });
  }
};

// Unsubscribe from newsletter
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase().trim() });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our newsletter list'
      });
    }

    if (!subscriber.subscribed) {
      return res.status(200).json({
        success: true,
        message: 'You are already unsubscribed',
        subscribed: false
      });
    }

    subscriber.subscribed = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
      subscribed: false
    });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from newsletter',
      error: error.message
    });
  }
};

// Get subscription status (for authenticated users)
exports.getStatus = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const subscriber = await Newsletter.findOne({ email: req.user.email.toLowerCase() });

    if (!subscriber) {
      return res.status(200).json({
        success: true,
        subscribed: false
      });
    }

    res.status(200).json({
      success: true,
      subscribed: subscriber.subscribed,
      subscribedAt: subscriber.subscribedAt
    });
  } catch (error) {
    console.error('Error getting newsletter status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription status',
      error: error.message
    });
  }
};

