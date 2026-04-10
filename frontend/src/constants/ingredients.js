// Curated list of common ingredients to avoid overwhelming the user
// Each ingredient has a spoonacularName which matches the Spoonacular API

export const INGREDIENT_CATEGORIES = [
  {
    id: 'meat',
    name: 'Meat',
    icon: '🍖',
    items: [
      { id: 'pork', name: 'Pork', spoonacularName: 'pork' },
      { id: 'beef', name: 'Beef', spoonacularName: 'beef' },
      { id: 'chicken', name: 'Chicken', spoonacularName: 'chicken' },
      { id: 'bacon', name: 'Bacon', spoonacularName: 'bacon' },
    ]
  },
  {
    id: 'seafood',
    name: 'Seafood',
    icon: '🐟',
    items: [
      { id: 'shrimp', name: 'Shrimp', spoonacularName: 'shrimp' },
      { id: 'fish', name: 'Fish', spoonacularName: 'fish' },
      { id: 'salmon', name: 'Salmon', spoonacularName: 'salmon' },
    ]
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    icon: '🥦',
    items: [
      { id: 'carrot', name: 'Carrot', spoonacularName: 'carrot' },
      { id: 'tomato', name: 'Tomato', spoonacularName: 'tomato' },
      { id: 'onion', name: 'Onion', spoonacularName: 'onion' },
      { id: 'potato', name: 'Potato', spoonacularName: 'potato' },
      { id: 'garlic', name: 'Garlic', spoonacularName: 'garlic' },
      { id: 'ginger', name: 'Ginger', spoonacularName: 'ginger' },
      { id: 'cabbage', name: 'Cabbage', spoonacularName: 'cabbage' },
      { id: 'broccoli', name: 'Broccoli', spoonacularName: 'broccoli' },
    ]
  },
  {
    id: 'dairy',
    name: 'Dairy & Eggs',
    icon: '🥚',
    items: [
      { id: 'egg', name: 'Egg', spoonacularName: 'egg' },
      { id: 'milk', name: 'Milk', spoonacularName: 'milk' },
      { id: 'butter', name: 'Butter', spoonacularName: 'butter' },
      { id: 'cheese', name: 'Cheese', spoonacularName: 'cheese' },
    ]
  },
  {
    id: 'fruits',
    name: 'Fruits',
    icon: '🍎',
    items: [
      { id: 'apple', name: 'Apple', spoonacularName: 'apple' },
      { id: 'banana', name: 'Banana', spoonacularName: 'banana' },
      { id: 'lemon', name: 'Lemon', spoonacularName: 'lemon' },
      { id: 'lime', name: 'Lime', spoonacularName: 'lime' },
    ]
  },
  {
    id: 'pantry',
    name: 'Pantry Staples',
    icon: '🧂',
    items: [
      { id: 'rice', name: 'Rice', spoonacularName: 'rice' },
      { id: 'flour', name: 'Flour', spoonacularName: 'flour' },
      { id: 'sugar', name: 'Sugar', spoonacularName: 'sugar' },
      { id: 'salt', name: 'Salt', spoonacularName: 'salt' },
      { id: 'pepper', name: 'Black Pepper', spoonacularName: 'pepper' },
      { id: 'oil', name: 'Cooking Oil', spoonacularName: 'oil' },
    ]
  }
];
