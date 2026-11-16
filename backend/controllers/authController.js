import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import {
  getFallbackUserByEmail,
  getFallbackUserById,
  getRawFallbackUserById,
  createFallbackUser,
} from '../config/store.js';
import { getDbStatus } from '../config/db.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'studyhub_super_secret_jwt_key_2025_academic_notes',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, department, semester } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (getDbStatus()) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        department: department || 'Computer Science & Engineering',
        semester: Number(semester) || 1,
        role: 'student',
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        semester: user.semester,
        bio: user.bio,
        avatar: user.avatar,
        bookmarks: user.bookmarks,
        token: generateToken(user._id),
      });
    } else {
      // Fallback store
      const userExists = getFallbackUserByEmail(email);
      if (userExists) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = createFallbackUser({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        department: department || 'Computer Science & Engineering',
        semester: Number(semester) || 1,
        role: 'student',
        bio: 'Student at StudyHub learning and sharing academic resources.',
        avatar: '',
      });

      return res.status(201).json({
        ...user,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (getDbStatus()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          semester: user.semester,
          bio: user.bio,
          avatar: user.avatar,
          bookmarks: user.bookmarks,
          token: generateToken(user._id),
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    } else {
      // Fallback store
      const user = getFallbackUserByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password: _, ...safeUser } = user;
        return res.json({
          ...safeUser,
          token: generateToken(user._id),
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    if (getDbStatus()) {
      const user = await User.findById(req.user._id).select('-password');
      return res.json(user);
    } else {
      const user = getFallbackUserById(req.user._id);
      return res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, department, semester, bio, avatar } = req.body;

    if (getDbStatus()) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.name = name || user.name;
      user.department = department || user.department;
      if (semester) user.semester = Number(semester);
      if (bio !== undefined) user.bio = bio;
      if (avatar !== undefined) user.avatar = avatar;

      const updatedUser = await user.save();
      return res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        semester: updatedUser.semester,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        bookmarks: updatedUser.bookmarks,
      });
    } else {
      const user = getRawFallbackUserById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (name) user.name = name;
      if (department) user.department = department;
      if (semester) user.semester = Number(semester);
      if (bio !== undefined) user.bio = bio;
      if (avatar !== undefined) user.avatar = avatar;

      const { password, ...safeUser } = user;
      return res.json(safeUser);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
