# 🍽️ Eatsy Backend API

Backend API cho ứng dụng Trợ lý ẩm thực thông minh Eatsy. Server được xây dựng bằng **Node.js, Express, MongoDB (Mongoose)** và tuân thủ chặt chẽ kiến trúc phân tách theo tính năng (Feature-based Modular Architecture) lấy cảm hứng từ Domain-Driven Design (DDD).

Backend được thiết kế để đồng nhất 1:1 với các module nghiệp vụ ở trên Frontend (React Native).

---

## 📁 Cấu Trúc Dự Án & Nhiệm Vụ Từng Thư Mục

```text
eatsy-backend/
├── src/
│   ├── config/              ← Móc nối hạ tầng (DB config, bên thứ 3)
│   ├── middleware/          ← Các tầng kiểm duyệt (global middleware)
│   ├── modules/             ← Các module nghiệp vụ theo Domain
│   ├── shared/              ← Các utilities, helper dùng chung
│   ├── app.js               ← Khởi tạo Express, gập nối routes & middlewares
│   └── server.js            ← Điểm khởi chạy (listen port & kết nối Database)
├── .env                     ← (Chưa push) File chứa biến môi trường an toàn
└── package.json             ← Quản lý thư viện và câu lệnh start/dev
```

---

## 🔷 Các File Gốc (Root)

| File                 | Nhiệm vụ                                                                                            |
|----------------------|-----------------------------------------------------------------------------------------------------| 
| `server.js`          | Tệp điểm nút để khởi chạy (entry point). Nhiệm vụ duy nhất là gọi `connectDB()` và chạy `app.listen()`. |
| `app.js`             | Khởi tạo pipeline Express, cấu hình CORS, morgan (log requests), và tổng hợp tất cả các Router từ `modules/`. |
| `.env`               | Biến môi trường (PORT, MONGO_URI, JWT_SECRET, OPENAI_API_KEY). |

---

## 🔷 `src/config/` & `src/middleware/` — Bộ Máy Hạ Tầng

| Thư mục/File     | Nhiệm vụ |
|------------------|----------|  
| `config/`        | Chỉ chứa cấu hình hệ thống hoặc kết nối bên ngoài (ví dụ `db.js` cho MongoDB kết nối, cấu hình Redis, v.v.). **Tuyệt đối không có logic nghiệp vụ**. |
| `middleware/`    | Logic can thiệp vào request toàn cục. Ví dụ: `auth.middleware.js` (xác thực token), `error.middleware.js` (xử lý lỗi chung). |

---

## 🔷 `src/modules/` — Các Module Nghiệp Vụ

Mỗi folder ở đây đảm nhiệm một **Miền (Domain) duy nhất**, hoàn toàn độc lập và phản chiếu 100% với Frontend của bạn. Sự cô lập này giúp sửa lỗi và mở rộng dự án mà không sợ hỏng code chỗ khác.

### Tổng quan các Module tương ứng

| Module | Mục đích |
|--------|----------|
| `discovery/` | Lấy dữ liệu danh sách thịnh hành, phân trang công thức. |
| `recipe/` | Cung cấp chi tiết công thức, lưu trữ data dinh dưỡng, tổng số đánh giá. |
| `ingredient-engine/` | Logic phân tích từ hình ảnh/text thành mảng nguyên liệu. |
| `ai-assistant/` | Endpoint gọi OpenAI/Gemini để tư vấn, streaming dữ liệu chat. |
| `meal-planning/` | Lưu lịch ăn uống theo tuần, sinh tự động danh sách đi chợ. |
| `user/` | Đăng ký, Đăng nhập (Auth), quản lý Profile, JWT Token và Cấu hình ăn kiêng. |

---

### Bộ Khung Bên Trong Mỗi Module

Khi bạn mở một folder (ví dụ: `src/modules/recipe/`), bạn sẽ luôn luôn thấy 6 file cốt lõi sau. Tất cả mọi module đều bị ép buộc tuân theo quy tắc xương sống này.

```text
modules/recipe/
├── recipe.route.js          ← Khai báo Endpoint HTTP (Router)
├── recipe.validation.js     ← Kiểm tra dữ liệu req.body/params hợp lệ
├── recipe.controller.js     ← Nhận Request, trả Response (HTTP status)
├── recipe.service.js        ← Chứa TOÀN BỘ não bộ & logic tính toán
├── recipe.repository.js     ← Cầu nối duy nhất tương tác với Database
└── recipe.model.js          ← Định nghĩa cấu trúc lưu trữ MongoDB (Schema)
```

#### Chi tiết vòng đời 1 request:

1. **Route (`.route.js`)**: Nhận một request `POST /api/recipe/recommend` và uỷ quyền.
2. **Validation (`.validation.js`)**: Kiểm tra xem `req.body` đã có mảng `ingredients` chưa, có gửi rỗng không? (Dùng Joi / Zod).
3. **Controller (`.controller.js`)**: Lấy `req.body.ingredients` ném vào Service. Khi có kết quả sẽ trả về `res.status(200).json()`. *Tuyệt đối không code If/Else phức tạp hay query Data ở Controller.*
4. **Service (`.service.js`)**: **TRÁI TIM QUAN TRỌNG NHẤT.** Nếu User VIP thì gọi AI gen công thức, nếu free thì lấy 3 công thức DB. Nơi đây sẽ kết nối các module với nhau. 
5. **Repository (`.repository.js`)**: Chứa logic gọi Mongoose (ví dụ: `RecipeModel.find()`). Cách ly Mongoose để sau này muốn đổi DB khác cũng không cần sửa Controller/Service.
6. **Model (`.model.js`)**: Mô hình JSON sẽ lưu vào MongoDB. 

---

## 🔷 `src/shared/` — Tiện ích dùng chung

Code tiện dụng đa mục đích không gắn với thực thể riêng biệt nào.

| Thư mục | Nhiệm vụ | Vi dụ |
|---------|-----------|-------|
| `shared/exceptions/`| Lớp báo lỗi Custom của hệ thống          | `AppError.js`, `NotFoundError.js` |
| `shared/utils/`     | Các hàm Helper đa năng                   | `jwtHelpers.js`, `logger.js`, `hashPassword.js` |

---

## 📐 Luồng Dữ Liệu Chạy Trong Backend (Data Flow Pattern)

Hãy nhớ chuỗi phản ứng sau cho mọi Request đẩy về Server:

```text
🌐 Trình Duyệt / App Gọi Tới
           ↓
[ ROUTE ] 👉 Phân luồng endpoint (vd: POST /login)
           ↓
[ MIDDLEWARE / VALIDATOR ] 👉 Chặn lại nếu thiếu Token hoặc Body sai định dạng
           ↓
[ CONTROLLER ] 👉 Nhận mớ dữ liệu "sạch sẽ", bóc tách ra.
           ↓
[ SERVICE ] 👉 Nơi giải quyết nghiệp vụ, mã hoá pass, gửi mail.
           ↓
[ REPOSITORY ] 👉 Viết/Đọc Mongoose Database.
           ↓
📦 Database MONGODB
```

---

## 🚀 Tính Linh Hoạt (Quy Ước)

*   **Chỉ Service mới có quyền gọi chéo Service khác**: Ví dụ, `RecipeService.js` có thể gọi `AiAssassinService.generateMeal()` nhưng nó **KHÔNG ĐƯỢC PHÉP** gọi `AiAssassinController`.
*   **Controller chỉ biết xử lý Response**: Không xử lý Database, chỉ gọi `res.send / res.json`. Nếu `Service` quăng lỗi (`throw error`), `Controller` để cho Middleware xử lý (`next(error)`).
