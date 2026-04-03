import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/database.js";
import Recipe from "../modules/recipe/recipe.model.js";
import User from "../modules/user/user.model.js";
import Pantry from "../modules/pantry/pantry.model.js";
import Category from "../modules/category/category.model.js";
import { hashPassword } from "../utils/password.util.js";

dotenv.config();

const sampleRecipes = [
  {
    title: "Classic Spaghetti Carbonara",
    description:
      "Creamy Italian pasta with eggs, cheese, pancetta, and pepper. Perfect for quick weeknight comfort food.",
    author: null,
    source: "spoonacular",
    spoonacularId: 314159,
    spoonacularIngredientIds: [1001, 1123, 1082047, 9156],
    ingredients: [
      { name: "spaghetti", quantity: 400, unit: "g" },
      { name: "pancetta", quantity: 150, unit: "g" },
      { name: "egg yolk", quantity: 4, unit: "piece" },
      { name: "parmesan cheese", quantity: 80, unit: "g" },
      { name: "black pepper", quantity: 1.5, unit: "tsp" },
      { name: "sea salt", quantity: 1, unit: "tsp", isOptional: true },
    ],
    steps: [
      {
        order: 1,
        instruction:
          "Cook spaghetti in salted boiling water until al dente according to package instructions.",
        duration: 10,
      },
      {
        order: 2,
        instruction:
          "In a pan, cook pancetta until crisp and golden. Remove from heat.",
        duration: 8,
      },
      {
        order: 3,
        instruction:
          "Whisk egg yolks with grated parmesan and black pepper in a bowl.",
        duration: 3,
      },
      {
        order: 4,
        instruction:
          "Drain pasta, reserving 1 cup of cooking water. Toss hot spaghetti with pancetta and egg mixture off the heat.",
        duration: 2,
      },
      {
        order: 5,
        instruction:
          "Add a little reserved water to reach creamy consistency, adjust salt and pepper, then serve immediately.",
        duration: 2,
      },
    ],
    categories: [],
    difficulty: "easy",
    mealType: ["lunch", "dinner"],
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    nutrition: {
      calories: 520,
      protein: 22,
      carbohydrates: 60,
      fat: 22,
      fiber: 3,
    },
    imageUrl:
      "https://images.unsplash.com/photo-1512058564366-c9e8ad20f3bb?auto=format&fit=crop&w=1200&q=80",
    tags: ["italian", "pasta", "comfort food"],
    isPublished: true,
  },
  {
    title: "Mediterranean Quinoa Salad",
    description:
      "Light, protein-rich quinoa salad with cucumber, tomatoes, feta, and lemon-herb dressing.",
    author: null,
    source: "user",
    spoonacularId: 314160,
    spoonacularIngredientIds: [11124, 11215, 11477, 1001],
    ingredients: [
      { name: "quinoa", quantity: 200, unit: "g" },
      { name: "cucumber", quantity: 1, unit: "piece" },
      { name: "cherry tomatoes", quantity: 250, unit: "g" },
      { name: "feta cheese", quantity: 120, unit: "g" },
      { name: "red onion", quantity: 0.5, unit: "piece", isOptional: true },
      { name: "olive oil", quantity: 3, unit: "tbsp" },
      { name: "lemon juice", quantity: 2, unit: "tbsp" },
      { name: "fresh parsley", quantity: 3, unit: "tbsp" },
    ],
    steps: [
      { order: 1, instruction: "Rinse quinoa and cook with 2 cups water until fluffy.", duration: 15 },
      {
        order: 2,
        instruction:
          "Chop cucumber, tomatoes, red onion, and parsley; crumble the feta.",
        duration: 8,
      },
      {
        order: 3,
        instruction:
          "Whisk olive oil, lemon juice, salt and pepper; toss all ingredients together.",
        duration: 4,
      },
      { order: 4, instruction: "Chill 10 minutes and serve.", duration: 10 },
    ],
    categories: [],
    difficulty: "easy",
    mealType: ["lunch", "dinner", "snack"],
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    nutrition: {
      calories: 320,
      protein: 10,
      carbohydrates: 38,
      fat: 14,
      fiber: 6,
    },
    imageUrl:
      "https://images.unsplash.com/photo-1562967916-eb82221dfb3f?auto=format&fit=crop&w=1200&q=80",
    tags: ["vegetarian", "gluten-free", "healthy"],
    isPublished: true,
  },
];

const sampleCategories = [
  {
    name: "Breakfast",
    spoonacularTag: "breakfast",
    tagType: "type",
    imageUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80",
    sortOrder: 1,
  },
  {
    name: "Vegetarian",
    spoonacularTag: "vegetarian",
    tagType: "diet",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    sortOrder: 2,
  },
  {
    name: "Italian",
    spoonacularTag: "italian",
    tagType: "cuisine",
    imageUrl: "https://images.unsplash.com/photo-1498579127083-f7451307b897?auto=format&fit=crop&w=800&q=80",
    sortOrder: 3,
  },
  {
    name: "Main Course",
    spoonacularTag: "main course",
    tagType: "type",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    sortOrder: 4,
  },
  {
    name: "Dessert",
    spoonacularTag: "dessert",
    tagType: "type",
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
    sortOrder: 5,
  },
];

const samplePantryUser = {
  name: "Seed User",
  email: "seed.user@example.com",
  password: "password123",
};

const samplePantry = {
  items: [
    { spoonacularId: 1123, name: "egg", amount: 12, unit: "piece", imageUrl: "" },
    { spoonacularId: 14412, name: "spaghetti", amount: 1, unit: "pack", imageUrl: "" },
    { spoonacularId: 1001, name: "butter", amount: 200, unit: "g", imageUrl: "" },
    { spoonacularId: 11215, name: "cucumber", amount: 2, unit: "piece", imageUrl: "" },
    { spoonacularId: 11124, name: "quinoa", amount: 500, unit: "g", imageUrl: "" },
  ],
};

async function seed() {
  try {
    await connectDB();

    console.log("Clearing Recipe/User/Pantry/Category collections...");
    await Recipe.deleteMany();
    await Pantry.deleteMany();
    await Category.deleteMany();
    await User.deleteMany({ email: samplePantryUser.email });

    console.log("Creating seed user...");
    const hashedPwd = await hashPassword(samplePantryUser.password);
    const user = await User.create({ ...samplePantryUser, password: hashedPwd });

    console.log("Preparing seeded pantry items...");
    await Pantry.create({ userId: user._id, items: samplePantry.items });

    console.log("Inserting sample recipe documents...");
    await Recipe.create(sampleRecipes);

    console.log("Inserting sample category documents...");
    await Category.create(sampleCategories);

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
