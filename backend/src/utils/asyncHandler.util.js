export const catchAsync = (fn) => {
  return (req, res, next) => {
    // Nếu hàm fn chạy lỗi, nó sẽ tự động đẩy lỗi sang hàm next() để Global Error Handler bắt
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};
