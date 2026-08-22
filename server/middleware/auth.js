const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protects routes — verifies the Bearer token and attaches req.user
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // password is excluded by default (select: false on schema)
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        res.status(401);
        return next(new Error('User not found — token invalid'));
      }

      return next();
    } catch (err) {
      res.status(401);
      return next(new Error('Not authorized — token failed or expired'));
    }
  }

  res.status(401);
  next(new Error('Not authorized — no token provided'));
};

module.exports = { protect };
