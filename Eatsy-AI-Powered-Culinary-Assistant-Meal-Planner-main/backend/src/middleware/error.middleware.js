export const notFound = (req, res, next) => {
  const error = new Error(`KHÔNG TÌM THẤY API - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error); // Chuyển lỗi xuống cho errorHandler tổng
};

export const errorHandler = (err, req, res, next) => {
  // Lấy ra mã lỗi (mặc định 500 nếu hệ thống tự văng lỗi)
  const statusCode = err.statusCode || 500;
  
  // Thông điệp lỗi
  const message = err.message || "Lỗi cục bộ Server, vui lòng thử lại sau";

  // Trả về một chuẩn JSON chung cho toàn bộ dự án
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    // Chỉ hiển thị stack dẫn chứng khi đang phát triển (development), khi đẩy live (production) phải che đi
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
