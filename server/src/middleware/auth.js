import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config/env.js';
import { errorResponse } from '../utils/responseFormatter.js';

export const protect = async (req, res, next) => {
  let token = null;

  // 1. Check HTTP-only cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check Authorization Bearer header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Not authorized to access this route. Please log in.', 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return errorResponse(res, 'The user belonging to this token no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, 'Invalid or expired session token. Please log in again.', 401);
  }
};
