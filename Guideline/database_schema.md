# Database Schema Design

## 1. Collection: `users`
- **name**: String (required, minLength: 2, maxLength: 50)
- **email**: String (required, unique, match: email format)
- **password**: String (required, minLength: 6)
- **avatarUrl**: String (default: "")
- **dietaryPreferences**: Object
  - **dietType**: String (enum: omnivore, vegetarian, vegan, pescatarian, keto, paleo; default: omnivore)
  - **allergies**: Array of Strings
  - **dislikedIngredients**: Array of Strings
  - **cuisinePreferences**: Array of Strings
- **healthGoals**: Object
  - **goal**: String (enum: maintain, lose_weight, gain_muscle, eat_healthier; default: maintain)
  - **dailyCalorieTarget**: Number (min: 800, max: 5000, default: 2000)
- **savedRecipes**: Array of Objects
  - **recipeId**: ObjectId (ref: "Recipe")
  - **savedAt**: Date (default: Date.now)
- **isActive**: Boolean (default: true)
- **timestamps**: createdAt, updatedAt

## 2. Collection: `recipes`
- **title**: String (required, maxLength: 100)
- **description**: String (required, maxLength: 1000)
- **author**: ObjectId (ref: "User", default: null)
- **source**: String (enum: user, spoonacular; default: user)
- **spoonacularId**: Number (unique, sparse)
- **ingredient_ids**: Array of ObjectIds (ref: "Ingredient")
- **ingredients**: Array of Objects
  - **name**: String (required)
  - **quantity**: Number (required)
  - **unit**: String (required)
  - **isOptional**: Boolean (default: false)
- **steps**: Array of Objects
  - **order**: Number (required)
  - **instruction**: String (required)
  - **duration**: Number
  - **imageUrl**: String
- **categories**: Array of ObjectIds (ref: "Category")
- **difficulty**: String (enum: easy, medium, hard; default: medium)
- **mealType**: Array of Strings (enum: breakfast, lunch, dinner, snack, dessert; default: ["lunch"])
- **prepTime**: Number (required, min: 0)
- **cookTime**: Number (required, min: 0)
- **servings**: Number (required, min: 1)
- **nutrition**: Object
  - **calories**: Number (default: 0)
  - **protein**: Number (default: 0)
  - **carbohydrates**: Number (default: 0)
  - **fat**: Number (default: 0)
  - **fiber**: Number (default: 0)
- **imageUrl**: String (default: "")
- **reviews**: Array of Objects
  - **userId**: ObjectId (ref: "User", required)
  - **rating**: Number (required, min: 1, max: 5)
  - **comment**: String (maxLength: 500)
  - **createdAt**: Date (default: Date.now)
- **averageRating**: Number (default: 0, min: 0, max: 5)
- **totalReviews**: Number (default: 0)
- **isPublished**: Boolean (default: true)
- **tags**: Array of Strings
- **timestamps**: createdAt, updatedAt

## 3. Collection: `mealplans`
- **userId**: ObjectId (ref: "User", required)
- **title**: String (maxLength: 100, default: "Kế hoạch bữa ăn")
- **startDate**: Date (required)
- **endDate**: Date (required)
- **meals**: Array of Objects
  - **date**: Date (required)
  - **mealType**: String (enum: breakfast, lunch, dinner, snack; required)
  - **recipeId**: ObjectId (ref: "Recipe", required)
  - **servings**: Number (min: 1, default: 1)
  - **isCompleted**: Boolean (default: false)
  - **notes**: String (maxLength: 200)
- **totalNutrition**: Object
  - **calories**: Number (default: 0)
  - **protein**: Number (default: 0)
  - **carbohydrates**: Number (default: 0)
  - **fat**: Number (default: 0)
- **isActive**: Boolean (default: true)
- **timestamps**: createdAt, updatedAt

## 4. Collection: `pantries`
- **userId**: ObjectId (ref: "User", required, unique)
- **items**: Array of Objects
  - **ingredient_id**: ObjectId (ref: "Ingredient", required)
  - **name**: String (required)
  - **quantity**: Number (required, min: 0)
  - **unit**: String (enum: gram, kg, ml, liter, piece, tbsp, tsp, cup; required)
  - **expiryDate**: Date
  - **addedAt**: Date (default: Date.now)
- **timestamps**: createdAt, updatedAt

## 5. Collection: `categories`
- **name**: String (required, unique, maxLength: 50)
- **slug**: String (unique)
- **description**: String (maxLength: 200)
- **icon**: String (default: "🍽️")
- **imageUrl**: String (default: "")
- **type**: String (enum: meal_type, cuisine, diet, occasion, cooking_method; required)
- **sortOrder**: Number (default: 0)
- **isActive**: Boolean (default: true)
- **timestamps**: createdAt, updatedAt

## 6. Collection: `chatsessions`
- **userId**: ObjectId (ref: "User", required)
- **title**: String (maxLength: 100, default: "Cuộc trò chuyện mới")
- **messages**: Array of Objects
  - **role**: String (enum: user, assistant, system; required)
  - **content**: String (required)
  - **relatedRecipes**: Array of ObjectIds (ref: "Recipe")
  - **timestamp**: Date (default: Date.now)
- **context_snapshot**: Object
  - **ingredient_ids**: Array of ObjectIds (ref: "Ingredient")
  - **userDiet**: String (default: "omnivore")
  - **userGoals**: String (default: "maintain")
  - **topic**: String (enum: recipe_suggestion, cooking_help, ingredient_substitute, meal_planning, nutrition_advice, general; default: "general")
- **isActive**: Boolean (default: true)
- **timestamps**: createdAt, updatedAt
