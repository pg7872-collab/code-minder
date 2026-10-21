import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/responseFormatter.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => `${err.path}: ${err.msg}`);
    return errorResponse(res, 'Validation failed', 400, extractedErrors);
  }
  next();
};
