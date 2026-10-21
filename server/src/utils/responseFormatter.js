/**
 * Standard API response formatter for Code Minder
 */
export const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
};

export const paginatedResponse = (res, items = [], pagination = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: items,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || items.length,
      totalPages: pagination.totalPages || Math.ceil((pagination.total || items.length) / (pagination.limit || 10)),
    },
  });
};
