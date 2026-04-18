export const notFound = (req, res, next) => {
  const error = new Error(`API NOT FOUND - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error, please try again later";

  // Log lỗi ra console để debug (Lead Architect standard)
  console.error(`❌ [Error Handler]: ${err.stack || message}`);

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
