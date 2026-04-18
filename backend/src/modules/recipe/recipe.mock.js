// [backend/src/modules/recipe/recipe.mock.js]

// Danh sách dùng cho kết quả tìm kiếm theo tủ lạnh (Pantry)
export const MOCK_RECIPES_BY_PANTRY = [
  { id: 1, title: "Pasta with Garlic and Oil", image: "https://spoonacular.com/recipeImages/716429-556x370.jpg", usedIngredientCount: 3, missedIngredientCount: 2, missedIngredients: [{ name: "Parsley" }, { name: "Parmesan" }] },
  { id: 2, title: "Herb Roasted Salmon", image: "https://spoonacular.com/recipeImages/646512-556x370.jpg", usedIngredientCount: 2, missedIngredientCount: 1, missedIngredients: [{ name: "Lemon" }] },
  { id: 3, title: "Chicken Caesar Salad", image: "https://spoonacular.com/recipeImages/715449-556x370.jpg", usedIngredientCount: 4, missedIngredientCount: 1, missedIngredients: [{ name: "Croutons" }] },
  { id: 4, title: "Classic Beef Burger", image: "https://spoonacular.com/recipeImages/635350-556x370.jpg", usedIngredientCount: 3, missedIngredientCount: 3, missedIngredients: [{ name: "Buns" }, { name: "Lettuce" }, { name: "Cheese" }] }
];

// Danh sách 8 món đầy đủ chi tiết cho màn Discovery/Home
export const MOCK_FULL_RECIPES = [
  {
    id: 1,
    title: "Gourmet Pasta Alaglio",
    image: "https://spoonacular.com/recipeImages/716429-556x370.jpg",
    readyInMinutes: 20, servings: 2, difficulty: "Easy",
    summary: "Classic Italian pasta with garlic and premium olive oil.",
    extendedIngredients: [
      { id: 101, originalName: "Spaghetti", amount: 250, unit: "g" },
      { id: 102, originalName: "Garlic", amount: 4, unit: "cloves" },
      { id: 103, originalName: "Olive Oil", amount: 60, unit: "ml" }
    ],
    analyzedInstructions: [{ steps: [{ number: 1, step: "Boil water and cook pasta." }, { number: 2, step: "Sauté garlic in oil." }, { number: 3, step: "Mix and serve." }] }]
  },
  {
    id: 2,
    title: "Lemon Herb Salmon",
    image: "https://spoonacular.com/recipeImages/646512-556x370.jpg",
    readyInMinutes: 25, servings: 1, difficulty: "Medium",
    summary: "Fresh salmon steak seasoned with zesty lemon and herbs.",
    extendedIngredients: [
      { id: 201, originalName: "Salmon Fillet", amount: 200, unit: "g" },
      { id: 202, originalName: "Lemon", amount: 1, unit: "pcs" },
      { id: 203, originalName: "Rosemary", amount: 2, unit: "sprigs" }
    ],
    analyzedInstructions: [{ steps: [{ number: 1, step: "Preheat oven to 200C." }, { number: 2, step: "Season salmon." }, { number: 3, step: "Bake for 15 mins." }] }]
  },
  {
    id: 3,
    title: "Chicken Caesar Salad",
    image: "https://spoonacular.com/recipeImages/715449-556x370.jpg",
    readyInMinutes: 15, servings: 2, difficulty: "Easy",
    summary: "Crispy romaine lettuce topped with grilled chicken and dressing.",
    extendedIngredients: [
      { id: 301, originalName: "Chicken Breast", amount: 150, unit: "g" },
      { id: 302, originalName: "Romaine Lettuce", amount: 1, unit: "head" },
      { id: 303, originalName: "Caesar Dressing", amount: 50, unit: "ml" }
    ],
    analyzedInstructions: [{ steps: [{ number: 1, step: "Grill chicken." }, { number: 2, step: "Chop lettuce." }, { number: 3, step: "Toss with dressing." }] }]
  },
  {
    id: 4,
    title: "Juicy Beef Burger",
    image: "https://spoonacular.com/recipeImages/635350-556x370.jpg",
    readyInMinutes: 30, servings: 1, difficulty: "Medium",
    summary: "Home-made beef burger with fresh toppings.",
    extendedIngredients: [
      { id: 401, originalName: "Ground Beef", amount: 180, unit: "g" },
      { id: 402, originalName: "Burger Bun", amount: 1, unit: "pc" },
      { id: 403, originalName: "Cheddar Cheese", amount: 1, unit: "slice" }
    ],
    analyzedInstructions: [{ steps: [{ number: 1, step: "Form beef patty." }, { number: 2, step: "Grill for 5 mins each side." }, { number: 3, step: "Assemble burger." }] }]
  },
  {
    id: 6,
    title: "Creamy Mushroom Risotto",
    image: "https://spoonacular.com/recipeImages/641803-556x370.jpg",
    readyInMinutes: 45, servings: 3, difficulty: "Hard",
    summary: "Rich and creamy Italian rice dish with earthy mushrooms.",
    extendedIngredients: [
      { id: 601, originalName: "Arborio Rice", amount: 200, unit: "g" },
      { id: 602, originalName: "Mushrooms", amount: 150, unit: "g" },
      { id: 603, originalName: "Vegetable Stock", amount: 500, unit: "ml" }
    ],
    analyzedInstructions: [{ steps: [{ number: 1, step: "Sauté mushrooms." }, { number: 2, step: "Add rice and toast." }, { number: 3, step: "Slowly add stock while stirring." }] }]
  },
  {
    id: 7,
    title: "Spicy Shrimp Tacos",
    image: "https://spoonacular.com/recipeImages/663051-556x370.jpg",
    readyInMinutes: 20, servings: 2, difficulty: "Medium",
    summary: "Soft tacos filled with seasoned shrimp and fresh lime.",
    extendedIngredients: [
      { id: 701, originalName: "Shrimp", amount: 200, unit: "g" },
      { id: 702, originalName: "Taco Shells", amount: 4, unit: "pcs" },
      { id: 703, originalName: "Chili Powder", amount: 1, unit: "tsp" }
    ],
    analyzedInstructions: [{ steps: [{ number: 1, step: "Season shrimp." }, { number: 2, step: "Sear shrimp until pink." }, { number: 3, step: "Fill tacos." }] }]
  },
  {
    id: 8,
    title: "Avocado Egg Toast",
    image: "https://spoonacular.com/recipeImages/633167-556x370.jpg",
    readyInMinutes: 10, servings: 1, difficulty: "Easy",
    summary: "Simple and high-protein breakfast choice.",
    extendedIngredients: [
      { id: 801, originalName: "Sourdough Bread", amount: 1, unit: "slice" },
      { id: 802, originalName: "Avocado", amount: 0.5, unit: "pcs" },
      { id: 803, originalName: "Egg", amount: 1, unit: "pc" }
    ],
    analyzedInstructions: [{ steps: [{ number: 1, step: "Toast bread." }, { number: 2, step: "Mash avocado on toast." }, { number: 3, step: "Top with poached egg." }] }]
  },
  {
    id: 9,
    title: "Garden Vegetable Soup",
    image: "https://spoonacular.com/recipeImages/664394-556x370.jpg",
    readyInMinutes: 40, servings: 4, difficulty: "Easy",
    summary: "Warm and comforting soup filled with garden veggies.",
    extendedIngredients: [
      { id: 901, originalName: "Carrots", amount: 2, unit: "pcs" },
      { id: 902, originalName: "Potatoes", amount: 2, unit: "pcs" },
      { id: 903, originalName: "Celery", amount: 1, unit: "stalk" }
    ],
    analyzedInstructions: [{ steps: [{ number: 1, step: "Dice all vegetables." }, { number: 2, step: "Simmer in stock for 30 mins." }, { number: 3, step: "Season and serve." }] }]
  }
];
