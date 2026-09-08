const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role });
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function makeToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !emailPattern.test(email || '') || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ message: 'Name, a valid email, and a password of at least 8 characters are required' });
    }
    if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account with that email already exists' });
    const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password: await bcrypt.hash(password, 12), role: 'user' });
    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (error) { next(error); }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user: publicUser(user) });
  } catch (error) { next(error); }
};
