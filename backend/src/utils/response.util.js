/**
 * Hàm chuẩn hóa mọi định dạng trả về JSON khi API thành công
 * @param {Object} res - Express response object
 * @param {number} statusCode - Mã trạng thái HTTP (200, 201)
 * @param {string} message - Câu thông báo thành công
 * @param {Object} data - Dữ liệu muốn trả về (Nếu có)
 */
export const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    status: "success",
    message: message,
    ...(data && { data }), // Nếu có data truyền vào thì mới nhét key data vào json
  });
};
