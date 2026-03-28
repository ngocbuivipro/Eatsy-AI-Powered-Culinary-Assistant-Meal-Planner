# 🍽️ Eatsy Mobile

Trợ lý ẩm thực thông minh được xây dựng bằng React Native (Expo SDK 54), NativeWind, và kiến trúc Domain-Driven Design (DDD).

---

## 📁 Cấu Trúc Dự Án & Nhiệm Vụ Từng Thư Mục

```
eatsy-mobile/
├── src/
│   ├── app/              ← Khung ứng dụng (điều hướng, providers)
│   ├── modules/          ← Các module nghiệp vụ theo DDD
│   ├── shared/           ← Code dùng chung toàn ứng dụng
│   └── infra/            ← Hạ tầng kỹ thuật chung
├── assets/               ← Tài nguyên tĩnh (icon, splash, ảnh)
├── App.js                ← Component gốc
├── index.js              ← Điểm khởi chạy ứng dụng
├── global.css            ← Khai báo TailwindCSS
├── babel.config.js       ← Cấu hình Babel
├── metro.config.js       ← Cấu hình Metro Bundler
├── tailwind.config.js    ← Cấu hình TailwindCSS
└── package.json          ← Quản lý dependencies và scripts
```

---

## 🔷 Các File Gốc (Root)

| File                 | Nhiệm vụ                                                                                            |
|----------------------|-----------------------------------------------------------------------------------------------------| 
| `App.js`             | Component gốc — bọc các providers và hệ thống điều hướng                                            |
| `index.js`           | Điểm khởi chạy — đăng ký component gốc với Expo, import `global.css`                                |
| `global.css`         | Khai báo TailwindCSS (`@tailwind base/components/utilities`)                                        |
| `babel.config.js`    | Cấu hình Babel — bao gồm `babel-preset-expo` với NativeWind JSX và plugin `react-native-reanimated` |
| `metro.config.js`    | Cấu hình Metro bundler — tích hợp `withNativeWind` để xử lý CSS                                     |
| `tailwind.config.js` | Cấu hình TailwindCSS — đường dẫn content, preset NativeWind, màu sắc tuỳ chỉnh                      |
| `package.json`       | Quản lý thư viện và câu lệnh chạy                                                                   |

---

## 🔷 `src/app/` — Khung Ứng Dụng

Nơi thiết lập bộ khung chính của ứng dụng: điều hướng và các provider toàn cục.

| Thư mục          | Nhiệm vụ                                                                                              |  
|------------------|-------------------------------------------------------------------------------------------------------|  
| `app/navigation/`| Thiết lập React Navigation — stack navigator, tab navigator, định nghĩa route, cấu hình deep linking  |
| `app/providers/` | Các provider toàn cục — bọc ứng dụng với `ThemeProvider`, `AuthProvider`, `QueryClientProvider`, v.v. |

---

## 🔷 `src/modules/` — Các Module Nghiệp Vụ

Mỗi module là một **miền nghiệp vụ độc lập** theo kiến trúc DDD gồm 4 tầng (layer).

### Tổng quan các Module

| Module | Mục đích |
|--------|----------|
| `discovery/` | Trang chủ, duyệt công thức, tìm kiếm, danh mục, nội dung thịnh hành |
| `recipe/` | Chi tiết công thức, các bước nấu, thông tin dinh dưỡng, đánh giá |
| `ingredient-engine/` | Quét nguyên liệu (camera/nhập tay), quản lý tủ lạnh, gợi ý công thức phù hợp |
| `ai-assistant/` | Trợ lý AI — tư vấn nấu ăn, gợi ý công thức, thay thế nguyên liệu |
| `meal-planning/` | Lập kế hoạch bữa ăn theo tuần, lịch, tạo danh sách mua sắm |
| `user/` | Xác thực, hồ sơ người dùng, chế độ ăn, cài đặt |

### Cấu trúc bên trong mỗi Module (áp dụng cho TẤT CẢ module)

```
modules/<tên-module>/
├── domain/               ← Logic nghiệp vụ thuần (không phụ thuộc bên ngoài)
│   ├── entities/         ← Các đối tượng nghiệp vụ cốt lõi
│   ├── repositories/     ← Giao diện trừu tượng cho truy xuất dữ liệu
│   └── services/         ← Dịch vụ miền & quy tắc nghiệp vụ
│
├── application/          ← Điều phối các use case
│   ├── usecases/         ← Các trường hợp sử dụng (phối hợp logic miền)
│   └── dto/              ← Data Transfer Objects (định dạng dữ liệu vào/ra)
│
├── infrastructure/       ← Tích hợp với thế giới bên ngoài
│   ├── api/              ← Gọi API HTTP/WebSocket đến backend
│   ├── repositories/     ← Cài đặt cụ thể của repository interface
│   └── mappers/          ← Chuyển đổi dữ liệu API ↔ entity miền
│
├── presentation/         ← Tầng giao diện (React Native)
│   ├── screens/          ← Các màn hình (trang đầy đủ)
│   ├── components/       ← Component UI riêng của module
│   └── hooks/            ← React hooks riêng của module
│
└── index.js              ← Barrel export (API công khai của module)
```

### Chi tiết nhiệm vụ từng tầng

#### 1. `domain/` — Trái Tim Của Logic Nghiệp Vụ

| Thư mục | Chứa gì | Ví dụ |
|---------|---------|-------|
| `entities/`     | Các đối tượng nghiệp vụ có danh tính và hành vi                                      | `Recipe.js`, `Ingredient.js`, `MealPlan.js` |
| `repositories/` | Giao diện trừu tượng định nghĩa cách truy xuất dữ liệu (chỉ khai báo, không cài đặt) | `RecipeRepository.js` |
| `services/`     | Các quy tắc nghiệp vụ không trạng thái                                               | `NutritionCalculator.js`, `RecipeMatchingService.js` |

> ⚠️ Tầng domain **KHÔNG phụ thuộc** vào infrastructure, UI, hay bất kỳ framework nào.

#### 2. `application/` — Điều Phối Use Case

| Thư mục | Chứa gì | Ví dụ |
|---------|---------|-------|
| `usecases/` | Luồng xử lý cụ thể, phối hợp các đối tượng miền | `GetRecipeById.js`, `SearchRecipes.js`, `GenerateMealPlan.js` |
| `dto/`      | Định dạng dữ liệu cho đầu vào/đầu ra            | `RecipeListItemDTO.js`, `CreateMealPlanInput.js` |

> Use case gọi domain service và repository interface. Chúng không biết gì về HTTP hay React.

#### 3. `infrastructure/` — Kết Nối Thế Giới Bên Ngoài

| Thư mục | Chứa gì | Ví dụ |
|---------|---------|-------|
| `api/`          | Gọi HTTP thô đến backend API                                    | `RecipeApi.js` (`GET /recipes/:id`) |
| `repositories/` | Cài đặt cụ thể của repository interface trong tầng domain       | `RecipeRepositoryImpl.js` (sử dụng `RecipeApi` bên trong) |
| `mappers/`      | Chuyển đổi dữ liệu JSON từ API thành entity miền và ngược lại   | `RecipeMapper.js` (`apiResponse → Recipe entity`) |

#### 4. `presentation/` — Những Gì Người Dùng Nhìn Thấy

| Thư mục | Chứa gì | Ví dụ |
|---------|---------|-------|
| `screens/`    | Các component màn hình đầy đủ (dùng trong navigation) | `HomeScreen.js`, `RecipeDetailScreen.js` |
| `components/` | Các component UI tái sử dụng riêng cho module này     | `RecipeCard.js`, `IngredientList.js` |
| `hooks/`      | React hooks chuyên dụng cho dữ liệu/logic của module  | `useRecipeDetail.js`, `useSearchRecipes.js` |

---

## 🔷 `src/shared/` — Dùng Chung Toàn Ứng Dụng

Code tái sử dụng **không thuộc riêng** bất kỳ module nghiệp vụ nào.

| Thư mục | Nhiệm vụ | Ví dụ |
|---------|-----------|-------|
| `shared/ui/`        | Các component UI chung dùng ở mọi nơi  | `Button.js`, `Card.js`, `LoadingSpinner.js`, `Modal.js`, `Avatar.js` |
| `shared/hooks/`     | Các React hook dùng chung              | `useDebounce.js`, `useAppState.js`, `useKeyboard.js` |
| `shared/utils/`     | Hàm tiện ích thuần tuý                 | `formatDate.js`, `truncate.js`, `validators.js` |
| `shared/constants/` | Hằng số và giá trị cấu hình toàn cục   | `APP_NAME`, `COLORS`, `API_BASE_URL`, `ROUTES` |

---

## 🔷 `src/infra/` — Hạ Tầng Kỹ Thuật Chung

Các dịch vụ hạ tầng dùng chung cho toàn ứng dụng (không gắn với module cụ thể nào).

| Thư mục | Nhiệm vụ | Ví dụ |
|---------|-----------|-------|
| `infra/api-client/` | Cấu hình HTTP client cơ bản — interceptor, header xác thực, xử lý lỗi | `index.js` (wrapper fetch/axios với `apiGet`, `apiPost`) |
| `infra/storage/`    | Trừu tượng hoá lưu trữ cục bộ trên thiết bị                           | `index.js` (wrapper AsyncStorage: `getItem`, `setItem`, `removeItem`) |

---

## 🔷 `assets/` — Tài Nguyên Tĩnh

| Nội dung | Mô tả |
|----------|-------|
| `icon.png`          | Icon ứng dụng |
| `splash-icon.png`   | Hình ảnh màn hình splash |
| `adaptive-icon.png` | Icon adaptive cho Android |
| `favicon.png`       | Favicon cho phiên bản web |

---

## 📐 Luồng Kiến Trúc

```
Người dùng tương tác
         ↓
┌──────────────────────────┐
│   presentation/          │  Màn hình & Components (React Native + NativeWind)
│   screens/ hooks/        │
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│   application/           │  Use Cases & DTOs (điều phối)
│   usecases/ dto/         │
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│   domain/                │  Entities, Services, Repository Interfaces
│   entities/ services/    │  (logic nghiệp vụ thuần, không phụ thuộc framework)
└──────────┬───────────────┘
           ↓
┌──────────────────────────┐
│   infrastructure/        │  Gọi API, Cài đặt Repository, Mappers
│   api/ repositories/     │  (giao tiếp với thế giới bên ngoài)
└──────────────────────────┘
```

---

## 📦 Quy Ước Import

```js
// ✅ Import từ barrel export của module
import { HomeScreen } from "@/modules/discovery";
import { RecipeDetailScreen } from "@/modules/recipe";

// ✅ Import tiện ích dùng chung
import { formatDate } from "@/shared/utils";
import { COLORS } from "@/shared/constants";
import { Button, Card } from "@/shared/ui";

// ✅ Import hạ tầng
import { apiGet } from "@/infra/api-client";
import { getItem, setItem } from "@/infra/storage";

// ❌ KHÔNG BAO GIỜ import trực tiếp vào bên trong module khác
// import { RecipeApi } from "@/modules/recipe/infrastructure/api"; ← SAI
```

> 💡 Cấu hình `babel-plugin-module-resolver` để sử dụng alias `@/` cho import gọn hơn.

---

## 🛠️ Công Nghệ Sử Dụng

| Công nghệ | Phiên bản | Mục đích |
|----------- |-----------|----------|
| Expo                    | SDK 54 | Framework React Native |
| React Native            | 0.81.5 | Giao diện di động |
| NativeWind              |  v4.x  | TailwindCSS cho React Native |
| TailwindCSS             | v3.4.x | CSS tiện ích |
| React Navigation        |    —   | Điều hướng màn hình (sẽ cài thêm) |
| React Native Reanimated |    —   | Hiệu ứng động (peer dep của NativeWind) |
  