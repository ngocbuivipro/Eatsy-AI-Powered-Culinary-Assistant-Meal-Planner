# Kế Hoạch 5 Ngày

**Trạng thái:** Các công việc khởi tạo ban đầu & thiết kế hạ tầng đã hoàn tất. Đã xây dựng bộ Base vững chãi để chiến đấu.
**Mục tiêu 5 ngày tới:** Hoàn thiện Hệ thống Đăng nhập Đa luồng (Local + Google/Apple), Xây dựng các nghiệp vụ Lõi (Pantry, Recipes) và hoàn thành Thuật toán Gợi ý Món ăn.

---

## ✅ ĐÃ HOÀN THÀNH
- **Hạ tầng**: Khởi tạo Server, kết nối MongoDB Atlas, phân rã Model hoàn chỉnh.
- **Common Utilities**: Hoàn thiện các common service dùng chung cơ bản (`jwt.util`, `password.util`, `asyncHandler`, `response.util`, `ApiError`).
- **Core Security (Task 4)**: Xây dựng xong Global Error Handler và Tường lửa xác thực người dùng (`auth.middleware.js`).
- **Authentication (Ngày 1)**: Đã hoàn tất 100% **Task 1 (Register), Task 2 (Login)** và **Task 3 (OAuth Google/Apple)**. Luồng Auth đa tầng đã khóa chặt thành công!

> ⚠️ **Lưu ý quan trọng cho Team:** 
> - Các API yêu cầu người dùng phải đăng nhập mới được thao tác (như Xem/Sửa Profile, Quản lý Tủ Lạnh Pantry) bắt buộc phải gắn middleware `protect` vào trước Controller.

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
  2. Phá băng xóa hết db cũ `await Recipe.deleteMany(); await Category.deleteMany()`.
  3. Gắn Data Mock thủ công (vài Category mẫu và Món ăn có kèm `spoonacularId`) và ấn lệnh `insertMany()` để dội thẳng Mongoose Cloud lấp đầy dữ liệu cơ bản.

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

### Task 10: AI Matching qua Spoonacular API (Recipe Matching Engine)
📍 **Vị trí thao tác:** Xoáy sâu vào `src/modules/recipe/recipe.controller.js`
- **Description:** 
  1. Gắp toàn tuyến mảng Đồ ăn: Bóc `items` của Pantry tuồn thành 1 Array chuỗi ID Nguyên liệu (`spoonacularId`).
  2. Bắn mảng này thẳng lên Endpoint API `findByIngredients` của Spoonacular. 
  3. Spoonacular sẽ tự động trả về list % Match và món ăn. Hứng list đó, trộn thêm một số Recipe Local nếu rảnh rỗi, và trả ngay cho Frontend qua `sendResponse()`. Cực kỳ nhàn hạ!

### Task 11: Lưu trữ Postman Collection & Clean Code
📍 **Vị trí thao tác:** Không gian chung toàn project
- **Description:** 
  1. Càn quét Search tính năng IDE để diệt mọi mớ rác mang tên `console.log()` mà quên xoá.
  2. Dump bản đồ giao tiếp Postman File JSON ném chung cất làm của hồi môn Frontend.
