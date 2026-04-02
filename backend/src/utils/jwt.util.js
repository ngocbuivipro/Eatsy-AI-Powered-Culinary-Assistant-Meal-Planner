import jwt from "jsonwebtoken";

/**
 * Sinh chuỗi JWT Token
 * @param {Object} payload - Dữ liệu cần mã hóa (VD: { id: user._id })
 * @param {string} expiresIn - Thời gian sống của token (VD: "30d", "24h")
 * @returns {string} Chuỗi token
 */
export const generateToken = (payload, expiresIn = "30d") => {
  // Đảm bảo JWT_SECRET được cài đặt trong file .env
  const secret = process.env.JWT_SECRET || "eatsy_fallback_secret_key";
  
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });
};

/**
 * Giải mã và xác thực Token
 * @param {string} token - Chuỗi JWT client gửi lên
 * @returns {Object} Dữ liệu đã được giải mã (payload)
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || "eatsy_fallback_secret_key";
  return jwt.verify(token, secret);
};
