import User from "./user.model.js";
import { catchAsync } from "../../utils/asyncHandler.util.js";
import { sendResponse } from "../../utils/response.util.js";
import { ApiError } from "../../utils/ApiError.util.js";
import { generateToken } from "../../utils/jwt.util.js";
import { hashPassword, comparePassword } from "../../utils/password.util.js";

// [Task 1] Đăng ký truyền thống
export const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    throw new ApiError(400, "Vui lòng nhập đầy đủ tên, email và mật khẩu");
  }

  // Kiểm tra email đã tồn tại hay chưa
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "Email này đã được đăng ký, vui lòng dùng email khác");
  }

  // Mã hóa mật khẩu
  const hashedPassword = await hashPassword(password);

  // Tạo tài khoản
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    authProvider: "local",
  });

  // Tự động cấp Token giúp văng thẳng vào bên trong màn hình Home
  const token = generateToken({ id: user._id });

  // Trả về Frontend (ko trả ra trường password)
  user.password = undefined;

  return sendResponse(res, 201, "Đăng ký tải khoản thành công", { user, token });
});

// [Task 2] Đăng nhập truyền thống
export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Vui lòng nhập email và mật khẩu");
  }

  // Tìm user và phải nạy thêm móc .select("+password") vì Model mặc định giấu nó đi
  const user = await User.findOne({ email }).select("+password");

  // So pass
  if (!user || !(await comparePassword(password, user.password))) {
    throw new ApiError(401, "Sai email hoặc tài khoản, vui lòng thử lại");
  }

  // Cấp Token
  const token = generateToken({ id: user._id });

  // Giấu lại pass trước khi gửi về màn hình
  user.password = undefined; 

  return sendResponse(res, 200, "Đăng nhập thành công", { user, token });
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
