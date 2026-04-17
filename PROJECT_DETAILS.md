# PROJECT DETAILS: Eatsy — AI-Powered Culinary Assistant

## 1. Project Directory Map
Cấu trúc thư mục hiện tại của dự án:

```text
Eatsy/
├── frontend/                 # Ứng dụng di động (React Native/Expo)
│   ├── src/
│   │   ├── screens/          # Các màn hình chính (Login, Pantry, Chat, v.v.)
│   │   ├── components/       # Các UI Component dùng chung
│   │   ├── store/            # State Management (Zustand)
│   │   ├── services/         # API calls (Axios)
│   │   ├── navigation/       # Cấu hình chuyển trang
│   │   └── utils/            # Các hàm tiện ích
│   ├── assets/               # Hình ảnh, fonts
│   ├── tailwind.config.js    # Cấu hình NativeWind
│   └── App.js                # Entry point
│
└── backend/                  # Server-side (Express.JS)
    ├── src/
    │   ├── modules/          # Logic theo module (Tách biệt User, Recipe, AI)
    │   │   ├── ai-assistant/ # Xử lý chatbot Gemini
    │   │   ├── user/         # Quản lý người dùng & Auth
    │   │   ├── recipe/       # Quản lý công thức nấu ăn
    │   │   ├── ingredient/   # Quản lý nguyên liệu lẻ
    │   │   └── pantry/       # Quản lý tủ lạnh người dùng (Pantry)
    │   ├── middleware/       # Authen, Error handling
    │   ├── config/           # Kết nối MongoDB, biến môi trường
    │   └── server.js         # Khởi tạo Server
    └── package.json          # Danh sách dependencies (Mongoose, Gemini AI)
```

---

## 2. Tech Stack Details

*   **Frontend Framework:** React Native (Expo SDK 54).
*   **Styling:** NativeWind (Tailwind CSS cho React Native).
*   **State Management:** **Zustand** (Nhẹ, nhanh hơn Redux Toolkit và dễ quản lý hơn Context API cho mobile).
*   **Data Fetching:** **Axios** (Được cấu hình trong thư mục `services`).
*   **Backend Framework:** Node.js với Express.js.

---

## 3. Database Schema (MongoDB/Mongoose)

### **Model: User** (Người dùng)
*   `name`: Tên hiển thị.
*   `email`: Dùng để đăng nhập (Unique).
*   `password`: Lưu hash bcrypt.
*   `authProvider`: `local`, `google`, hoặc `apple`.
*   `dietaryPreferences`: Tùy chọn ăn uống (Vegetarian, Vegan, v.v.) và dị ứng.
*   `healthGoals`: Mục tiêu sức khỏe & Calo mục tiêu mỗi ngày.
*   `savedRecipes`: Danh sách Recipe ID đã lưu (Bookmark).

### **Model: Recipe** (Công thức nấu ăn)
*   `title`, `description`, `imageUrl`.
*   `author`: Liên kết với User (nếu do người dùng tạo).
*   `source`: `user` hoặc `spoonacular` (từ API bên thứ 3).
*   **Ingredients** (Sub-document): Mảng gồm { `name`, `quantity`, `unit`, `isOptional` }.
*   **Steps** (Sub-document): Các bước nấu { `order`, `instruction`, `duration` }.
*   `nutrition`: Thông tin dinh dưỡng (Calories, Protein, Carbs, Fat).
*   `difficulty`, `mealType` (Bữa sáng, trưa, tối).

### **Model: Ingredient** (Nguyên liệu)
*   Hiện tại, Project đang sử dụng `Ingredient` chủ yếu dưới dạng **Sub-document** bên trong `Recipe` để tăng hiệu năng query.
*   Trong module `pantry`, nguyên liệu được lưu kèm theo số lượng và ngày hết hạn để AI có thể gợi ý món ăn từ đồ có sẵn.

---

## 4. AI Workflow

Cách hệ thống gọi LLM và xử lý dữ liệu:

*   **LLM Provider:** Sử dụng trực tiếp **Google Gemini API** (Model `gemini-2.5-flash`) thông qua thư viện `@google/generative-ai`.
*   **Workflow:**
    1.  **Request:** Người dùng gửi message từ App tới API Backend (`/api/v1/ai-assistant/chat`).
    2.  **Context Injection:** Backend tự động truy vấn "Tủ lạnh" (`Pantry`) của User đó từ Database.
    3.  **Prompt Engineering:** Backend kết hợp message của User + Dữ liệu tủ lạnh + `System Instruction` (quy định tính cách AI) để tạo thành một prompt hoàn chỉnh.
    4.  **Calling:** Gọi trực tiếp API của Google (không qua LangChain để tối ưu tốc độ phản hồi trên mobile).
    5.  **Response:** Trả kết quả text (Markdown) về cho Mobile để render UI.
