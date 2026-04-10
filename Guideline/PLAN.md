# 📅 CIA NHỎ KẾ HOẠCH (GRANULAR FOUNDATION PLAN)

**Chiến lược:** Chia nhỏ từng Task thành các bước cực kỳ li ti. Làm đến đâu, kiểm tra (Test) đến đó rồi mới làm tiếp.

---

## 🏗️ GIAI ĐOẠN 1: NỀN MÓNG (ARCHITECTURE & STATE)

### Task 1.1: Trạng thái và Bộ nhớ (Zustand & Storage)
- **Công việc:** Tạo Store quản lý User/Token.
- **Cách làm:** Tạo `src/modules/user/store/useAuthStore.js`.
- **Cách Test:** Trong `App.js`, import store và `console.log` thử trạng thái `isAuthenticated`.

### Task 1.2: Động cơ gọi API (Axios Client)
- **Công việc:** Cấu hình Axios cơ bản (chưa cần interceptor phức tạp).
- **Cách làm:** Viết lại `src/infra/api-client/index.js` dùng Axios.
- **Cách Test:** Gọi thử 1 API đơn giản (VD: `GET /health` hoặc `/categories`) xem có trả về data không.

### Task 1.3: Bảo mật API (Interceptors)
- **Công việc:** Tự động đính kèm Token vào Header.
- **Cách làm:** Thêm Request Interceptor vào `axiosClient`.
- **Cách Test:** Gọi API cần quyền (VD: `/profile`) và xem trong tab Network có Header `Authorization` chưa.

### Task 1.4: Khung xương Navigation (Basic)
- **Công việc:** Cài đặt NavigationContainer.
- **Cách làm:** Setup `RootNavigator.js` thô (chỉ hiện 1 màn hình duy nhất).
- **Cách Test:** Chạy App thấy hiện đúng màn hình đã chọn.

### Task 1.5: Điều hướng phân quyền (Auth Flow)
- **Công việc:** Tự động đổi màn hình khi Log In/Log Out.
- **Cách làm:** Tạo `AuthStack.js` và `MainTab.js`. Viết logic chuyển đổi trong `RootNavigator`.
- **Cách Test:** Thay đổi giá trị `isAuthenticated` trong Store -> App phải tự văng qua lại giữa Login và Home.

---

## 🎨 GIAI ĐOẠN 2: HỆ THỐNG GIAO DIỆN (DESIGN SYSTEM)

### Task 2.1: Định nghĩa màu sắc (Tailwind Tokens)
- **Công việc:** Đưa mã màu Figma vào code.
- **Cách làm:** Sửa `tailwind.config.js`. 
- **Cách Test:** Gán class `bg-eatsy-primary` vào một `View` bất kỳ xem có ra màu xanh rêu không.

### Task 2.2: Thành phần Nút bấm (PrimaryButton)
- **Công việc:** Đúc nút bấm chuẩn.
- **Cách làm:** Tạo `src/shared/ui/PrimaryButton.js`.
- **Cách Test:** Đưa nút vào màn hình Welcome, bấm thử xem có hiện Loading không.

### Task 2.3: Thành phần Ô nhập liệu (FormInput)
- **Công việc:** Đúc ô input chuẩn.
- **Cách làm:** Tạo `src/shared/ui/FormInput.js`.
- **Cách Test:** Đưa vào màn hình Login, gõ thử chữ xem hiện thị đúng không.

### Task 2.4: Thành phần Thẻ món ăn (RecipeCard)
- **Công việc:** Đúc thẻ món ăn chuẩn.
- **Cách làm:** Tạo `src/shared/ui/RecipeCard.js`.
- **Cách Test:** Đổ dữ liệu tĩnh vào thẻ xem ảnh và chữ có bị tràn không.

---

## ⚡ GIAI ĐOẠN 3: LOGIC AI (AI SERVICES)

### Task 3.1: Giao diện Chat (UI Shell)
### Task 3.2: Kết nối não Gemini (API integration)
### Task 3.3: Logic tìm kiếm món ăn (Recipe Match)

---

