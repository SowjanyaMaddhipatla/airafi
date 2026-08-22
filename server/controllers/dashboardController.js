const Profile = require('../models/Profile');

// @desc  Instant dashboard read — pulls pre-computed totals, no aggregation.
// @route GET /api/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).select(
      'fullName balance totalIncome totalExpense updatedAt'
    );

    if (!profile) {
      res.status(404);
      throw new Error('No profile found — complete onboarding first');
    }

    res.status(200).json({
      success: true,
      dashboard: {
        fullName: profile.fullName,
        balance: profile.balance,
        totalIncome: profile.totalIncome,
        totalExpense: profile.totalExpense,
        lastUpdated: profile.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
