import { errorResponse } from '../utils/responseFormatter.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('[API Error]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return errorResponse(res, message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `A record with this ${field} already exists.`;
    return errorResponse(res, message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => val.message);
    return errorResponse(res, 'Validation Error', 400, errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid authentication token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Authentication token has expired', 401);
  }

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 'File size exceeds 5MB limit. Please upload a smaller PDF.', 400);
    }
    return errorResponse(res, err.message, 400);
  }

  const statusCode = error.statusCode || 500;
  return errorResponse(
    res,
    error.message || 'Internal Server Error',
    statusCode
  );
};
