# 🏗️ Eatsy — DDD Folder Structure

## Full Folder Tree

```
src/
├── app/
│   ├── navigation/
│   │   ├── index.js              ← barrel export
│   │   └── AppNavigator.js       ← root navigator placeholder
│   └── providers/
│       ├── index.js              ← barrel export
│       └── AppProviders.js       ← global providers wrapper
│
├── modules/
│   ├── discovery/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── services/
│   │   ├── application/
│   │   │   ├── usecases/
│   │   │   └── dto/
│   │   ├── infrastructure/
│   │   │   ├── api/
│   │   │   ├── repositories/
│   │   │   └── mappers/
│   │   ├── presentation/
│   │   │   ├── screens/
│   │   │   │   └── HomeScreen.js
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   └── index.js
│   │
│   ├── recipe/
│   │   ├── domain/ entities/ repositories/ services/
│   │   ├── application/ usecases/ dto/
│   │   ├── infrastructure/ api/ repositories/ mappers/
│   │   ├── presentation/
│   │   │   ├── screens/
│   │   │   │   └── RecipeDetailScreen.js
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   └── index.js
│   │
│   ├── ingredient-engine/
│   │   ├── ...same DDD layers...
│   │   ├── presentation/screens/
│   │   │   └── IngredientScanScreen.js
│   │   └── index.js
│   │
│   ├── ai-assistant/
│   │   ├── ...same DDD layers...
│   │   ├── presentation/screens/
│   │   │   └── ChatScreen.js
│   │   └── index.js
│   │
│   ├── meal-planning/
│   │   ├── ...same DDD layers...
│   │   ├── presentation/screens/
│   │   │   └── MealPlanScreen.js
│   │   └── index.js
│   │
│   └── user/
│       ├── ...same DDD layers...
│       ├── presentation/screens/
│       │   └── ProfileScreen.js
│       └── index.js
│
├── shared/
│   ├── ui/
│   │   └── index.js              ← shared UI components (Button, Card, etc.)
│   ├── hooks/
│   │   └── index.js              ← shared hooks (useDebounce, etc.)
│   ├── utils/
│   │   └── index.js              ← formatDate(), truncate(), etc.
│   └── constants/
│       └── index.js              ← APP_NAME, COLORS, API_BASE_URL
│
└── infra/
    ├── api-client/
    │   └── index.js              ← fetch wrapper (apiGet, apiPost)
    └── storage/
        └── index.js              ← AsyncStorage wrapper
```

## DDD Layer Responsibilities

| Layer | Folder | Purpose |
|-------|--------|---------|
| **Domain** | `domain/entities/` | Business entities & value objects |
| | `domain/repositories/` | Repository interfaces (contracts) |
| | `domain/services/` | Domain services / business rules |
| **Application** | `application/usecases/` | Use cases orchestrating domain logic |
| | `application/dto/` | Data Transfer Objects for input/output |
| **Infrastructure** | `infrastructure/api/` | API calls (HTTP, WebSocket) |
| | `infrastructure/repositories/` | Repository implementations |
| | `infrastructure/mappers/` | API ↔ Domain entity mappers |
| **Presentation** | `presentation/screens/` | Screen components |
| | `presentation/components/` | Module-specific UI components |
| | `presentation/hooks/` | Module-specific React hooks |

## Module Summary

| Module | Key Screen | Purpose |
|--------|-----------|---------|
| `discovery` | `HomeScreen` | Browse & discover recipes |
| `recipe` | `RecipeDetailScreen` | View recipe details, steps, nutrition |
| `ingredient-engine` | `IngredientScanScreen` | Scan/input ingredients, find matches |
| `ai-assistant` | `ChatScreen` | AI-powered cooking assistant |
| `meal-planning` | `MealPlanScreen` | Weekly meal plans & calendar |
| `user` | `ProfileScreen` | User profile, preferences, settings |

## Import Convention

```js
// Import from module barrel exports
import { HomeScreen } from "@/modules/discovery";
import { ChatScreen } from "@/modules/ai-assistant";

// Import shared utilities
import { formatDate } from "@/shared/utils";
import { COLORS } from "@/shared/constants";

// Import infra
import { apiGet } from "@/infra/api-client";
```

> [!TIP]
> Configure `babel-plugin-module-resolver` to use `@/` path aliases for cleaner imports.
