# Quy Chuẩn Làm Việc Nhóm trên GitHub (Git Workflow) & Cách Commit

Để nhóm 3 người code chung mà không ẩu đả, không xoá mất code của nhau và tuyệt đối KHÔNG làm "tê liệt" nhánh `main`, tất cả các thành viên phải tuân thủ luồng làm việc bên dưới. Nhánh `main` chỉ chứa code ĐÃ HOÀN THIỆN và CHẠY ĐƯỢC.

---

## 🚦 PHẦN 1: QUY TRÌNH LÀM VIỆC (GITHUB FLOW)

Tuyệt đối KHÔNG ai được gõ lệnh `git push origin main`. Mỗi khi nhận một Task mới trong `PLAN.md`, mọi người làm theo 5 bước sinh tử sau:

### Bước 1: Luôn lấy code mới nhất về trước khi code
Tranh thủ lúc các bạn khác vừa làm xong tính năng mới, bạn phải cập nhật về máy mình ngay để tránh Conflict.
```bash
git checkout main
git pull origin main
```

### Bước 2: Tách nhánh mới (Tạo không gian làm việc riêng)
Bạn đang làm chức năng nào, hãy đặt tên nhánh có ý nghĩa theo chức năng đó.
**Cú pháp:** `loại_nhánh/ten-chuc-nang`
*(Ví dụ: `feature/login-api`, `fix/loi-mat-khau`, `feature/recipe-schema`)*
```bash
git checkout -b feature/ten-chuc-nang-cua-ban
```

### Bước 3: Code và Commit theo Quy chuẩn (Xem Phần 2)
Sau khi viết code ngon nghẻ, bạn lưu lại:
```bash
git add .
git commit -m "feat: viet hoan thien api dang nhap"
```

### Bước 4: Đẩy nhánh riêng của bạn lên GitHub
**Lưu ý:** Gõ đúng tên cái nhánh bạn vừa tạo ở Bước 2.
```bash
git push origin feature/ten-chuc-nang-cua-ban
```

### Bước 5: Lên GitHub tạo Pull Request (Yêu cầu gộp code)
1. Mở trang Repo trên Github (website). Nó sẽ hiện nút màu xanh lá **"Compare & pull request"**. Bấm vào đó.
2. Viết vài dòng mô tả bạn "đã làm gì" để 2 người còn lại nắm tình hình.
3. Chờ 1 thành viên khác trong nhóm xem qua code của bạn. Nếu ổn, người đó sẽ bấm nút **Merge pull request** để trộn tính năng của bạn vào `main`. Nhánh lẻ của bạn sau đó có thể bị xóa đi cho sạch.

---

## 📝 PHẦN 2: QUY CHUẨN ĐẶT TÊN COMMIT (CONVENTIONAL COMMITS)

Mọi cú pháp `git commit -m "..."` đều phải tuân theo chuẩn quốc tế để nhìn vào Lịch sử Git là biết ngay mục đích của thay đổi đó là gì. Bắt buộc có tiền tố ở đằng trước thông điệp.

**Cú pháp chung:** `<loại>: <Mô tả cực ngắn về việc vừa làm>`

### CÁC LOẠI TIỀN TỐ BẮT BUỘC:
* 🌟 **`feat:`** (Feature) -> Khi bạn code xong 1 tính năng MỚI HOÀN TOÀN. 
  *(vd: `git commit -m "feat: tao API dang ky cho user"`)*
* 🐛 **`fix:`** (Bug Fix) -> Khi bạn sửa một cái lỗi (crash, sai logic) của code cũ.
  *(vd: `git commit -m "fix: sua loi khong ma hoa duoc mat khau"`)*
* 📚 **`docs:`** (Documentation) -> Chỉ viết/sửa file tài liệu (Markdown, README), không đụng vào code.
  *(vd: `git commit -m "docs: cap nhat file PLAN.md cho ngay 2"`)*
* 💅 **`style:`** (Style) -> Giãn dòng, xuống dòng, thêm dấu `;`, format lại code cho đẹp (KHÔNG biến đổi logic).
  *(vd: `git commit -m "style: format lai code cho controller user"`)*
* ♻️ **`refactor:`** (Refactor) -> Viết lại một đoạn code cũ cho chạy nhanh hơn, gọn hơn (nhưng tính năng giữ nguyên, không sửa lỗi).
  *(vd: `git commit -m "refactor: tach ham ma hoa password ra file utils rieng"`)*
* 📦 **`chore:`** (Chore) -> Việc lặt vặt (như cài thêm 1 thư viện npm, update file config bỏ qua lỗi linh tinh).
  *(vd: `git commit -m "chore: cai dat them thu vien jsonwebtoken"`)*

---

## ⚠️ 3 ĐIỀU RĂN XƯƠNG MÁU
1. **Tuyệt đối không đẩy file `.env` lên Github**. Github mà phát hiện ra password Database, nó sẽ réo còi cả nhóm.
2. **Push code nhỏ lẻ**! Đừng làm quần quật 3 ngày rồi mới tạo 1 cục Commit to như cái đình. Cứ làm xong 1 cái API là Commit & Push nhánh ngay.
3. Nếu bấm `git pull origin main` nhỡ bị báo dòng chữ **Merge Conflict** màu đỏ chót -> Đừng hoảng sợ, không được đoán mò xoá code bậy, hãy gọi 2 anh em còn lại ra màn hình cùng thoả thuận xem giữ dòng code của ai, xoá dòng code của ai.

---

## 📌 PHẦN 3: QUY CHUẨN TÊN NHÁNH (BRANCHES) CHÍNH THỨC SPRINT 1

Để mọi thứ khớp 100% với `PLAN.md`, cấm chế tên nhánh. Cứ làm Task nào thì gõ đúng tên nhánh theo quy chuẩn dưới đây:

### 👨‍💻 Dành cho Dev A (Hạ Tầng / OAuth)
*   `feature/auth-oauth` (Làm Task 3: API Google/Apple)
*   `feature/auth-middleware` (Làm Task 4: Tường lửa Protect Token)

### 🕵️‍♂️ Dành cho Dev B (Bảo Mật / User / Tủ Lạnh)
*   `feature/auth-local` (Làm Task 1 & 2: Đăng ký, Đăng nhập Email)
*   `feature/user-profile` (Làm Task 5: Ráp API Profile cá nhân)
*   `feature/categories` (Làm Task 6: CRUD Danh mục ẩm thực)
*   `feature/pantry-crud` (Làm Task 8: Nhét/Xóa đồ trong tủ lạnh)

### 🍳 Dành cho Dev C (Nghiệp Vụ Món Ăn)
*   `feature/db-seeding` (Làm Task 7: Đổ dữ liệu rác khởi nguyên)
*   `feature/recipes-crud` (Làm Task 9: Đăng công thức thủ công)
*   `feature/recipe-matcher` (Làm Task 10: Xây thuật toán khớp não bộ AI)

*(Ví dụ: Khi Dev B bắt đầu làm tính năng Đăng nhập Email, gõ: `git checkout -b feature/auth-local`. Xong việc, gõ `git push origin feature/auth-local` rồi lên Github tạo Pull Request).*
