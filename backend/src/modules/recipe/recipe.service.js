// [backend/src/modules/recipe/recipe.service.js]
import Recipe from "./recipe.model.js";
import Pantry from "../pantry/pantry.model.js";
import { ApiError } from "../../utils/ApiError.util.js";
import { MESSAGES } from "../../constants/messages.js";
import config from "../../config/index.js";

// Helper chuyển đổi đơn vị đo lường (Metric/Imperial)
export const formatIngredientsBySystem = (ingredients, system = 'metric') => {
  if (!ingredients) return ingredients;
  
  return ingredients.map(ing => {
    if (ing.measures) {
      const measure = system === 'imperial' ? ing.measures.us : ing.measures.metric;
      return {
        ...ing,
        amount: measure.amount,
        unit: measure.unitShort
      };
    }

    if (system === 'imperial') {
      let newAmount = ing.amount;
      let newUnit = ing.unit;

      if (ing.unit === 'g') {
        newAmount = ing.amount / 28.35;
        newUnit = 'oz';
      } else if (ing.unit === 'ml') {
        newAmount = ing.amount / 29.574;
        newUnit = 'fl oz';
      } else if (ing.unit === 'kg') {
        newAmount = ing.amount * 2.205;
        newUnit = 'lb';
      }
      
      return {
        ...ing,
        amount: parseFloat(newAmount.toFixed(1)),
        unit: newUnit
      };
    }

    return ing;
  });
};

export const create = async (recipeData, authorId) => {
  const { title, description, ingredients, steps, ...rest } = recipeData;

  if (!title || !description || !ingredients || !steps) {
    throw new ApiError(400, MESSAGES.RECIPE.MISSING_FIELDS);
  }

  return await Recipe.create({
    ...recipeData,
    author: authorId,
    source: "user",
  });
};

export const matchByPantry = async (userId, customIngredients) => {
  let ingredientNames = customIngredients;

  if (!ingredientNames) {
    if (!userId) throw new ApiError(401, MESSAGES.AUTH.NOT_AUTHENTICATED);

    const pantry = await Pantry.findOne({ userId });
    if (!pantry || !pantry.items || pantry.items.length === 0) {
      throw new ApiError(400, "Your pantry is empty! Add items or specify ingredients.");
    }
    ingredientNames = pantry.items.map(item => item.name).join(",");
  }

  const apiKey = config.spoonacular.apiKey;
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientNames)}&number=10&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Spoonacular limit reached");
    return await response.json();
  } catch (error) {
    // Return Mock Data as fallback (Stay compliant with UI needs)
    return [
      {
        id: 646512,
        title: "Herb Roasted Salmon (Mock)",
        image: "https://spoonacular.com/recipeImages/646512-556x370.jpg",
        usedIngredientCount: 2,
        missedIngredientCount: 1,
        missedIngredients: [{ name: "Lemon" }]
      }
    ];
  }
};

export const getDiscovery = async (type, system = 'metric') => {
  const apiKey = config.spoonacular.apiKey;
  const url = `https://api.spoonacular.com/recipes/complexSearch?type=${type || ""}&sort=popularity&number=20&addRecipeInformation=true&fillIngredients=true&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Spoonacular limit reached");
    const data = await response.json();
    
    return data.results.map(r => ({
      ...r,
      extendedIngredients: formatIngredientsBySystem(r.extendedIngredients, system)
    }));
  } catch (error) {
    // Return Mock Data
    return [
      {
        id: 716429,
        title: "Pasta with Garlic and Oil (Mock)",
        image: "https://spoonacular.com/recipeImages/716429-556x370.jpg",
        readyInMinutes: 15,
        servings: 4,
        extendedIngredients: formatIngredientsBySystem([
          { originalName: "Pasta", amount: 200, unit: "g" }
        ], system)
      }
    ];
  }
};

export const getDetails = async (id, system = 'metric') => {
  const apiKey = config.spoonacular.apiKey;
  const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Spoonacular limit reached");
    const data = await response.json();
    data.extendedIngredients = formatIngredientsBySystem(data.extendedIngredients, system);
    return data;
  } catch (error) {
    return {
      id,
      title: "Recipe Details (Mock Fallback)",
      extendedIngredients: formatIngredientsBySystem([], system),
      analyzedInstructions: [{ steps: [{ number: 1, step: "Cook it." }] }]
    };
  }
};
