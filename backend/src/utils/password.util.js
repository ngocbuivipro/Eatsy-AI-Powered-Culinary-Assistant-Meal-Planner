import bcrypt from "bcryptjs";

/**
 * Mã hóa mật khẩu nguyên gốc thành dạng hash
 * @param {string} password - Mật khẩu do user nhập
 * @returns {Promise<string>} Mật khẩu đã được mã hóa
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * So sánh mật khẩu user nhập và mật khẩu đã mã hóa trong Database
 * @param {string} enteredPassword - Mật khẩu do user gõ vào màn hình đăng nhập
 * @param {string} userPassword - Mật khẩu băm (hash) lưu trong Database
 * @returns {Promise<boolean>} Đúng (true) hoặc Sai (false)
 */
export const comparePassword = async (enteredPassword, userPassword) => {
  return await bcrypt.compare(enteredPassword, userPassword);
};
