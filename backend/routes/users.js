const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middlewares/auth');

// Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.user.sub });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        subscriptionTier: user.subscriptionTier,
        docsThisMonth: user.docsThisMonth,
        totalDocsAnalyzed: user.totalDocsAnalyzed,
        totalSavings: user.totalSavings,
        canAnalyze: user.canAnalyze(),
        remainingAnalyses: user.subscriptionTier === 'free' 
          ? Math.max(0, 30 - user.docsThisMonth)
          : null
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile'
    });
  }
});

// Create or update user from Auth0 profile
router.post('/sync', protect, async (req, res) => {
  try {
    const { email, name, picture } = req.user;
    
    let user = await User.findOne({ auth0Id: req.user.sub });
    
    if (user) {
      // Update existing user
      user.email = email;
      user.name = name;
      user.picture = picture || user.picture;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        auth0Id: req.user.sub,
        email,
        name,
        picture,
        lastLogin: new Date()
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        subscriptionTier: user.subscriptionTier,
        docsThisMonth: user.docsThisMonth,
        totalDocsAnalyzed: user.totalDocsAnalyzed,
        totalSavings: user.totalSavings,
        canAnalyze: user.canAnalyze()
      }
    });
  } catch (error) {
    console.error('Sync user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync user profile'
    });
  }
});

// Update user subscription tier
router.patch('/subscription', protect, async (req, res) => {
  try {
    const { tier } = req.body;
    
    if (!['free', 'pro', 'team', 'enterprise'].includes(tier)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid subscription tier'
      });
    }

    const user = await User.findOne({ auth0Id: req.user.sub });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.subscriptionTier = tier;
    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        subscriptionTier: user.subscriptionTier,
        canAnalyze: user.canAnalyze()
      }
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update subscription'
    });
  }
});

// Get user statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.user.sub });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      stats: {
        docsThisMonth: user.docsThisMonth,
        totalDocsAnalyzed: user.totalDocsAnalyzed,
        totalSavings: user.totalSavings,
        subscriptionTier: user.subscriptionTier,
        remainingAnalyses: user.subscriptionTier === 'free' 
          ? Math.max(0, 30 - user.docsThisMonth)
          : null,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;
