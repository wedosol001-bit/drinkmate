const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  // User who owns this address
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Address Information
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^\+966\d{9}$/, 'Phone must start with +966 and contain 9 digits']
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    default: 'Saudi Arabia',
    trim: true
  },
  nationalAddress: {
    type: String,
    trim: true,
    uppercase: true,
    match: [/^[A-Z]{4}[0-9]{4}$|^$/, 'National Address must be 4 letters followed by 4 numbers (e.g., JESA3591)']
  },
  
  // Address Status
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
addressSchema.index({ user: 1, isDefault: 1 });
addressSchema.index({ user: 1, isActive: 1 });
addressSchema.index({ user: 1, createdAt: -1 });

// Pre-save middleware to ensure only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    // Remove default flag from all other addresses for this user
    await mongoose.model('Address').updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  this.updatedAt = Date.now();
  next();
});

// Method to set as default (will unset others)
addressSchema.methods.setAsDefault = async function() {
  await mongoose.model('Address').updateMany(
    { user: this.user, _id: { $ne: this._id } },
    { $set: { isDefault: false } }
  );
  this.isDefault = true;
  return this.save();
};

module.exports = mongoose.model('Address', addressSchema);

