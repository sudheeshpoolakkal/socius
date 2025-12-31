const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authorized, please login' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied, admin only' });
  }

  next();
};

module.exports = { auth, adminAuth };