const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   GET api/users
// @desc    Get all users
// @access  Private - Admin only
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private - Admin only
router.get('/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT api/users/:id/role
// @desc    Update user role
// @access  Private - Admin only
router.put('/:id/role', auth, adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private - Admin only
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      message: 'User removed'
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;