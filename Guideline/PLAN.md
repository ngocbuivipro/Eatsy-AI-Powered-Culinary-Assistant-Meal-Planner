# Kế Hoạch 5 Ngày

**Trạng thái:** Các công việc khởi tạo ban đầu & thiết kế hạ tầng đã hoàn tất. Đã xây dựng bộ Base vững chãi để chiến đấu.
**Mục tiêu 5 ngày tới:** Hoàn thiện Hệ thống Đăng nhập Đa luồng (Local + Google/Apple), Xây dựng các nghiệp vụ Lõi (Pantry, Recipes) và hoàn thành Thuật toán Gợi ý Món ăn.

---

## ✅ ĐÃ HOÀN THÀNH
- **Hạ tầng**: Khởi tạo Server, kết nối MongoDB Atlas, phân rã Model hoàn chỉnh.
- **Common Utilities**: Hoàn thiện các common service dùng chung cơ bản (`jwt.util`, `password.util`, `asyncHandler`, `response.util`, `ApiError`).
- **Core Security (Task 4)**: Xây dựng xong Global Error Handler và Tường lửa xác thực người dùng (`auth.middleware.js`).

> ⚠️ **Lưu ý quan trọng cho Team:** 
> - Ai làm tính năng Đăng ký/Đăng nhập bắt buộc gọi hàm từ `src/utils`. Không nhúng code thư viện trực tiếp vào Controller.
> - Các API yêu cầu người dùng phải đăng nhập mới được thao tác (như Xem/Sửa Profile, Quản lý Tủ Lạnh Pantry) bắt buộc phải gắn middleware `protect` vào trước Controller.

---

## 🗓️ 1. Ngày 1: Bảo Mật & Xác Thực Đa Tầng (Auth)

### Task 1: API Đăng ký tài khoản truyền thống (Register)
📍 **Vị trí thao tác:** `src/modules/user/user.controller.js` và `user.routes.js`
- **Description:** 
  1. Viết hàm `registerUser` **bọc trong `catchAsync`**. Lấy `name, email, password` từ `req.body`.
  2. Bắt buộc thêm kiểm tra: `if(!password) throw new ApiError(400, "Vui lòng nhập mật khẩu")`.
  3. Dùng `User.findOne({ email })`. Nếu bị trùng, ném lỗi: `throw new ApiError(400, "Email đã tồn tại")`.
  4. Mã hóa mật khẩu: Dùng hàm `hashPassword(password)` (import từ `password.util.js`).
  5. Gọi `User.create(...)` tạo User. Cuối cùng trả về json bằng hàm đặc quyền `sendResponse(res, 201, "Đăng ký thành công", user)`.

### Task 2: API Đăng nhập truyền thống (Login)
📍 **Vị trí thao tác:** `src/modules/user/user.controller.js` và `user.routes.js`
- **Description:** 
  1. Viết hàm `loginUser` bọc bằng `catchAsync`. Lấy `email` và `password`.
  2. Truy vấn Database bắt buộc đính đuôi: `User.findOne({ email }).select('+password')`.
  3. Dùng `comparePassword` (từ `password.util.js`) rà soát. Nếu sai -> `throw new ApiError(401, "Sai tài khoản hoặc mật khẩu")`.
  4. Cấp thẻ vào cửa: Gọi hàm `generateToken({ id: user._id })` từ `jwt.util.js`.
  5. Trả kết quả xịn: `sendResponse(res, 200, "Đăng nhập thành công", { user, token })`.

### Task 3: API Đăng nhập bên thứ 3 (Google/Apple) - Tiền trạm
📍 **Vị trí thao tác:** `src/modules/user/user.controller.js` và `user.routes.js`
- **Description:** 
  1. Viết hàm `oauthLogin` bọc bằng `catchAsync`. Frontend nạp xuống API body: `email, name, authProvider, providerId, avatarUrl`.
  2. Tìm tìm khách cũ `User.findOne({ email })`. Nếu khách có sẵn, cập nhật `googleId/appleId = providerId`.
  3. Nếu trống rỗng (kết quả null): `User.create({ email, name, authProvider, googleId: providerId })` (**Tuyệt đối không mã hoá pass**).
  4. Chốt sổ: Gọi chung 1 lệnh `generateToken()` và bắn trả JSON qua `sendResponse()`.

---

## 🗓️ 2. Ngày 2: Hồ Sơ Người Dùng (User Profile)

*(Ghi chú: Task 4 - Auth Middleware đã được hoàn thành. Vui lòng sử dụng hàm `protect` cho các Task tiếp theo)*

### Task 5: API Get & Update Profile (Cá nhân hoá)
📍 **Vị trí thao tác:** `src/modules/user/user.controller.js` và `user.routes.js`
- **Description:** 
  1. Viết `GET /api/users/profile`. Trong Routes phải nhét thủ tục `protect`. Controller chỉ việc xả lời chào `sendResponse(res, 200, "OK", req.user)`.
  2. Viết `PUT /api/users/profile` kẹp `protect`. Nhận body mớ thông tin.
  3. Lưu lại bằng `User.findByIdAndUpdate`. Mọi lỗi vặt sẽ bị file `catchAsync` ném văng vào nhà kho Global Error, không cần `try/catch`.

---

## 🗓️ 3. Ngày 3: Bồi Đắp Dữ Liệu & Danh Mục (Seeding)

### Task 6: API Danh Mục Thực Phẩm / Tiêu Chuẩn (Categories)
📍 **Vị trí thao tác:** Mở riêng nhánh code vào `src/modules/category/`
- **Description:** 
  1. Viết hàm `getCategories` bọc bằng `catchAsync`.
  2. Kéo rèm Data: `Category.find({ isActive: true }).sort({ sortOrder: 1 })`.
  3. Điểm cuối: `sendResponse(res, 200, "Thành công", categories)`.

### Task 7: Seeding DB
📍 **Vị trí thao tác:** Thẳng ở đường ngõ `backend/seeder.js` (Chạy bằng lệnh `node seeder`)
- **Description:** 
  1. Setup Script kết nối qua Mongo Atlas .
  2. Phá băng xóa hết db cũ `await Ingredient.deleteMany(); await Recipe.deleteMany()`.
  3. Gắn Data tĩnh vào Mảng (Trứng, Hành, Mắm) và ấn lệnh `insertMany()` để dội thẳng Mongoose Cloud lấp đầy dữ liệu.

---

## 🗓️ 4. Ngày 4: Công Thức & Tủ Lạnh Nhỏ (Pantry)

### Task 8: API Tủ Lạnh "Pantry"
📍 **Vị trí thao tác:** Code tại `src/modules/pantry/`
- **Description:** 
  1. `GET /api/pantry`: Đặt mìn xác thực `protect`. Bơm vào lệnh query kiếm tủ. Lấy về `null` -> Tự đẻ 1 tủ mới rỗng tuếch.
  2. `POST /api/pantry`: Nạp Body bằng thuật toán `$push` của Mongoose để đẩy mảng. Kết quả lụm được đem về bọc `sendResponse`.
  3. `DELETE /api/pantry/:itemId`: Đập nguyên liệu rơi ra ngoài tủ rỗng qua `$pull`. 

### Task 9: API Tạo Công Thức Mới Của User (Create Recipe)
📍 **Vị trí thao tác:** Làm sạch gọn mảng `src/modules/recipe/`
- **Description:** 
  1. Khai sinh Route `POST /api/recipes/` có kẹp vòng cung `protect()`.
  2. Ép chèn `req.body.author = req.user._id` (Data thám xuất từ Auth, không cho User sài ID fake).
  3. Mượt mà đẩy `Recipe.create(req.body)` vọt về frontend qua `sendResponse`.

---

## 🗓️ 5. Ngày 5: Trí Khôn Của App & Gom Báo Cáo Thành Tích

### Task 10: Thuật Toán AI Phổ Thông Tìm Món (Recipe Matching Engine)
📍 **Vị trí thao tác:** Xoáy sâu vào `src/modules/recipe/recipe.controller.js`
- **Description:** 
  1. Gắp toàn tuyến mảng Đồ ăn: Bóc `items` của Pantry tuồn thành 1 Array đút ruột ID Nguyên liệu.
  2. Tích hợp lệnh `Recipe.find({ ingredient_ids: { $in: mang_id_cua_tu_lanh } })`.
  3. Quét vòng lặp Array JS để đong đếm mức độ Giao Nhau (Intersection). Tính toán % Match xếp hạng (Sort DESC) ra mâm và bê ra qua `sendResponse()`.

### Task 11: Lưu trữ Postman Collection & Clean Code
📍 **Vị trí thao tác:** Không gian chung toàn project
- **Description:** 
  1. Càn quét Search tính năng IDE để diệt mọi mớ rác mang tên `console.log()` mà quên xoá.
  2. Dump bản đồ giao tiếp Postman File JSON ném chung cất làm của hồi môn Frontend.
