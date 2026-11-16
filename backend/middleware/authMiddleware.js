import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getFallbackUserById } from '../config/store.js';
import { getDbStatus } from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'studyhub_super_secret_jwt_key_2025_academic_notes'
      );

      if (getDbStatus()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = getFallbackUserById(decoded.id);
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User account not found' });
      }

      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
};
