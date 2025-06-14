const Waitlist = require('../models/Waitlist');

// @desc    Add email to waitlist
// @route   POST /api/waitlist
// @access  Public
exports.addToWaitlist = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if email already exists
    const existingEmail = await Waitlist.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false,
        error: 'This email is already on the waitlist'
      });
    }

    const waitlistEntry = await Waitlist.create({ email });

    res.status(201).json({
      success: true,
      data: waitlistEntry,
      message: 'Thank you for joining the waitlist!'
    });
  } catch (err) {
    next(err);
  }
};