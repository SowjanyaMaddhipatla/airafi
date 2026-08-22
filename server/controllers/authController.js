const User = require('../models/User');
const Profile = require('../models/Profile');
const generateToken = require('../utils/generateToken');

// @desc  Step 1 of onboarding — create identity (username, email, password)
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400);
      throw new Error('Username, email, and password are all required');
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      res.status(409);
      throw new Error('A user with that email or username already exists');
    }

    // pre('save') hook hashes the password here — first and only .save() call.
    const user = await User.create({ username, email, password });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        hasProfile: false,
      },
      token: generateToken(user._id),
      message: 'Identity created. Proceed to onboarding to set up your financial profile.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Login and return user + profile (if onboarding is complete)
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required');
    }

    // Explicitly select password since schema hides it by default
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const profile = user.profile ? await Profile.findById(user.profile) : null;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        hasProfile: Boolean(profile),
      },
      profile: profile || null,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Return the currently authenticated user + profile
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = req.user; // set by protect middleware
    const profile = user.profile ? await Profile.findById(user.profile) : null;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        hasProfile: Boolean(profile),
      },
      profile: profile || null,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
