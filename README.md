# 🍽️ Eatsy – Trợ Lý Ẩm Thực Tích Hợp AI & Lập Kế Hoạch Bữa Ăn

## 📌 Tổng Quan

Eatsy là một trợ lý ẩm thực tích hợp AI được thiết kế để giúp người dùng đưa ra các quyết định nấu nướng thông minh hơn, giảm thiểu lãng phí thức ăn và cá nhân hóa trải nghiệm lập kế hoạch bữa ăn hàng ngày.

Khác với các ứng dụng công thức nấu ăn truyền thống chỉ cung cấp nội dung tĩnh, Eatsy tận dụng các Mô hình Ngôn ngữ Lớn (LLMs) và kho dữ liệu công thức có cấu trúc để đưa ra các đề xuất theo đúng ngữ cảnh, dựa trên nguyên liệu hiện có, sở thích của người dùng và mục tiêu dinh dưỡng.

---

## 🚀 Tính Năng Nổi Bật

* 🥗 **Ghép công thức dựa trên nguyên liệu**
  Gợi ý các món ăn dựa trên số nguyên liệu mà người dùng đang có sẵn.

* 🤖 **Trợ lý nấu ăn AI**
  Chatbot tương tác được tiếp sức mạnh bởi LLMs, giúp trả lời các câu hỏi về nấu nướng, gợi ý nguyên liệu thay thế và lên ý tưởng cho bữa ăn.

* 🎯 **Hồ sơ cá nhân hóa**
  Đề xuất được tinh chỉnh theo sở thích ăn uống, mục tiêu sức khỏe và thói quen nấu nướng riêng biệt của từng người.

* 🔍 **Hệ thống bộ lọc thông minh**
  Lọc công thức món ăn theo loại bữa ăn, độ khó, lượng calo và các yêu cầu ăn kiêng nghiêm ngặt.

* 📅 **Hỗ trợ lên thực đơn**
  Lập kế hoạch bữa ăn tối ưu cho cá nhân hoặc cả gia đình.

---

## 🏗️ Công Nghệ Sử Dụng

### Frontend

* React Native (Ứng dụng Mobile)
* React.js (Phiên bản Web tuỳ chọn)
* NativeWind (Tailwind CSS cho React Native)

### Backend

* Node.js + Express (RESTful API)

### Cơ Sở Dữ Liệu

* MongoDB (Lưu trữ linh hoạt cho thông tin công thức và dữ liệu người dùng)

### Tích hợp AI

* OpenAI API / Google Gemini (Trợ lý ảo nền tảng LLM)

---

## 🧠 Kiến Trúc Hệ Thống

Eatsy tuân theo kiến trúc full-stack phân chia theo Module (Feature-based Modular / DDD):

* **Lớp Frontend:** Xử lý tương tác của người dùng và hiển thị giao diện UI
* **Lớp Backend:** Quản lý logic nghiệp vụ và các cổng giao tiếp API
* **Lớp Database:** Lưu trữ hồ sơ người dùng, dữ liệu công thức và đa tuỳ chọn
* **Lớp AI:** Cung cấp các câu trả lời thông minh, sát với ngữ cảnh trò chuyện

---

## 🎯 Mục Tiêu Dự Án

* Giảm bớt sự mệt mỏi khi phải suy nghĩ "Hôm nay ăn gì"
* Giảm thiểu lãng phí thức ăn bằng cách tái sử dụng hiệu quả nguyên liệu thừa
* Mang đến các đề xuất bữa ăn mang tính cá nhân hóa cao
* Cung cấp trợ lý AI hỗ trợ liên tục trong thời gian thực ngay tại nhà bếp

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Theo Nhóm (Setup Guide)

> **Lưu ý:** Hiện tại dự án mới chỉ có phần Backend. Phần Frontend sẽ được cập nhật luồng chạy sau.

Sau khi Pull code mới nhất từ nhánh `main` về máy, các thành viên trong nhóm làm đúng theo các bước sau để chạy Server:

### Bước 1: Di chuyển vào thư mục Backend
Mở Terminal của VSCode và gõ:
```bash
cd backend
```

### Bước 2: Cài đặt thư viện (Quy chuẩn Node.js)
Trong Node.js, thẻ cài đặt thư viện được quản lý bởi file `package.json` (giống kiểu file `requirements.txt` bên Python). Bạn chỉ cần gõ 1 lệnh duy nhất để tải mọi thứ về:
```bash
npm install
```

### Bước 3: Cấu hình Môi trường (Biến tuyệt mật)
Vì lý do bảo mật, file chứa mật khẩu Database thật (`.env`) đã bị ẩn khỏi Github.
1. Bạn hãy tìm file có tên là `.env.example` nằm trong thư mục `backend`.
2. **Copy** nội dung file .env do Bùi Ngọc cung cấp update thường xuyên và đổi tên thành `.env`

### Bước 4: Khởi Động Server
Sau khi làm xong 3 bước trên, bạn gõ lệnh chạy:
```bash
npm run dev
```
Nếu Terminal báo dòng chữ xanh lá hiển thị `🚀 Server is running on port 5000` và `✅ Đã kết nối MongoDB` thì chúc mừng, bạn đã sẵn sàng Code!

---

## 📂 Trạng Thái Dự Án

🚧 Đang phát triển (Dự án Học thuật)

---

## 🤝 Đóng Góp

Dự án này được phát triển như một phần của đồ án trên trường Đại học. Mọi đóng góp, đề xuất tính năng và phản hồi đều luôn được chào đón.

---

## 📜 Giấy Phép

Dự án này phục vụ riêng cho mục đích giáo dục môn học.
