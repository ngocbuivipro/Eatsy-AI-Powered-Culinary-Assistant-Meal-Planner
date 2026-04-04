# EATSY — POSTMAN TEST DATA

> Base URL: `http://localhost:5050`
> Mọi request có body đều cần Header: `Content-Type: application/json`

---

## BƯỚC 0 — KHỞI ĐỘNG (chạy 1 lần duy nhất)

```bash
# Terminal 1: Chạy server
cd backend
npm run dev

# Terminal 2: Seed dữ liệu mẫu
node src/seeds/seed.js
```

---

---

## TASK 1 — ĐĂNG KÝ TÀI KHOẢN

```
Method : POST
URL    : http://localhost:5050/api/users/register
```

**Headers**
```
Content-Type: application/json
```

**Body (raw → JSON)**
```json
{
  "name": "Nguyen Van A",
  "email": "vana@gmail.com",
  "password": "123456"
}
```

**Kết quả mong đợi → Status 201**
```json
{
  "success": true,
  "message": "Đăng ký tải khoản thành công",
  "data": {
    "user": {
      "name": "Nguyen Van A",
      "email": "vana@gmail.com"
    },
    "token": "<COPY_TOKEN_NÀY>"
  }
}
```

---

## TASK 2 — ĐĂNG NHẬP

```
Method : POST
URL    : http://localhost:5050/api/users/login
```

**Headers**
```
Content-Type: application/json
```

**Body (raw → JSON)**
```json
{
  "email": "vana@gmail.com",
  "password": "123456"
}
```

> Hoặc dùng tài khoản seed sẵn:
```json
{
  "email": "seed.user@example.com",
  "password": "password123"
}
```

**Kết quả mong đợi → Status 200**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "name": "Nguyen Van A",
      "email": "vana@gmail.com"
    },
    "token": "<COPY_TOKEN_NÀY>"
  }
}
```

> ⚠️ Copy trường `token` từ response, dùng cho tất cả các task bên dưới.

---

## TASK 3 — ĐĂNG NHẬP GOOGLE / APPLE (OAuth)

```
Method : POST
URL    : http://localhost:5050/api/users/oauth
```

**Headers**
```
Content-Type: application/json
```

**Body Google (raw → JSON)**
```json
{
  "email": "googleuser@gmail.com",
  "name": "Google User",
  "providerId": "google-uid-123456789",
  "authProvider": "google",
  "avatarUrl": "https://lh3.googleusercontent.com/avatar.jpg"
}
```

**Body Apple (raw → JSON)**
```json
{
  "email": "appleuser@icloud.com",
  "name": "Apple User",
  "providerId": "apple-uid-987654321",
  "authProvider": "apple",
  "avatarUrl": ""
}
```

**Kết quả mong đợi → Status 200**
```json
{
  "success": true,
  "message": "Đăng nhập OAuth thành công!",
  "data": {
    "user": { ... },
    "token": "<TOKEN>"
  }
}
```

---

## TASK 4 — XEM HỒ SƠ NGƯỜI DÙNG

```
Method : GET
URL    : http://localhost:5050/api/users/profile
```

**Headers**
```
Content-Type: application/json
Authorization: Bearer <DÁN_TOKEN_VÀO_ĐÂY>
```

*(Không có body)*

**Kết quả mong đợi → Status 200**
```json
{
  "success": true,
  "message": "Lấy thông tin hồ sơ thành công",
  "data": {
    "user": {
      "_id": "...",
      "name": "Nguyen Van A",
      "email": "vana@gmail.com",
      "authProvider": "local",
      "dietaryPreferences": {
        "dietType": "omnivore",
        "allergies": [],
        "dislikedIngredients": [],
        "cuisinePreferences": []
      },
      "healthGoals": {
        "goal": "maintain",
        "dailyCalorieTarget": 2000
      }
    }
  }
}
```

---

## TASK 5 — CẬP NHẬT HỒ SƠ NGƯỜI DÙNG

```
Method : PUT
URL    : http://localhost:5050/api/users/profile
```

**Headers**
```
Content-Type: application/json
Authorization: Bearer <DÁN_TOKEN_VÀO_ĐÂY>
```

**Body (raw → JSON)**
```json
{
  "name": "Nguyen Van A Updated",
  "avatarUrl": "https://example.com/my-avatar.jpg",
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

**Kết quả mong đợi → Status 200**
```json
{
  "success": true,
  "message": "Cập nhật hồ sơ thành công",
  "data": {
    "user": {
      "name": "Nguyen Van A Updated",
      "dietaryPreferences": {
        "dietType": "vegetarian",
        "allergies": ["nuts", "shellfish"]
      },
      "healthGoals": {
        "goal": "lose_weight",
        "dailyCalorieTarget": 1800
      }
    }
  }
}
```

---

## TASK 6 — LẤY DANH MỤC (Categories)

> Không cần token, public API.

```
Method : GET
URL    : http://localhost:5050/api/categories
```

**Headers**
```
Content-Type: application/json
```

*(Không có body)*

**Kết quả mong đợi → Status 200**
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
        "sortOrder": 1,
        "isActive": true
      },
      {
        "_id": "...",
        "name": "Vegetarian",
        "spoonacularTag": "vegetarian",
        "tagType": "diet",
        "sortOrder": 2
      },
      {
        "_id": "...",
        "name": "Italian",
        "spoonacularTag": "italian",
        "tagType": "cuisine",
        "sortOrder": 3
      },
      {
        "_id": "...",
        "name": "Main Course",
        "spoonacularTag": "main course",
        "tagType": "type",
        "sortOrder": 4
      },
      {
        "_id": "...",
        "name": "Dessert",
        "spoonacularTag": "dessert",
        "tagType": "type",
        "sortOrder": 5
      }
    ]
  }
}
```

> ⚠️ Nếu `categories` trả về mảng rỗng `[]` → chạy `node src/seeds/seed.js` rồi thử lại.

---

## TASK 7 — SEED DATABASE

> Không test qua Postman. Chạy lệnh dưới đây trong terminal.

```bash
node src/seeds/seed.js
```

**Output terminal khi thành công:**
```
Clearing Recipe/User/Pantry/Category collections...
Creating seed user...
Preparing seeded pantry items...
Inserting sample recipe documents...
Inserting sample category documents...
✅ Seeding completed successfully!
```

**Dữ liệu được tạo ra:**

| Collection | Nội dung |
|---|---|
| User | `seed.user@example.com` / `password123` |
| Recipe | Classic Spaghetti Carbonara, Mediterranean Quinoa Salad |
| Category | Breakfast, Vegetarian, Italian, Main Course, Dessert |
| Pantry | egg, spaghetti, butter, cucumber, quinoa |

---

## TASK 8A — XEM TỦ LẠNH (Get Pantry)

```
Method : GET
URL    : http://localhost:5050/api/pantry
```

**Headers**
```
Content-Type: application/json
Authorization: Bearer <DÁN_TOKEN_VÀO_ĐÂY>
```

*(Không có body)*

**Kết quả mong đợi → Status 200**
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
          "_id": "661abc123def456ghi000001",
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

> 💡 Nếu user mới chưa có tủ → API tự tạo pantry rỗng, trả về `items: []`.
> Copy `_id` của bất kỳ item nào để dùng cho TASK 8C bên dưới.

---

## TASK 8B — THÊM NGUYÊN LIỆU VÀO TỦ (Add Pantry Item)

```
Method : POST
URL    : http://localhost:5050/api/pantry
```

**Headers**
```
Content-Type: application/json
Authorization: Bearer <DÁN_TOKEN_VÀO_ĐÂY>
```

**Body (raw → JSON)**
```json
{
  "spoonacularId": 9040,
  "name": "banana",
  "amount": 5,
  "unit": "piece",
  "imageUrl": "https://img.spoonacular.com/ingredients_100x100/bananas.jpg"
}
```

**Kết quả mong đợi → Status 201**
```json
{
  "success": true,
  "message": "Thêm nguyên liệu thành công",
  "data": {
    "pantry": {
      "items": [
        {
          "_id": "661abc123def456ghi000099",
          "spoonacularId": 9040,
          "name": "banana",
          "amount": 5,
          "unit": "piece"
        }
      ]
    }
  }
}
```

> Copy `_id` của item vừa thêm để test TASK 8C.

---

## TASK 8C — XÓA NGUYÊN LIỆU KHỎI TỦ (Delete Pantry Item)

> Thay `<ITEM_ID>` bằng `_id` lấy từ GET /api/pantry ở bước 8A hoặc 8B.

```
Method : DELETE
URL    : http://localhost:5050/api/pantry/<ITEM_ID>
```

**Ví dụ URL thực tế:**
```
http://localhost:5050/api/pantry/661abc123def456ghi000099
```

**Headers**
```
Content-Type: application/json
Authorization: Bearer <DÁN_TOKEN_VÀO_ĐÂY>
```

*(Không có body)*

**Kết quả mong đợi → Status 200**
```json
{
  "success": true,
  "message": "Xóa nguyên liệu thành công",
  "data": {
    "pantry": {
      "items": []
    }
  }
}
```

---

## TASK 9 — TẠO CÔNG THỨC MỚI (Create Recipe)

```
Method : POST
URL    : http://localhost:5050/api/recipes
```

**Headers**
```
Content-Type: application/json
Authorization: Bearer <DÁN_TOKEN_VÀO_ĐÂY>
```

**Body (raw → JSON)**
```json
{
  "title": "Pho Bo Ha Noi",
  "description": "Traditional Hanoi beef pho with rich bone broth, tender beef slices and fresh herbs.",
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
    { "order": 1, "instruction": "Blanch beef bones in boiling water for 5 minutes, then rinse clean.", "duration": 10 },
    { "order": 2, "instruction": "Char onion and ginger directly over flame until fragrant, add to pot.", "duration": 5 },
    { "order": 3, "instruction": "Simmer bones with spices on low heat for 4-6 hours.", "duration": 360 },
    { "order": 4, "instruction": "Blanch rice noodles, top with beef slices, ladle hot broth over and serve.", "duration": 5 }
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
  "imageUrl": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800",
  "tags": ["vietnamese", "soup", "beef", "pho"]
}
```

**Kết quả mong đợi → Status 201**
```json
{
  "success": true,
  "message": "Tạo công thức thành công",
  "data": {
    "recipe": {
      "_id": "...",
      "title": "Pho Bo Ha Noi",
      "author": "<USER_ID_TỰ_GÁN_TỪ_TOKEN>",
      "source": "user",
      "difficulty": "hard",
      "prepTime": 30,
      "cookTime": 360,
      "servings": 4,
      "isPublished": true
    }
  }
}
```

---

## TASK 10 — AI GỢI Ý MÓN ĂN (Recipe Match)

> ⚠️ Trước khi test Task 10, kiểm tra:
> 1. File `.env` có `SPOONACULAR_API_KEY=your_key`
> 2. User đang dùng đã có nguyên liệu trong pantry (hoặc login bằng seed.user)

```
Method : GET
URL    : http://localhost:5050/api/recipes/match
```

**Headers**
```
Content-Type: application/json
Authorization: Bearer <DÁN_TOKEN_VÀO_ĐÂY>
```

*(Không có body)*

**Kết quả mong đợi → Status 200**
```json
{
  "success": true,
  "message": "AI đã gợi ý món ăn thành công",
  "data": [
    {
      "id": 654959,
      "title": "Pasta With Tuna",
      "image": "https://img.spoonacular.com/recipes/654959-312x231.jpg",
      "usedIngredientCount": 4,
      "missedIngredientCount": 1,
      "usedIngredients": [
        { "id": 1123, "name": "egg", "amount": 2, "unit": "large" }
      ],
      "missedIngredients": [
        { "id": 15121, "name": "tuna", "amount": 1, "unit": "can" }
      ]
    }
  ]
}
```

**Cách test nhanh nhất:**
```
1. Chạy: node src/seeds/seed.js
2. POST /api/users/login  với  seed.user@example.com / password123
3. Copy token
4. GET /api/recipes/match với token đó
   → seed user đã có sẵn: egg, spaghetti, butter, cucumber, quinoa
```

---

## TỔNG HỢP NHANH

| Task | Method | URL | Token? |
|------|--------|-----|--------|
| 1 | POST | `/api/users/register` | Không |
| 2 | POST | `/api/users/login` | Không |
| 3 | POST | `/api/users/oauth` | Không |
| 4 | GET | `/api/users/profile` | **Có** |
| 5 | PUT | `/api/users/profile` | **Có** |
| 6 | GET | `/api/categories` | Không |
| 7 | — | `node src/seeds/seed.js` | — |
| 8A | GET | `/api/pantry` | **Có** |
| 8B | POST | `/api/pantry` | **Có** |
| 8C | DELETE | `/api/pantry/:itemId` | **Có** |
| 9 | POST | `/api/recipes` | **Có** |
| 10 | GET | `/api/recipes/match` | **Có** |
