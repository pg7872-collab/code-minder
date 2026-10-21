import { User } from '../models/User.js';
import { successResponse, errorResponse } from '../utils/responseFormatter.js';

// Cookie helper
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = user.getSignedJwtToken();

  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
  };

  res.cookie('token', token, cookieOptions);

  // Exclude password from returned user object
  const userObj = user.toObject();
  delete userObj.password;

  return res.status(statusCode).json({
    success: true,
    message,
    token, // Also return token for clients using Authorization header
    data: {
      user: userObj,
    },
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, targetRole, college, graduationYear } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 'Please provide name, email, and password.', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters long.', 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return errorResponse(res, 'An account with this email address already exists.', 400);
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      targetRole: targetRole || 'Software Development Engineer',
      college: college ? college.trim() : '',
      graduationYear: graduationYear ? Number(graduationYear) : null,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name.trim())}`,
    });

    return sendTokenResponse(user, 201, res, 'Registration successful. Welcome to Code Minder!');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Log in user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Please provide an email and password.', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    return sendTokenResponse(user, 200, res, 'Login successful.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Log out user & clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    });
    return successResponse(res, null, 'Logged out successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get currently logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    return successResponse(res, { user }, 'User profile retrieved.');
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, college, graduationYear, targetRole } = req.body;

    const fieldsToUpdate = {};
    if (name !== undefined) fieldsToUpdate.name = name.trim();
    if (avatar !== undefined) fieldsToUpdate.avatar = avatar;
    if (college !== undefined) fieldsToUpdate.college = college.trim();
    if (graduationYear !== undefined) fieldsToUpdate.graduationYear = graduationYear ? Number(graduationYear) : null;
    if (targetRole !== undefined) fieldsToUpdate.targetRole = targetRole;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, { user: updatedUser }, 'Profile updated successfully.');
  } catch (err) {
    next(err);
  }
};
