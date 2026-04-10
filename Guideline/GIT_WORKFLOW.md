# Git Workflow & Commit Guidelines

Tài liệu này mô tả cách làm việc nhóm trên GitHub để:
- tránh conflict
- không phá nhánh main
- giữ code luôn ổn định

**Nguyên tắc:**
`main` chỉ chứa code đã chạy được.

## 1. Workflow làm việc (GitHub Flow)

KHÔNG push trực tiếp lên `main`.
Mọi thay đổi phải thông qua branch + Pull Request.

### Bước 1: Cập nhật code mới nhất
Trước khi code:
```bash
git checkout main
git pull origin main
```

### Bước 2: Tạo branch mới
Mỗi task → một branch riêng

**Format:**
- `feature/<ten-chuc-nang>`
- `fix/<ten-loi>`

**Ví dụ:**
```bash
git checkout -b feature/login-api
```

### Bước 3: Code và commit
```bash
git add .
git commit -m "feat: implement login api"
```

### Bước 4: Push lên GitHub
```bash
git push origin feature/login-api
```

### Bước 5: Tạo Pull Request
1. Vào GitHub → chọn **Compare & pull request**
2. Viết mô tả ngắn:
   - đã làm gì
   - có gì cần lưu ý
3. Chờ review → merge vào `main`

## 2. Quy chuẩn commit (Conventional Commits)

**Format:**
`<type>: <short description>`

**Các loại commit**
- `feat:` → thêm tính năng mới
  → `feat: add login api`
- `fix:` → sửa lỗi
  → `fix: handle null password`
- `docs:` → sửa tài liệu
  → `docs: update readme`
- `style:` → format code (không đổi logic)
  → `style: format user controller`
- `refactor:` → tối ưu code (không đổi behavior)
  → `refactor: extract auth logic`
- `chore:` → việc lặt vặt (config, install lib)
  → `chore: install jsonwebtoken`

## 3. Quy tắc quan trọng
- Không commit file `.env`
- Commit nhỏ, thường xuyên
  - mỗi feature / API → 1 commit
- Luôn pull trước khi code
- Nếu gặp merge conflict:
  - không tự sửa nếu không chắc
  - trao đổi với team trước

## 4. Quy chuẩn đặt tên branch

**Format chung:**
- `feature/<name>`
- `fix/<name>`
