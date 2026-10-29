const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function authMiddleware(req, res, next) {
  try {
    if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'Authentication is not configured' });
    const [scheme, token, ...extra] = (req.headers.authorization || '').trim().split(/\s+/);
    if (scheme !== 'Bearer' || !token || extra.length) return res.status(401).json({ message: 'Authentication required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Account no longer exists' });
    req.user = { id: user.id, role: user.role };
    next();
  } catch (_error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
