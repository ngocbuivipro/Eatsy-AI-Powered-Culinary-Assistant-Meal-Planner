# Kế Hoạch 5 Ngày (Sprint 1) - Khởi Động Backend Eatsy

**Tình hình hiện tại:** Nhóm 3 người (Level Beginner/Sinh viên). Database Model đã được thiết kế chuẩn chỉ.
**Mục tiêu tuần (Sprint Goal):** Dựng khung ExpressJS vững chắc, kết nối MongoDB thành công, hoàn thiện luồng Đăng nhập/Đăng ký và làm được API Tìm món ăn căn bản.

---

## 👥 Ý tưởng Phân Công (Roles)
Để 3 người không đạp code lên nhau bị Conflict trên Git, chia nhánh như sau:
* **👨‍💻 Dev A (Cơ sở hạ tầng):** Chuyên lo setup thư viện, chạy server, quản lý Git, và Cấu hình xử lý Lỗi (Error Handling).
* **🕵️‍♂️ Dev B (Bảo mật/User):** Chuyên làm hệ thống Account, rào API, băm mật khẩu, thư viện Authorization (JWT).
* **🍳 Dev C (Nghiệp vụ Món ăn):** Chuyên môn tạo dữ liệu Fake (Seeding), CRUD món ăn và thực hiện lệnh Query móc DB tìm nguyên liệu.

---

## 🗓️ 1. Ngày 1: Nền Móng Vững Chắc

### Task 1: Khởi tạo Server & Routing Cơ Bản
- **Priority:** 🔥 Cao nhất
- **Deadline:** Tối Ngày 1
- **Assignee:** Dev A
- **Description:** Chạy lệnh `npm init -y`, cài các gói `express`, `cors`, `dotenv`. Tạo cấu trúc thư mục folder MVC rỗng. Dựng file `server.js` khởi chạy server ở port 5000. Tạo router GET `/api` trả về câu "Eatsy API is running".
- **Deliverable:** Server log xanh lá: "Server is running on port 5000". Postman báo về `200 OK`.

### Task 2: Giao tiếp với MongoDB Atlas
- **Priority:** 🔥 Cao nhất
- **Deadline:** Tối Ngày 1
- **Assignee:** Dev C
- **Description:** Đăng ký Cluster miễn phí (Free Tier) trên MongoDB Atlas. Lấy chuỗi `MONGO_URI` thả vào file `.env`. Cài đặt mongoose (`npm i mongoose`) và viết file `src/config/db.js` để móc nối mạng.
- **Deliverable:** Console log ra dòng: "✅ Đã kết nối MongoDB Atlas thành công".

### Task 3: Kết nối đồng đội (Git Workflow Setup)
- **Priority:** ⚡ Cao
- **Deadline:** Tối Ngày 1
- **Assignee:** Cả 3 người
- **Description:** Cả 3 thành viên thử clone project từ Github về. Quy định tuyệt đối CẤM code trực tiếp vào nhánh `main`. Phải tạo nhánh phụ như `feature/auth` hay `feature/db`.
- **Deliverable:** Mọi người đều `npm install`, `npm start` thành công bản code mới nhất mà không bị crash (vỡ trận).

---

## 🗓️ 2. Ngày 2: Chào Sân Dữ Liệu & Đăng Ký Account

### Task 4: API Đăng ký tài khoản (Register System)
- **Priority:** 🔥 Cao nhất
- **Deadline:** Cuối Ngày 2
- **Assignee:** Dev B
- **Description:** Code logic Router `POST /api/users/register`. Lấy `email` & `password` từ req.body. Cài gói `bcryptjs` để băm nát password (Hash) trước khi dùng Model mongoose nhét vào DB. Kiểm tra trùng Email.
- **Deliverable:** API nhận thông tin, tạo User trong Atlas. Khi mở trình duyệt Atlas xem, mật khẩu đã là chuỗi kí tự loạn xì ngầu (đã mã hoá).

### Task 5: Middleware Gom Lỗi Tập Trung (Global Error Handler)
- **Priority:** 🟢 Trung bình
- **Deadline:** Cuối Ngày 2
- **Assignee:** Dev A
- **Description:** Code 1 file middleware bắt toàn bộ lỗi phát sinh của Server (ví dụ: Thiếu Email, lỗi rớt mạng DB) để báo `status: 400/500` và quăng JSON lỗi chuẩn hoá xuống Frontend. App không bao giờ bị đứng im trắng màn hình khi code lỗi.
- **Deliverable:** Lên được file `error.middleware.js`. Gọi file này vào `server.js` ở cuối cùng. 

---

## 🗓️ 3. Ngày 3: Cửa Ải Đăng Nhập & Dữ Liệu Fake

### Task 6: API Đăng Nhập Xác Thực (Login & JWT)
- **Priority:** 🔥 Cao nhất
- **Deadline:** Cuối Ngày 3
- **Assignee:** Dev B
- **Description:** Viết `POST /api/users/login`. Dùng lệnh `.findOne({ email })`. So sánh mật khẩu bằng hàm `bcrypt.compare`. Cài gói `jsonwebtoken`, kí tên ra một chuỗi "Chìa khóa" Token có thời hạn 30 ngày.
- **Deliverable:** Đăng nhập thành công, Postman nhận về token dài ngoằng. 

### Task 7: Bồi đắp "Nguồn Chân Lý" Khởi Thủy (Seeding / Post)
- **Priority:** ⚡ Cao
- **Deadline:** Cuối Ngày 3
- **Assignee:** Dev C
- **Description:** Collection `recipes` và `ingredients` bằng 0 làm sao test được code? Dev C có trách nhiệm vào tay tạo 3-4 món ăn Fake và 10 loại nguyên liệu thông dụng bằng Postman hoặc viết Script đẩy vào. Tạo API GET list các Ingredient ra để coi.
- **Deliverable:** Có dữ liệu "Cơm Chiên Thịt Bò" và "Thịt Bò", "Cơm", "Trứng" trong DB Atlas.

---

## 🗓️ 4. Ngày 4: Trái Tim Của Ứng Dụng (Lõi Logic)

### Task 8: Tường Lửa API Bằng Token (Auth Middleware)
- **Priority:** ⚡ Cao
- **Deadline:** Cuối Ngày 4
- **Assignee:** Dev B + Dev A
- **Description:** Làm chức năng cản đường người lạ. Bạn không Login thì ko cho bạn "Sửa thông tin". Viết 1 logic kiểm tra header `Authorization` có mã Token cấp hôm qua không, mã bị fake ko, dịch ngược nó ra xem đây là thằng `userId` nào.
- **Deliverable:** Tách hàm ra, chắn trên một route `GET /api/users/profile`. Ko bỏ token ➡️ lỗi 401 Unauthorized. Bỏ Token thật ➡️ Trả thông tin user.

### Task 9: API Tạo Công Thức Mới
- **Priority:** ⚡ Cao
- **Deadline:** Cuối Ngày 4
- **Assignee:** Dev C
- **Description:** Hoàn thiện nốt `POST /api/recipes`. Nhận thông tin Tên, mảng bước thực hiện, lấy `userId` (từ lớp bảo vệ của Dev B/A ở Task 8 truyền sang) gắn làm `author`.
- **Deliverable:** Post lệnh thành công ra Recipe mới liên kết được với User tạo ra.

---

## 🗓️ 5. Ngày 5: Áp Dụng Bài Học Database & Gom Report

### Task 10: Xây thuật toán Lọc Nguyên Liệu Cơ Bản
- **Priority:** 🔥 Cao nhất
- **Deadline:** Chiều Ngày 5
- **Assignee:** Dev C (tất cả focus chung coi)
- **Description:** Viết API Trái tim của dự án `GET /api/recipes/search`. Cho mảng IDs các nguyên liệu, dùng `$in` tìm ra các công thức Món có các ID nguyên liệu trong `ingredient_ids` array, thêm logic chấm điểm (Matched %, Limit) theo Design Doc.
- **Deliverable:** API test thành công trên Postman, đẩy ID tỏi lên, trả về được Màn Hình món Cơm Chiên Tỏi siêu mượt.

### Task 11: Đóng gói API, Lưu trữ Postman Collection
- **Priority:** 🟢 Trung bình
- **Deadline:** Tối Ngày 5
- **Assignee:** Cả 3 Người
- **Description:** Cả nhóm cùng review lại File Export của Postman. Thống nhất cách đặt tên API, format body JSON. Viết hướng dẫn nhỏ (như RUN SERVER) vào README.md. 
- **Deliverable:** Repo được sync lên 1 code chung mượt mà, Postman share dễ click. Chuẩn bị liên hoan ăn uống! 🍻
