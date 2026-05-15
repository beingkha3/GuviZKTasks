const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      const field = existing.email === email ? 'Email' : 'Username';
      return res.status(409).json({ success: false, message: `${field} already exists` });
    }
    const user = await User.create({ username, email, password });
    const token = signToken(user._id);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = signToken(user._id);
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user: { id: user._id, username: user.username, email: user.email, createdAt: user.createdAt },
    });
  } catch (err) {
    next(err);
  }
};
