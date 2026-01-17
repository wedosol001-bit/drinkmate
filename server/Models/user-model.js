const mongoose = require('mongoose');
const { validatePassword } = require('../Utils/password-policy');

const userSchema = new mongoose.Schema({
  // Basic Information
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long'],
    validate: {
      validator: function (v) {
        // Password must be at least 12 characters with at least one uppercase, lowercase, number, and special character
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      },
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },

  // Personal Information
  name: {
    type: String,
    required: false,
    trim: true,
    maxlength: 100,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        // Allow empty string or valid Saudi phone number
        return !v || /^(\+966|966|0)?[5-9][0-9]{8}$/.test(v);
      },
      message: 'Please enter a valid Saudi phone number (e.g., 0507551812)'
    }
  },

  // Address Information
  district: {
    type: String,
    trim: true
  },
  city: {
    type: String,
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
    validate: {
      validator: function (v) {
        // Allow empty string or valid national address format
        return !v || /^[A-Z]{4}[0-9]{4}$/.test(v);
      },
      message: 'National Address must be 4 letters followed by 4 numbers (e.g., JESA3591)'
    }
  },

  // Account Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked', 'pending'],
    default: 'active'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },

  // Role and Permissions
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },

  // Activity Tracking
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginCount: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },

  // Preferences
  preferences: {
    language: {
      type: String,
      enum: ['en', 'ar'],
      default: 'en'
    },
    currency: {
      type: String,
      default: 'SAR'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },

  // Social Login (if implemented later)
  socialLogins: [{
    provider: {
      type: String,
      enum: ['google', 'facebook', 'apple']
    },
    providerId: String,
    providerEmail: String
  }],

  // Security
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,

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

// Virtual for full name (now just returns the name field)
userSchema.virtual('fullName').get(function () {
  return this.name;
});

// Indexes for better performance (email and username already have unique indexes)
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

// Additional performance indexes
userSchema.index({ isAdmin: 1, status: 1 }); // For admin queries
userSchema.index({ lastLoginAt: -1 }); // For user activity tracking
userSchema.index({ city: 1, status: 1 }); // For location-based queries
userSchema.index({ phone: 1 }); // For phone number lookups
userSchema.index({ 'addresses.city': 1 }); // For address-based queries
userSchema.index({ updatedAt: -1 }); // For user updates
// email index removed - unique: true already creates {email: 1} index, and compound index {email: 1, status: 1} can serve email-only queries
userSchema.index({ email: 1, status: 1 }); // For email-based queries with status (compound index can also serve email-only queries)
userSchema.index({ username: 1, status: 1 }); // For username-based queries with status

// Pre-save middleware
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    this.updatedAt = Date.now();
    return next();
  }

  try {
    // Hash the password with cost of 10
    const bcrypt = require('bcryptjs');
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    this.updatedAt = Date.now();
    next();
  } catch (error) {
    next(error);
  }
});

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpires;
  return userObject;
};

// Method to check if user is active
userSchema.methods.isActive = function () {
  return this.status === 'active' && this.emailVerified;
};

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate auth token
userSchema.methods.generateAuthToken = function () {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    {
      id: this._id,
      isAdmin: this.isAdmin,
      role: this.role
    },
    process.env.JWT_SECRET || 'default_dev_secret',
    {
      expiresIn: '2d',
      issuer: 'drinkmate-api',
      audience: 'drinkmate-client'
    }
  );
};

// Pre-save hook to validate password
userSchema.pre('save', function (next) {
  // Only validate password if it's being modified
  if (!this.isModified('password')) {
    return next();
  }

  // Skip validation if password is already hashed (starts with $2a$, $2b$, or $2y$)
  // This happens when password is loaded from DB and not actually being changed
  if (this.password && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$') || this.password.startsWith('$2y$'))) {
    return next();
  }

  // Validate password against policy (only for new/plain text passwords)
  const validation = validatePassword(this.password);
  if (!validation.isValid) {
    const error = new Error('Password must be at least 12 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    error.errors = validation.errors;
    error.warnings = validation.warnings;
    return next(error);
  }

  // Log warnings if any
  if (validation.warnings.length > 0) {
    console.warn(`Password warnings for user ${this.email}:`, validation.warnings);
  }

  next();
});

module.exports = mongoose.model('User', userSchema);