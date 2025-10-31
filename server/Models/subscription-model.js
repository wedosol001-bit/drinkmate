const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: null
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  interval: {
    type: String,
    enum: ['4w', '8w', '12w'],
    required: true,
    default: '4w'
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active'
  },
  nextChargeAt: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  shippingAddress: {
    fullName: String,
    phone: String,
    district: String,
    city: String,
    country: String,
    nationalAddress: String
  }
}, {
  timestamps: true
});

// Indexes
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ status: 1, nextChargeAt: 1 });

// Method to calculate next charge date based on interval
subscriptionSchema.methods.calculateNextCharge = function() {
  const weeks = parseInt(this.interval.replace('w', '')) || 4;
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + (weeks * 7));
  return nextDate;
};

// Method to pause subscription
subscriptionSchema.methods.pause = function() {
  this.status = 'paused';
  return this.save();
};

// Method to resume subscription
subscriptionSchema.methods.resume = function() {
  this.status = 'active';
  return this.save();
};

// Method to cancel subscription
subscriptionSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

// Method to skip next delivery
subscriptionSchema.methods.skipNext = function() {
  this.nextChargeAt = this.calculateNextCharge();
  return this.save();
};

module.exports = mongoose.model('Subscription', subscriptionSchema);

