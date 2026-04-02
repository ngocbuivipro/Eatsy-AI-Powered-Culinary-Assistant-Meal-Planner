import { verifyToken } from "../utils/jwt.util.js";
import { catchAsync } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import User from "../modules/user/user.model.js";

/**
 * Tường lửa (Middleware) xác thực người dùng
 * Chặn mọi Request không có Token hoặc Token bậy bạ
 */
export const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1. Kiểm tra xem Token có được đính kèm ở Headers không (Bearer Token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Cắt lấy phần token nằm sau chữ "Bearer "
    token = req.headers.authorization.split(" ")[1];
  }

  // Nếu không tìm thấy Token (Chưa đăng nhập) -> Ném lỗi 401
  if (!token) {
    throw new ApiError(401, "Bạn chưa đăng nhập! Vui lòng đăng nhập để truy cập.");
  }

  // 2. Bẻ khóa (Verify) token bằng util dùng chung
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    throw new ApiError(401, "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
  }

  // 3. Truy vấn User từ Database bằng ID nằm trong token sinh ra (Loại bỏ thuộc tính password ra cho an toàn)
  const currentUser = await User.findById(decoded.id).select("-password");

  if (!currentUser) {
    throw new ApiError(401, "Tài khoản của token này không còn tồn tại trên bản đồ.");
  }

  // 4. Cấp quyền đi tiếp. Nhét data user vào trong Request để các Controller phía sau thoải mái đem ra dùng
  req.user = currentUser;
  next();
});
