# 🧪 EATSY BACKEND — API TEST DATA (POSTMAN)

> **Base URL:** `http://localhost:5050`  
> **Content-Type:** `application/json`  
> **Auth:** Bearer Token (lấy từ response Login / Register)

---

## ⚙️ HƯỚNG DẪN CHUẨN BỊ

### Bước 1 — Khởi động Server
```bash
cd backend
npm run dev
```

### Bước 2 — Seed dữ liệu mẫu vào DB (chỉ chạy 1 lần)
```bash
node src/seeds/seed.js
```
> ⚠️ Lệnh seed sẽ **xóa sạch** Recipe, Pantry, Category cũ và tạo dữ liệu mẫu mới.  
> Seed tạo sẵn 1 user: `seed.user@example.com` / `password123`

### Bước 3 — Cấu hình Postman Environment
| Variable | Value |
|---|---|
| `BASE_URL` | `http://localhost:5050` |
| `TOKEN` | *(dán token sau khi Login)* |

### Bước 4 — Thêm Authorization vào các request cần auth
- Tab **Authorization** → Type: **Bearer Token**
- Value: `{{TOKEN}}`

---

## ✅ TASK 1 — Đăng Ký Tài Khoản (Register)

### API
```
POST {{BASE_URL}}/api/users/register
```

### Body (JSON)
```json
{
  "name": "Nguyễn Văn A",
  "email": "vana@example.com",
  "password": "123456"
}
```

### Expected Response `201`
```json
{
  "success": true,
  "message": "Đăng ký tải khoản thành công",
  "data": {
    "user": {
      "_id": "...",
      "name": "Nguyễn Văn A",
      "email": "vana@example.com",
      "authProvider": "local"
    },
    "token": "eyJhbGc..."
  }
}
```

### Test Cases
| Case | Input | Expected |
|---|---|---|
| ✅ Thành công | body đầy đủ, email mới | 201 + token |
| ❌ Thiếu name | bỏ field `name` | 400 "Vui lòng nhập đầy đủ..." |
| ❌ Email trùng | email đã tồn tại | 400 "Email này đã được đăng ký..." |
| ❌ Thiếu password | bỏ field `password` | 400 |

---

## ✅ TASK 2 — Đăng Nhập (Login)

### API
```
POST {{BASE_URL}}/api/users/login
```

### Body (JSON)
```json
{
  "email": "vana@example.com",
  "password": "123456"
}
```
> 💡 Hoặc dùng tài khoản seed: `seed.user@example.com` / `password123`

### Expected Response `200`
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "_id": "...",
      "name": "Nguyễn Văn A",
      "email": "vana@example.com"
    },
    "token": "eyJhbGc..."
  }
}
```

> 📌 **Copy token này vào biến `{{TOKEN}}` của Postman Environment!**

### Test Cases
| Case | Input | Expected |
|---|---|---|
| ✅ Thành công | email + pass đúng | 200 + token |
| ❌ Sai password | pass sai | 401 "Sai email hoặc tài khoản..." |
| ❌ Email không tồn tại | email chưa đăng ký | 401 |
| ❌ Thiếu email | bỏ field `email` | 400 |

---

## ✅ TASK 3 — Đăng Nhập OAuth Google/Apple

### API
```
POST {{BASE_URL}}/api/users/oauth
```

### Body (JSON) — Đăng nhập Google
```json
{
  "email": "googleuser@gmail.com",
  "name": "Google User",
  "providerId": "google-uid-12345678",
  "authProvider": "google",
  "avatarUrl": "https://lh3.googleusercontent.com/example.jpg"
}
```

### Body (JSON) — Đăng nhập Apple
```json
{
  "email": "appleuser@icloud.com",
  "name": "Apple User",
  "providerId": "apple-uid-87654321",
  "authProvider": "apple",
  "avatarUrl": ""
}
```

### Expected Response `200`
```json
{
  "success": true,
  "message": "Đăng nhập OAuth thành công!",
  "data": {
    "user": { ... },
    "token": "eyJhbGc..."
  }
}
```

### Test Cases
| Case | Input | Expected |
|---|---|---|
| ✅ User Google mới | email chưa tồn tại | 200 + tự tạo tài khoản |
| ✅ User Google cũ | email đã có trong DB | 200 + cập nhật googleId |
| ❌ Thiếu providerId | bỏ field `providerId` | 400 "Thiếu thông tin cần thiết..." |
| ❌ Thiếu authProvider | bỏ field `authProvider` | 400 |

---

## ✅ TASK 4 & 5 — Hồ Sơ Người Dùng (User Profile)

> 🔒 **Yêu cầu Auth:** Cần đặt Bearer Token

### 4a. Lấy Hồ Sơ (Get Profile)

```
GET {{BASE_URL}}/api/users/profile
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response `200`**
```json
{
  "success": true,
  "message": "Lấy thông tin hồ sơ thành công",
  "data": {
    "user": {
      "_id": "...",
      "name": "Nguyễn Văn A",
      "email": "vana@example.com",
      "dietaryPreferences": { "dietType": "omnivore", "allergies": [] },
      "healthGoals": { "goal": "maintain", "dailyCalorieTarget": 2000 }
    }
  }
}
```

### 4b. Cập Nhật Hồ Sơ (Update Profile)

```
PUT {{BASE_URL}}/api/users/profile
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body (JSON)**
```json
{
  "name": "Nguyễn Văn A (Updated)",
  "avatarUrl": "https://example.com/avatar.jpg",
  "dietaryPreferences": {
    "dietType": "vegetarian",
    "allergies": ["nuts", "shellfish"],
    "dislikedIngredients": ["cilantro"],
    "cuisinePreferences": ["asian", "italian"]
  },
  "healthGoals": {
    "goal": "lose_weight",
    "dailyCalorieTarget": 1800
  }
}
```

**Expected Response `200`**
```json
{
  "success": true,
  "message": "Cập nhật hồ sơ thành công",
  "data": {
    "user": {
      "name": "Nguyễn Văn A (Updated)",
      "dietaryPreferences": { "dietType": "vegetarian", ... }
    }
  }
}
```

### Test Cases
| Case | Input | Expected |
|---|---|---|
| ✅ Get profile thành công | Token hợp lệ | 200 + user data |
| ✅ Update name | `{ "name": "..." }` | 200 + user updated |
| ✅ Update dietaryPreferences | JSON hợp lệ | 200 |
| ❌ Không có token | Bỏ Authorization header | 401 Unauthorized |
| ❌ Token sai | Token giả | 401 |

---

## ✅ TASK 6 — Danh Mục Thực Phẩm (Categories)

> 🌐 **Public API** — Không cần token

### API
```
GET {{BASE_URL}}/api/categories
```

### Expected Response `200`
```json
{
  "success": true,
  "message": "Lấy danh sách danh mục thành công",
  "data": {
    "categories": [
      {
        "_id": "...",
        "name": "Breakfast",
        "spoonacularTag": "breakfast",
        "tagType": "type",
        "imageUrl": "https://...",
        "sortOrder": 1,
        "isActive": true
      },
      {
        "_id": "...",
        "name": "Vegetarian",
        "spoonacularTag": "vegetarian",
        "tagType": "diet",
        "sortOrder": 2
      }
    ]
  }
}
```

### Test Cases
| Case | Input | Expected |
|---|---|---|
| ✅ Lấy tất cả category | GET không có body | 200 + array categories |
| ✅ Kết quả đã sort | - | sortOrder tăng dần (1,2,3...) |

> ⚠️ Nếu kết quả trả về mảng rỗng `[]`, hãy chạy seed lại: `node src/seeds/seed.js`

---

## ✅ TASK 7 — Seeding Database

> Đây là script chạy bằng terminal, không test qua Postman.

### Lệnh chạy Seed
```bash
cd backend
node src/seeds/seed.js
```

### Expected Output (Terminal)
```
Clearing Recipe/User/Pantry/Category collections...
Creating seed user...
Preparing seeded pantry items...
Inserting sample recipe documents...
Inserting sample category documents...
✅ Seeding completed successfully!
```

### Dữ liệu mẫu được tạo
| Collection | Số lượng | Ghi chú |
|---|---|---|
| User | 1 | `seed.user@example.com` / `password123` |
| Recipe | 2 | Carbonara, Quinoa Salad |
| Category | 5 | Breakfast, Vegetarian, Italian, Main Course, Dessert |
| Pantry | 1 | 5 nguyên liệu (egg, spaghetti, butter, cucumber, quinoa) |

---

## ✅ TASK 8 — Tủ Lạnh Pantry

> 🔒 **Yêu cầu Auth:** Cần đặt Bearer Token

### 8a. Lấy Tủ Lạnh (Get Pantry)

```
GET {{BASE_URL}}/api/pantry
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response `200`**
```json
{
  "success": true,
  "message": "Lấy pantry thành công",
  "data": {
    "pantry": {
      "_id": "...",
      "userId": "...",
      "items": [
        {
          "_id": "...",
          "spoonacularId": 1123,
          "name": "egg",
          "amount": 12,
          "unit": "piece"
        }
      ]
    }
  }
}
```

> 💡 Nếu user chưa có pantry, API sẽ **tự động tạo pantry rỗng** và trả về.

---

### 8b. Thêm Nguyên Liệu (Add Item to Pantry)

```
POST {{BASE_URL}}/api/pantry
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body (JSON)**
```json
{
  "spoonacularId": 9040,
  "name": "banana",
  "amount": 5,
  "unit": "piece",
  "imageUrl": "https://img.spoonacular.com/ingredients_100x100/bananas.jpg"
}
```

**Expected Response `201`**
```json
{
  "success": true,
  "message": "Thêm nguyên liệu thành công",
  "data": {
    "pantry": {
      "items": [ ... ]
    }
  }
}
```

---

### 8c. Xóa Nguyên Liệu (Delete Item from Pantry)

> 💡 **Lấy `itemId`** từ kết quả của `GET /api/pantry` (trường `items[0]._id`)

```
DELETE {{BASE_URL}}/api/pantry/{{itemId}}
```

**Ví dụ:**
```
DELETE {{BASE_URL}}/api/pantry/661abc123def456ghi789jkl
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response `200`**
```json
{
  "success": true,
  "message": "Xóa nguyên liệu thành công",
  "data": {
    "pantry": { ... }
  }
}
```

### Test Cases — Pantry
| Case | API | Expected |
|---|---|---|
| ✅ GET pantry lần đầu (user mới) | GET /api/pantry | 200 + pantry rỗng tự tạo |
| ✅ Thêm nguyên liệu hợp lệ | POST body đầy đủ | 201 |
| ✅ Xóa nguyên liệu tồn tại | DELETE với itemId đúng | 200 |
| ❌ Thiếu spoonacularId | POST bỏ field | 400 "Thiếu spoonacularId hoặc name..." |
| ❌ itemId không tồn tại | DELETE id sai | 404 "Không tìm thấy nguyên liệu..." |
| ❌ Không có token | Bỏ Authorization | 401 |

---

## ✅ TASK 9 — Tạo Công Thức Mới (Create Recipe)

> 🔒 **Yêu cầu Auth:** Cần đặt Bearer Token

### API
```
POST {{BASE_URL}}/api/recipes
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Body (JSON)**
```json
{
  "title": "Phở Bò Hà Nội",
  "description": "Tô phở bò truyền thống Hà Nội với nước dùng hầm xương trâu thơm ngon đậm đà.",
  "ingredients": [
    { "name": "beef bones", "quantity": 1, "unit": "kg" },
    { "name": "rice noodle", "quantity": 400, "unit": "g" },
    { "name": "beef slices", "quantity": 300, "unit": "g" },
    { "name": "onion", "quantity": 2, "unit": "piece" },
    { "name": "ginger", "quantity": 50, "unit": "g" },
    { "name": "star anise", "quantity": 3, "unit": "piece" },
    { "name": "fish sauce", "quantity": 3, "unit": "tbsp" }
  ],
  "steps": [
    { "order": 1, "instruction": "Chần xương bò qua nước sôi, rửa sạch.", "duration": 10 },
    { "order": 2, "instruction": "Nướng hành và gừng cho thơm, thêm vào nồi xương.", "duration": 5 },
    { "order": 3, "instruction": "Hầm xương 4-6 tiếng với các loại gia vị.", "duration": 360 },
    { "order": 4, "instruction": "Trụng bánh phở, xếp thịt bò, chan nước dùng nóng.", "duration": 5 }
  ],
  "difficulty": "hard",
  "mealType": ["breakfast", "lunch"],
  "prepTime": 30,
  "cookTime": 360,
  "servings": 4,
  "nutrition": {
    "calories": 450,
    "protein": 35,
    "carbohydrates": 55,
    "fat": 10,
    "fiber": 2
  },
  "imageUrl": "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800",
  "tags": ["vietnamese", "soup", "beef", "pho"]
}
```

**Expected Response `201`**
```json
{
  "success": true,
  "message": "Tạo công thức thành công",
  "data": {
    "recipe": {
      "_id": "...",
      "title": "Phở Bò Hà Nội",
      "author": "{{USER_ID}}",
      "source": "user",
      ...
    }
  }
}
```

### Test Cases
| Case | Input | Expected |
|---|---|---|
| ✅ Tạo recipe đầy đủ | body như trên | 201 + recipe object |
| ✅ Author tự động gán | (không cần truyền author) | `author` = user ID từ token |
| ❌ Thiếu title | bỏ `title` | 400 |
| ❌ Thiếu ingredients | bỏ `ingredients` | 400 |
| ❌ ingredients rỗng | `"ingredients": []` | 400 "phải có ít nhất 1 nguyên liệu" |
| ❌ steps rỗng | `"steps": []` | 400 "phải có ít nhất 1 bước" |
| ❌ difficulty sai enum | `"difficulty": "super_hard"` | 400 Validation error |
| ❌ Không có token | Bỏ Authorization | 401 |

---

## ✅ TASK 10 — AI Recipe Matching (Spoonacular)

> 🔒 **Yêu cầu Auth:** Cần đặt Bearer Token  
> ⚠️ **Yêu cầu:** Pantry phải có ít nhất 1 nguyên liệu + `SPOONACULAR_API_KEY` trong `.env`

### API
```
GET {{BASE_URL}}/api/recipes/match
```

**Headers:**
```
Authorization: Bearer {{TOKEN}}
```

**Expected Response `200`**
```json
{
  "success": true,
  "message": "AI đã gợi ý món ăn thành công",
  "data": [
    {
      "id": 654959,
      "title": "Pasta With Tuna",
      "image": "https://img.spoonacular.com/recipes/654959-312x231.jpg",
      "usedIngredientCount": 3,
      "missedIngredientCount": 2,
      "usedIngredients": [ ... ],
      "missedIngredients": [ ... ]
    }
  ]
}
```

### Test Cases
| Case | Điều kiện | Expected |
|---|---|---|
| ✅ Match thành công | Pantry có nguyên liệu, API key hợp lệ | 200 + danh sách món gợi ý |
| ❌ Pantry rỗng | Tủ lạnh chưa có nguyên liệu nào | 400 "Tủ lạnh của bạn đang trống!" |
| ❌ API key thiếu | Bỏ SPOONACULAR_API_KEY trong .env | 500 "bị cấu hình thiếu SPOONACULAR_API_KEY" |
| ❌ Không có token | Bỏ Authorization | 401 |

### Cách test nhanh Task 10
```
1. Đăng nhập bằng seed.user@example.com / password123
2. Copy token
3. Gọi GET /api/recipes/match với token đó
   → seed user đã có sẵn 5 nguyên liệu trong pantry (egg, spaghetti, butter, cucumber, quinoa)
```

---

## 📋 TỔNG HỢP TẤT CẢ API

| # | Task | Method | Endpoint | Auth |
|---|---|---|---|---|
| 1 | Register | `POST` | `/api/users/register` | ❌ |
| 2 | Login | `POST` | `/api/users/login` | ❌ |
| 3 | OAuth Login | `POST` | `/api/users/oauth` | ❌ |
| 4 | Get Profile | `GET` | `/api/users/profile` | ✅ |
| 5 | Update Profile | `PUT` | `/api/users/profile` | ✅ |
| 6 | Get Categories | `GET` | `/api/categories` | ❌ |
| 7 | Seed DB | *(terminal)* | `node src/seeds/seed.js` | ❌ |
| 8a | Get Pantry | `GET` | `/api/pantry` | ✅ |
| 8b | Add Pantry Item | `POST` | `/api/pantry` | ✅ |
| 8c | Delete Pantry Item | `DELETE` | `/api/pantry/:itemId` | ✅ |
| 9 | Create Recipe | `POST` | `/api/recipes` | ✅ |
| 10 | AI Match Recipes | `GET` | `/api/recipes/match` | ✅ |

---

## 🔄 LUỒNG TEST ĐỀ XUẤT (Thứ Tự Chạy)

```
1. POST /api/users/register           → Đăng ký user mới
2. POST /api/users/login              → Lấy TOKEN
3. GET  /api/users/profile            → Xem profile
4. PUT  /api/users/profile            → Cập nhật profile
5. GET  /api/categories               → Xem danh mục (cần seed trước)
6. GET  /api/pantry                   → Xem tủ lạnh (tự tạo rỗng)
7. POST /api/pantry                   → Thêm nguyên liệu
8. DELETE /api/pantry/:itemId         → Xóa nguyên liệu
9. POST /api/recipes                  → Tạo công thức mới
10. GET /api/recipes/match            → Gọi AI gợi ý món ăn
```

---

## ⚠️ LỖI THƯỜNG GẶP & CÁCH XỬ LÝ

| Lỗi | Nguyên nhân | Cách xử lý |
|---|---|---|
| `Cannot connect to server` | Server chưa chạy | `npm run dev` trong `/backend` |
| `401 Unauthorized` | Thiếu hoặc sai token | Đăng nhập lại, copy token mới |
| `Categories rỗng []` | Chưa seed | Chạy `node src/seeds/seed.js` |
| `400 Pantry trống` | User chưa thêm item | POST `/api/pantry` trước |
| `500 SPOONACULAR_API_KEY` | Thiếu key trong .env | Thêm key vào file `.env` |
| `Cast to ObjectId failed` | itemId không hợp lệ | Copy đúng `_id` từ GET pantry |
