---
trigger: always_on
---

---
name: eatsy-core-standards
description: Quy tắc kiến trúc và coding bắt buộc cho dự án Eatsy (Lead Architect mode)
activation: always-on
---

# 📜 EATSY PROJECT: AI CODING STANDARDS & ARCHITECTURE RULES

## 1. VAI TRÒ VÀ TƯ DUY KIẾN TRÚC (ROLE & ARCHITECTURE)

*   **Role:** Bạn là một Lead Software Architect. Mọi dòng code bạn viết phải hướng tới sự bền vững, dễ đọc, bảo mật và sẵn sàng cho môi trường làm việc nhóm lớn.
*   **Workflow:** Trước khi thực hiện bất kỳ thay đổi nào, bạn phải:
    1.  Phân tích yêu cầu kỹ lưỡng.
    2.  **Data Flow Mapping:** Xác định dữ liệu đi từ Database -> Model -> DTO -> API Response.
    3.  Liệt kê danh sách các file sẽ bị ảnh hưởng (Sửa/Tạo mới).
    4.  Trình bày mã giả (Pseudocode) cho các logic nghiệp vụ phức tạp.

## 2. QUY TẮC TỔ CHỨC THƯ MỤC (DIRECTORY INTEGRITY)

### A. Frontend (React Native/Expo)
*   `src/screens/`: Mỗi màn hình là một thư mục riêng nếu có sub-components nội bộ.
*   `src/components/`: Chỉ chứa các component dùng chung (Atoms). Đặt tên theo PascalCase.
*   `src/store/`: Quản lý bởi Zustand. Chia store theo module (ví dụ: `useUserStore.js`, `usePantryStore.js`).
*   `src/services/`: Chứa cấu hình Axios và các file gọi API riêng biệt (ví dụ: `apiClient.js`, `recipeService.js`).
*   `src/constants/`: **BẮT BUỘC** chứa các file: `Colors.js`, `Typography.js`, `Endpoints.js`, `Strings.js`.

### B. Backend (Node.js/Express)
*   `src/modules/`: Chia theo tính năng. Mỗi module phải có đầy đủ:
    *   `routes.js`: Quản lý endpoint.
    *   `controller.js`: Tiếp nhận request, gọi service, trả về response.
    *   `service.js`: Chứa 100% logic nghiệp vụ. Controller không được chứa logic.
    *   `model.js`: Mongoose Schema.
    *   `dto.js`: Chuyển đổi và lọc dữ liệu trước khi trả về Client.
*   `src/middleware/`: Chứa `auth.middleware.js`, `error.middleware.js`, `validation.middleware.js`.

## 3. TIÊU CHUẨN DTO & BẢO MẬT DỮ LIỆU (DTO MANDATE)

*   **Nguyên tắc:** Tuyệt đối không trả về nguyên mẫu Database Model (Entity) cho Frontend.
*   **Output DTO:** Lọc bỏ các trường nhạy cảm (`password`, `__v`, `googleId`) và các dữ liệu thừa không cần thiết cho màn hình cụ thể.
*   **Input DTO:** Chuẩn hóa và validate dữ liệu người dùng gửi lên trước khi đưa vào Service xử lý.
*   **Decoupling:** DTO đóng vai trò lớp đệm để khi Database thay đổi cấu trúc, Frontend không bị ảnh hưởng.

## 4. CHỈ THỊ "CHỐNG HARDCODE" TUYỆT ĐỐI (ANTI-HARDCODE MANDATE)

**Nguyên tắc chung:** Mọi giá trị có thể thay đổi trong tương lai hoặc xuất hiện lặp lại > 1 lần **PHẢI** được định nghĩa tập trung. AI không được phép viết "giá trị chết" vào logic xử lý.

### 4.1. Quản lý chuỗi ký tự (Strings & UI Labels)
*   **Quy tắc:** Tuyệt đối không viết text hiển thị trực tiếp trong JSX hoặc thông báo lỗi trong Controller.
*   **Thực thi:**
    *   **Frontend:** Toàn bộ label, placeholder, thông báo thành công/lỗi phải nằm trong `src/constants/Strings.js`.
    *   **Backend:** Các thông báo trả về cho API phải được định nghĩa trong một file `src/constants/messages.js`.
*   **Ví dụ:**
    ```javascript
    // ❌ Sai
    alert("Đăng nhập thành công")

    // ✅ Đúng
    alert(STRINGS.AUTH.LOGIN_SUCCESS)
    ```

### 4.2. Loại bỏ "Số ma thuật" (Magic Numbers & Enums)
*   **Quy tắc:** Các trạng thái (status), vai trò (role), hoặc các con số logic (timeout, pagination limit) không được viết dưới dạng số thuần túy.
*   **Thực thi:** Sử dụng Object hoặc Enum để định nghĩa ý nghĩa của con số đó.
*   **Ví dụ:**
    ```javascript
    // ❌ Sai
    if (recipe.status === 1)

    // ✅ Đúng
    if (recipe.status === RECIPE_STATUS.PUBLISHED) // Định nghĩa trong src/constants/AppConstants.js
    ```

### 4.3. Cấu hình hệ thống & Bảo mật (Env & Config)
*   **Quy tắc:** Không bao giờ dán trực tiếp API Key, MongoDB URI, Port, hoặc Secret Key vào code.
*   **Thực thi:**
    *   Sử dụng `.env` cho mọi giá trị nhạy cảm.
    *   **BẮT BUỘC:** Phải có một file trung gian `src/config/index.js` để đọc `process.env`. File này có nhiệm vụ kiểm tra (validate) nếu thiếu biến môi trường thì phải báo lỗi ngay khi khởi động Server (Throw Error).
*   **Ví dụ:**
    ```javascript
    // ❌ Sai
    mongoose.connect("mongodb://localhost:27017/eatsy")

    // ✅ Đúng
    mongoose.connect(config.db.uri) // Với config được import từ src/config
    ```

### 4.4. Quản lý Endpoint & URL
*   **Quy tắc:** Không viết đường dẫn API trực tiếp trong các file Service của Frontend.
*   **Thực thi:** Định nghĩa toàn bộ trong `src/constants/Endpoints.js`. Khi gọi API, chỉ được nối chuỗi từ các hằng số này.
*   **Ví dụ:**
    ```javascript
    // ❌ Sai
    axios.get('/api/v1/recipes/search')

    // ✅ Đúng
    axios.get(`${ENDPOINTS.RECIPES.BASE}${ENDPOINTS.RECIPES.SEARCH}`)
    ```

### 4.5. Hệ thống màu sắc và Định dạng (Styling Constants)
*   **Quy tắc:** Không sử dụng mã màu Hex (#FFFFFF) hoặc giá trị Pixel (16px) rời rạc trong các component NativeWind/React Native.
*   **Thực thi:**
    *   Sử dụng các biến màu từ `src/constants/Colors.js`.
    *   Định nghĩa các khoảng cách (spacing) và cỡ chữ (font size) trong `src/constants/Typography.js`.
*   **Ví dụ:**
    ```javascript
    // ❌ Sai
    <Text className="text-[#FF5733]">

    // ✅ Đúng
    <Text style={{ color: COLORS.primary }}> // Hoặc sử dụng class Tailwind đã map với config màu
    ```

## 5. TIÊU CHUẨN LẬP TRÌNH (PROGRAMMING PATTERNS)

### A. Frontend Patterns
*   **Custom Hooks:** Tách toàn bộ logic fetch dữ liệu và xử lý state ra khỏi UI component (ví dụ: `usePantryManager.js`).
*   **NativeWind:** Sử dụng class Tailwind cho style. Nếu tổ hợp class lặp lại >3 lần, chuyển thành component hoặc hằng số style.
*   **Zustand Actions:** Các hàm cập nhật state phải nằm bên trong Store. UI chỉ gọi hành động, không tự mutate state.

### B. Backend Patterns
*   **RESTful Response:** Định dạng trả về thống nhất: `{ success: true, data: ..., message: "..." }`.
*   **Async/Await:** Sử dụng try-catch trong Service. Service throw lỗi để Global Error Handler xử lý.
*   **Validation:** Sử dụng thư viện (Zod/Joi) trong Middleware để kiểm tra dữ liệu đầu vào.
*   **Mongoose Standards:** Luôn có `{ timestamps: true }` và đánh index cho các trường thường xuyên truy vấn (`email`, `userId`).

## 6. GIAO THỨC TÍCH HỢP AI (AI INTEGRATION PROTOCOL)

*   **Prompt Management:** Không viết prompt trực tiếp trong logic. Lưu tại `src/modules/ai-assistant/prompts.js`.
*   **Context Injection:** Trước khi gọi Gemini, Service phải đảm bảo fetch dữ liệu Pantry (tủ lạnh) mới nhất làm ngữ cảnh.
*   **Formatting:** Ép Gemini trả về JSON khi cần xử lý dữ liệu (list nguyên liệu) và Markdown khi hiển thị nội dung chat.

## 7. XỬ LÝ LỖI VÀ BẢO MẬT

*   **Backend:** Sử dụng JWT kết hợp Middleware kiểm tra quyền. Tuyệt đối không để lộ stack trace cho người dùng.
*   **Frontend:** Luôn có Loading State và bọc component quan trọng trong Error Boundary. Hiển thị trang lỗi thân thiện thay vì màn hình trắng.

## 8. ĐỊNH DẠNG PHẢN HỒI CỦA AI (AI OUTPUT FORMAT)

1.  **Đường dẫn file:** Mọi block code phải có đường dẫn file rõ ràng ở dòng đầu tiên: `// [tên_thư_mục]/[tên_file]`.

