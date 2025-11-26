const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Auth0 user ID (sub claim)
  auth0Id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // Email from Auth0
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  // Name from Auth0 profile
  name: {
    type: String,
    required: true
  },
  // Profile picture URL
  picture: {
    type: String,
    default: null
  },
  // Subscription tier
  subscriptionTier: {
    type: String,
    enum: ['free', 'pro', 'team', 'enterprise'],
    default: 'free'
  },
  // Documents analyzed this month
  docsThisMonth: {
    type: Number,
    default: 0
  },
  // Last reset date for monthly counter
  lastResetDate: {
    type: Date,
    default: Date.now
  },
  // Total documents analyzed (lifetime)
  totalDocsAnalyzed: {
    type: Number,
    default: 0
  },
  // Total savings calculated
  totalSavings: {
    type: Number,
    default: 0
  },
  // Account metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Last login timestamp
  lastLogin: {
    type: Date,
    default: Date.now
  },
  // Account status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Reset monthly counter if month changed
userSchema.methods.resetMonthlyCounter = function() {
  const now = new Date();
  const lastReset = new Date(this.lastResetDate);
  
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    this.docsThisMonth = 0;
    this.lastResetDate = now;
    return true;
  }
  return false;
};

// Check if user can analyze (based on tier)
userSchema.methods.canAnalyze = function() {
  this.resetMonthlyCounter();
  
  if (this.subscriptionTier === 'pro' || this.subscriptionTier === 'team' || this.subscriptionTier === 'enterprise') {
    return true; // Unlimited
  }
  
  // Free tier: 30 per month
  return this.docsThisMonth < 30;
};

// Increment document count
userSchema.methods.incrementDocCount = function(savings = 0) {
  this.resetMonthlyCounter();
  this.docsThisMonth += 1;
  this.totalDocsAnalyzed += 1;
  this.totalSavings += savings;
  this.updatedAt = new Date();
};

// Pre-save hook to update updatedAt
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema);
