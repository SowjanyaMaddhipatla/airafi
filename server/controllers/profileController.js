const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc  Step 2 of onboarding — create financial profile & link to user
// @route POST /api/profile/onboarding
const createProfile = async (req, res, next) => {
  try {
    const { fullName, startingBalance } = req.body;

    if (!fullName) {
      res.status(400);
      throw new Error('Full name is required');
    }

    const existing = await Profile.findOne({ user: req.user._id });
    if (existing) {
      res.status(409);
      throw new Error('Profile already exists for this user');
    }

    const opening = Number(startingBalance) || 0;

    const profile = await Profile.create({
      user: req.user._id,
      fullName,
      balance: opening,
      totalIncome: opening > 0 ? opening : 0,
      totalExpense: 0,
    });

    // Step 3 linking: direct targeted update, bypasses User's pre('save')
    // hook entirely — this is the fix for Issue 3 (double-hash bug).
    await User.findByIdAndUpdate(req.user._id, { profile: profile._id });

    res.status(201).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// @desc  Fetch the logged-in user's profile
// @route GET /api/profile
const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      res.status(404);
      throw new Error('No profile found — complete onboarding first');
    }
    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

module.exports = { createProfile, getProfile };
