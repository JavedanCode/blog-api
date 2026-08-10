export function errorHandler(error, req, res, next) {
  console.error(error);

  const statusCode = error.statusCode || 500;

  const response = {
    message: statusCode === 500 ? "Internal server error." : error.message,
  };

  if (process.env.NODE_ENV === "development") {
    response.error = error.message;
  }

  return res.status(statusCode).json(response);
}
