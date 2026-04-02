import User from "./user.model.js";
import { catchAsync } from "../../utils/asyncHandler.util.js";
import { sendResponse } from "../../utils/response.util.js";
import { ApiError } from "../../utils/ApiError.util.js";
import { generateToken } from "../../utils/jwt.util.js";
import { hashPassword, comparePassword } from "../../utils/password.util.js";

// [Task 1] Đăng ký truyền thống
export const registerUser = catchAsync(async (req, res, next) => {
  // Bạn sẽ hoàn thiện code logic ở đây sau
  res.send("Chức năng Register");
});

// [Task 2] Đăng nhập truyền thống
export const loginUser = catchAsync(async (req, res, next) => {
  // Bạn sẽ hoàn thiện code logic ở đây sau
  res.send("Chức năng Login");
});

// [Task 3] Đăng nhập OAuth (Google/Apple) - Tiền trạm
export const oauthLogin = catchAsync(async (req, res, next) => {
  const { email, name, providerId, authProvider, avatarUrl } = req.body;

  // 1. Kiểm tra thiếu dữ liệu đầu vào không
  if (!email || !providerId || !authProvider) {
    throw new ApiError(400, "Thiếu thông tin cần thiết từ Google/Apple");
  }

  // 2. Tra cứu khách hàng cũ
  let user = await User.findOne({ email });

  if (user) {
    // Nếu trước đây User đăng ký bằng Email/Password, nay xài Google -> Cập nhật Google ID vào hồ sơ cũ
    if (authProvider === "google" && !user.googleId) {
      user.googleId = providerId;
      await user.save();
    }
    // Tương tự cho Apple
    if (authProvider === "apple" && !user.appleId) {
      user.appleId = providerId;
      await user.save();
    }
  } else {
    // 3. Khách hàng mới tinh -> Đăng ký tự động không cần Mật khẩu
    user = await User.create({
      email: email,
      name: name,
      authProvider: authProvider,
      googleId: authProvider === "google" ? providerId : undefined,
      appleId: authProvider === "apple" ? providerId : undefined,
      avatarUrl: avatarUrl || "",
    });
  }

  // 4. Sinh JWT Token để cấp visa vào các App khác
  // (ID nằm trong thư mục user._id của Mongo)
  const token = generateToken({ id: user._id });

  // 5. Trả về kết quả chuyên nghiệp
  return sendResponse(res, 200, "Đăng nhập OAuth thành công!", { 
    user, 
    token 
  });
});
