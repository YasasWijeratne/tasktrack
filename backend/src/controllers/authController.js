const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role });
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const dummyPasswordHash = '$2b$12$LQv3c1yqBWVHxkd0LJHnWeFjY3n2JQ9zO3JxG8Q8O4dXHj6fW8V6u';

function makeToken(user) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!name?.trim() || !emailPattern.test(normalizedEmail) || !passwordPattern.test(password || '')) {
      return res.status(400).json({ message: 'Name, a valid email, and a password of at least 8 characters with a letter and number are required' });
    }
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with that email already exists' });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 12), role: 'user' });
    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user || typeof password !== 'string' || !(await bcrypt.compare(password, user?.password || dummyPasswordHash))) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (error) { next(error); }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: 'Account no longer exists' });
    res.json({ user: publicUser(user) });
  } catch (error) { next(error); }
};
