/**
 * Kế thừa class Error mặc định để nhồi thêm mã HTTP (`statusCode`)
 * Giúp Global Error Handler có thể phản hồi lỗi chính xác.
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Đánh dấu đây là lỗi tính toán được, không phải do sập server

    Error.captureStackTrace(this, this.constructor);
  }
}
