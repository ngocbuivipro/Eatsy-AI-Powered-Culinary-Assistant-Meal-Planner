# Kế Hoạch 5 Ngày (Sprint 1) - Phát Triển Tuyến Tính Backend Eatsy
*(Bản cập nhật v2.0 - Phục vụ Coder Beginner / Sinh viên "vibecode")*

**Tình hình hiện tại:** Nhóm 3 người. Database Model đã được thiết kế chuẩn chỉ.
**Trạng thái:** Các công việc khởi tạo ban đầu & thiết kế hạ tầng đã hoàn tất (Server, MongoDB Atlas, Git Workflow, Global Error Handler, cập nhật DB hỗ trợ OAuth 2.0).
**Mục tiêu 5 ngày tới:** Hoàn thiện Hệ thống Đăng nhập Đa luồng (Local + Google/Apple), Xây dựng các nghiệp vụ Lõi (Pantry, Recipes) và hoàn thành Thuật toán Gợi ý Món ăn.

---

## 👥 Ý tưởng Phân Công (Roles)
Để 3 người không đạp code lên nhau bị Conflict trên Git, chia nhánh như sau:
* **👨‍💻 Dev A (Cơ sở hạ tầng & Hệ thống):** Chuyên làm các luồng OAuth, Middleware (gác cổng phân quyền API).
* **🕵️‍♂️ Dev B (Bảo mật/User):** Chuyên thiết kế luồng Đăng ký/Đăng nhập Email, băm mật khẩu, JWT Token và Cập nhật hồ sơ User.
* **🍳 Dev C (Nghiệp vụ Món ăn):** Chuyên môn tạo dữ liệu Fake (Seeding), Tủ lạnh (Pantry), CRUD công thức và xây thuật toán truy vấn.

---

## ✅ TRƯỚC SPRINT: ĐÃ HOÀN THÀNH TỐT
- Khởi tạo Server (`app.js`, `server.js`).
- Kết nối MongoDB Atlas.
- Xây dựng Global Error Handler (`error.middleware.js`).
- Phân rã Model hoàn chỉnh, sẵn sàng đón API.

---

## 🗓️ 1. Ngày 1: Bảo Mật Cửa Ngõ & Xác Thực Đa Tầng (Auth)

### Task 1: API Đăng ký tài khoản truyền thống (Register)
- **Description:** 
  1. Tạo file `src/modules/user/user.controller.js` và `src/modules/user/user.routes.js`.
  2. Viết hàm `registerUser`. Lấy `name, email, password` từ `req.body`.
  3. **Rất quan trọng:** Vì Schema đã thả cửa Password, bắt buộc thêm dòng `if(!password) throw new Error("Vui lòng nhập mật khẩu")` để chặn đầu.
  4. Dùng lệnh `User.findOne({ email })` kiểm tra trùng. Nếu bị trùng, văng lỗi 400.
  5. Cài gói `bcryptjs`. Dùng `bcrypt.hashSync(password, 10)` để mã hóa mật khẩu.
  6. Dùng `User.create(...)` tạo User (lưu pass mã hóa, KHÔNG lưu pass gốc).
- **Deliverable:** Mở Postman, gọi `POST /api/users/register` với body chuẩn. Kết quả sẽ hiện HTTP Code `201 Created` và trả về thông tin User (tuyệt đối không lộ mật khẩu ra JSON). Lên bản web MongoDB Atlas check sẽ thấy pass bị quậy nát (mã hoá).

### Task 2: API Đăng nhập truyền thống (Login)
- **Description:** 
  1. Viết hàm `loginUser` ở file controller lấy `email` và `password`.
  2. Dùng lệnh `User.findOne({ email }).select('+password')`. (Phải thêm `.select('+password')` vì Model đã thiết lập ẩn thuộc tính này).
  3. Nếu tìm không ra email hoặc `bcrypt.compareSync(password, user.password)` trả về `false` -> quăng lỗi `401 Unauthorized` ("Sai tài khoản hoặc mật khẩu").
  4. Cài gói `jsonwebtoken`. Gọi `jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })` để lấy chuỗi Token.
- **Deliverable:** Dùng Postman test `POST /api/users/login`. Nếu đúng pass -> Server phải trả về HTTP Code `200` kèm JSON rực rỡ gồm `user` info và MỘT CHUỖI `token: "eyJhbG.."` dài ngoằng.

### Task 3: API Đăng nhập bên thứ 3 (Google/Apple) - Tiền trạm
- **Description:** 
  1. Frontend sau khi User bấm login Google sẽ nạp xuống Backend các thứ: `email, name, authProvider, providerId` (providerId là googleId/appleId tuỳ loại).
  2. Tại hàm `oauthLogin`, tìm `User.findOne({ email })`.
  3. NẾU USER CÓ SẴN (Đã log in lúc trước bằng Email/Pass): Cập nhật thẳng `googleId = providerId` vào Document cũ. Sinh JWT Token như Task 2.
  4. NẾU BỘ NHỚ TRỐNG (Lần đầu xuất hiện): Dùng `User.create({ name, email, authProvider, googleId: providerId })`. **Bỏ qua password. Không hash pass!**. Sau đó sinh JWT Token.
- **Deliverable:** Postman test bắn giả một JSON chứa thông tin vào `POST /api/users/oauth`. DB tự động sinh ra User mà không cần Password, Token lấy về bẻ khoá ra vẫn khớp ID User.

---

## 🗓️ 2. Ngày 2: Tường Lửa & Hồ Sơ Cá Nhân (Profile & Middleware)

### Task 4: Tường Lửa API Bằng Token (Auth Middleware)
- **Description:** 
  1. Điểm sinh tử đây! Tạo file `src/middleware/auth.middleware.js` chứa hàm `protect(req, res, next)`.
  2. Quét biến `req.headers.authorization`. Nếu có nó, và nó bắt đầu bằng chữ `"Bearer "`, ta sẽ cắt lấy Token ở phía sau bằng `split(' ')[1]`. Nếu không có ➡️ Văng lỗi 401.
  3. Trích xuất ID bên trong Token mã hoá: Dùng `jwt.verify(token, process.env.JWT_SECRET)`.
  4. Tra cứu User bằng `User.findById(decoded.id).select('-password')`. Nếu tìm thấy, gán mẹo vào Request: `req.user = user`, cuối cùng gọi `next()` để đi tiếp.
- **Deliverable:** Viết route GET bất kỳ có nhét đệm hàm `protect` vào giữa. Dùng Postman test KHÔNG truyền Authorization Header -> Bị chặn gắt. NẾU tryền Header Bearer <Token Task 2> -> Vượt qua thành công.

### Task 5: API Get & Update Profile (Cá nhân hoá)
- **Description:** 
  1. Viết API `GET /api/users/profile`. Cái này siêu dễ, tại vì Task 4 có hàm `protect` nằm trên rồi đã gài sẵn biến `req.user` vào. Bạn chỉ việc `res.json(req.user)` là xong.
  2. Viết API cập nhật `PUT /api/users/profile`. Nhận body: `dietaryPreferences`, `healthGoals`, `avatarUrl`.
  3. Dùng `User.findByIdAndUpdate(req.user._id, req.body, { new: true })` để lưu lại DB. Văng lỗi 400 nếu truyền Type sai trong Object rễ.
- **Deliverable:** Mở Postman, Header đính Token. Bắn body JSON tuỳ biến sửa "Chế độ ăn kiêng (Vegan)" và "Muốn Giảm Cân". DB Atlas đổi đúng chuẩn Schema mà không bị mất các trường còn lại (Như email, pass).

---

## 🗓️ 3. Ngày 3: Bồi Đắp Dữ Liệu & Danh Mục (Seeding & Categories)

### Task 6: API Danh Mục Thực Phẩm / Tiêu Chuẩn (Categories)
- **Description:** 
  1. Code folder `category` y hệt MVC của User.
  2. Viết hàm `GET /api/categories`.
  3. Dùng lệnh Query kéo rèm: `Category.find({ isActive: true }).sort({ sortOrder: 1 })`. Lệnh này lấy ra toàn bộ loại món ăn đã xếp sẵn thứ tự ưu tiên.
- **Deliverable:** Gọi `GET /api/categories` bằng Postman. Kết quả được cái mảng mượt mà chứa ID, Name, ImageUrl. (Tạo 1 api POST thủ công chạy trên Postman để Dev C tự thêm 3 category đầu tiên: Món Việt, Ăn chay, Phở).

### Task 7: "Ngòi Nổ" Dữ Liệu Fake (Seeding DB)
- **Description:** 
  1. App không thể test khi DB rỗng. Viết Script `backend/seeder.js` găm ở ngoài.
  2. Xóa sạch DB cũ `await Ingredient.deleteMany(); await Recipe.deleteMany()`.
  3. Bơm vào mảng 20 nguyên liệu thông dụng nhất thị trường (muối, đường, trứng, cà chua, thịt bò).
  4. Lấy cái `_id` nguyên liệu trứng với thịt ném vào 3-4 bài Công thức chuẩn rồi `Recipe.insertMany()`.
- **Deliverable:** Gõ `node seeder.js` vào terminal, log nháy chữ màu mè báo "Data Imported Successfully!". Lên trang Atlas load phát thấy DB ngập tràn data cơm thịt chuẩn chỉnh để làm mồi nấu thuật toán.

---

## 🗓️ 4. Ngày 4: Trái Tim Vận Hành (Công Thức & Tủ Lạnh)

### Task 8: API Tủ Lạnh "Pantry"
- **Description:** 
  1. Cái tủ lạnh Pantry chỉ có 1 với một user (`unique` userId).
  2. `GET /api/pantry`: Phải lùi qua rào cản middleware `protect`. Sau đó `Pantry.findOne({ userId: req.user._id })`. Nếu lấy null (User mới đăng ký chưa có Tủ) -> Tự tạo tủ mới rỗng cho họ.
  3. `POST /api/pantry`: Đẩy dữ liệu Body (id_nguyen_lieu, so_luong). Dùng cách PUSH phần tử mảng vào Array `items` của Pantry.
  4. `DELETE /api/pantry/:itemId`: Dùng `$pull` trong Mongoose gắp cục đồ ra khỏi mảng khi user nấu ❌ xong xoá tủ.
- **Deliverable:** Dùng postman cất thử cục "Thịt Lợn 500g" lấy từ Task 7 vào Tủ Lạnh 10B. Sau khi check API GET thì thấy mảng items dài lên với đúng con số 500g.

### Task 9: API Tạo Công Thức Mới Của User (Create Recipe)
- **Description:** 
  1. Viết `POST /api/recipes/` có kẹp `protect()`.
  2. Yêu cầu truyền nguyên Body rất bự chuẩn Schema Recipe (`title`, `description`, mảng `steps`, mảng `ingredients`).
  3. Ép kiểu `author: req.user._id` (Gián điệp lấy từ Middleware, user không thể giả mạo thằng khác post nhờ).
  4. `Recipe.create(req.body)`.
- **Deliverable:** Dùng Postman đẩy thẳng 1 recipe fake. LÊN ATLAS CLICK VÀO LỖI NẾU BÁO LỖI (Vd: Validate Mongoose "Thiếu Title"). Thành công ghi được record vào DB Atlas.

---

## 🗓️ 5. Ngày 5: Trí Khôn Của App & Gom Báo Cáo Thành Tích

### Task 10: Thuật Toán AI Phổ Thông Tìm Món (Recipe Matching Engine)
- **Description:** 
  1. Viết route khủng nhất `GET /api/recipes/matcher`.
  2. Gọi DB tủ lạnh: `pantry = Pantry.findOne({ userId: req.user._id })`. Móc mảng `pantry.items` thành một Array chứa rặt `ID_Nguyên_Liệu`.
  3. Bơm vào hàm Query tìm kiếm bá vương: `Recipe.find({ ingredient_ids: { $in: mang_id_nguyen_lieu_cua_tu_lanh } })` ➡️ Cú pháp này Mongoose tự đi cào ra thằng Gà nào có chung id nguyên liệu.
  4. CAO CẤP HƠN: Chạy vòng lặp Array Javascript đếm số điểm khớp. Nếu Recipe có 5 đồ mà Tủ ăn có 2 đồ -> Tính tỷ lệ được `40% Match`. Xếp món dễ làm nhất `order By Match DESC` ném lên Top 1 cho User thấy!
- **Deliverable:** Tủ lạnh đang có 3 món là Cơm, Trứng, Hành. Đẩy API Postman chạy vùn vụt trả về Top 1 "Cơm chiên Trứng" với thuộc tính Match = 100%, Top 2 Món "Cơm Thịt Trứng" Match = 66%. Đạt Trình Gà Coding Master.

### Task 11: Lưu trữ Postman Collection & Clean Code
- **Description:** 
  1. Sửa hết các console.log rác rưởi.
  2. Chuột phải vào Folder làm việc trên Postman Export ra file `Eatsy_Backend.json`. Quăng thẳng vào Github gốc.
  3. Mở file `README.md` lên cập nhật hướng dẫn cách chạy lệnh `npm install`, thay `MONGO_URI`.
- **Deliverable:** Bạn cùng nhóm tải Code từ GitHub về nhắm mắt cũng khởi chạy và trỏ API được êm đềm không quăng Error lạ, sẵn sàng nối Frontend vô và đi Liên Hoan! 🍻
