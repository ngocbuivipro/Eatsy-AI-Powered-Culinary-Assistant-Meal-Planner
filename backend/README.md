# 🍽️ Eatsy Backend API - Cấu Trúc Dự Án

Tài liệu này là "bản đồ" siêu chuẩn giúp mọi thành viên trong nhóm hiểu rõ cách bố trí thư mục và viết code không bị "đụng hàng" (Conflict) nhau.

## 📁 Sơ Đồ Hạ Tầng Tổng Quan

```text
eatsy-backend/
├── src/
│   ├── config/              ← Các file cấu hình kết nối Database (MongoDB)
│   ├── middleware/          ← Các "tường lửa" chắn ngang Request (Auth, Error)
│   ├── modules/             ← Nơi chứa code nghiệp vụ chính (chia theo từng tính năng)
│   ├── utils/               ← Các "đồ nghề" dùng chung (Mã hóa, bọc lỗi, sinh Token)
│   ├── app.js               ← Khởi tạo Express, gập nối routes & middlewares
│   └── server.js            ← Điểm khởi chạy (listen port & kết nối Database)
├── .env                     ← File chứa biến môi trường (Tuyệt đối KHÔNG push Github)
└── package.json             ← Quản lý thư viện và script chạy app
```

---

## 🛠 Bộ Công Cụ Dùng Chung (`src/utils/`)

Đây là "kho báu" mà **Lead đã cấu hình sẵn**. Tất cả các Dev khi code bắt buộc phải lấy các đồ nghề này ra xài, **KHÔNG** tự viết lại thư viện gốc vào cụm Controller:

- `jwt.util.js`: Hàm `generateToken` và `verifyToken` dùng để cấp vé và bẻ khóa.
- `password.util.js`: Hàm `hashPassword` và `comparePassword` (mã hóa bcrypt).
- `asyncHandler.util.js`: Cung cấp hàm `catchAsync`. **Bắt buộc bọc cái này ngoài mọi hàm controller** để không ai phải viết `try { ... } catch()` thủ công nữa.
- `response.util.js`: Cung cấp hàm `sendResponse` để chuẩn hóa 100% định dạng JSON trả về cho Frontend.
- `ApiError.util.js`: Khi check mật khẩu sai, trùng email... dùng cấu trúc `throw new ApiError(HTTP_CODE, "Thông báo")` để quăng lỗi chuyên nghiệp.

---

## 🛡 Tường Lửa (`src/middleware/`)

- `auth.middleware.js`: Cung cấp hàm chặn `protect`. Ai làm tính năng yêu cầu bảo mật cao (Thêm/Sửa Tủ Lạnh, Tạo Công Thức, Cập nhật Profile), bắt buộc gắn `protect` vào cấu trúc Route để bắt User đưa Bearer Token.
- `error.middleware.js`: Nới tự động đón hứng bất cứ lỗi nào từ `ApiError` văng ra và gửi thẳng xuống Frontend thành JSON đẹp đẽ.

---

## 🔷 Vùng Code Nghiệp Vụ (`src/modules/`)

Chúng ta áp dụng cấu trúc **Feature-based MVC cơ bản**. Mỗi folder ở đây tương ứng với 1 bảng dữ liệu lớn, ví dụ `user/`, `pantry/`, `recipe/`.

Khi làm một Task (như Task 1: API Đăng ký), một module thông thường chỉ duy trì **3 FILE CỐT LÕI**:

```text
modules/user/
├── user.route.js          ← Điều hướng mũi tên. Nhận (POST /register) và trỏ tới hàm tương ứng.
├── user.controller.js     ← Bộ não trung tâm: Lấy dữ liệu từ User, kiểm tra logic, lưu Database và gọi gửi JSON trả về.
└── user.model.js          ← Nơi định nghĩa bảng (Schema) MongoDB của Mongoose.
```

*(Lưu ý: Không tự ý phân nhỏ vẽ rắn thêm chân tạo các lớp quá sâu như Services, Repositories... trừ khi tính năng đó là siêu Thuật Toán AI cần băm nhỏ logic và đã được sự đồng ý của Lead).*

---

## 📐 Luồng Dữ Liệu Minh Họa

Hãy ghi nhớ vòng khép kín này khi một API được gọi lên Server của chúng ta:

1. **Frontend Gọi (Request)**: Gửi lên đống data bằng JSON.
2. **Router (`.route.js`)**: Phát hiện đường dẫn -> Đẩy người gửi qua bưu điện kế tiếp.
3. **Middleware (`.middleware.js`)**: Nếu Route yêu cầu có `protect`, bảo vệ sẽ kiểm tra Vé (Token). Không có vé -> Văng `ApiError(401)`.
4. **Controller (`.controller.js`)**:
   - Nhận mớ dữ liệu `req.body`
   - Quăng lỗi nếu email trống (`throw new ApiError(...)`)
   - Lưu Data xuống Mongo thông qua `Model`
   - Trả hàng lại cho FE thông qua `sendResponse(...)`
5. **Database (MongoDB)**: Mỉm cười cất thông tin vào ngăn kéo.
