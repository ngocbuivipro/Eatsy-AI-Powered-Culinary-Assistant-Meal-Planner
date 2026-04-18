// [backend/src/modules/recipe/recipe.service.js]
import Recipe from "./recipe.model.js";
import User from "../user/user.model.js";
import { ApiError } from "../../utils/ApiError.util.js";
import { MESSAGES } from "../../constants/messages.js";
import config from "../../config/index.js";
import * as RecipeMock from "./recipe.mock.js";

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
  // --- MOCK OVERRIDE ---
  if (config.spoonacular.useMock) {
    console.log("🛠️  [Recipe Service] Using Mock Data for matchByPantry");
    return RecipeMock.MOCK_RECIPES_BY_PANTRY;
  }

  let ingredientNames = customIngredients;
  const userPrefs = userId ? await User.findById(userId) : null;

  if (!ingredientNames) {
    throw new ApiError(400, "Ingredients are required for matching. Please select at least one.");
  }

  const apiKey = config.spoonacular.apiKey;
  // Sử dụng complexSearch để hỗ trợ filter diet/excludeIngredients cùng với ingredients
  let url = `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${encodeURIComponent(ingredientNames)}&number=10&addRecipeInformation=true&fillIngredients=true&apiKey=${apiKey}`;

  if (userPrefs) {
    if (userPrefs.dietaryPreferences?.dietType && userPrefs.dietaryPreferences.dietType !== 'omnivore') {
      url += `&diet=${userPrefs.dietaryPreferences.dietType}`;
    }
    if (userPrefs.dietaryPreferences?.allergies?.length > 0) {
      url += `&excludeIngredients=${encodeURIComponent(userPrefs.dietaryPreferences.allergies.join(","))}`;
    }
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Spoonacular limit reached");
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    return []; 
  }
};

export const getDiscovery = async (type, system = 'metric', userId = null) => {
  // --- MOCK OVERRIDE ---
  if (config.spoonacular.useMock) {
    console.log("🛠️  [Recipe Service] Using Mock Data for getDiscovery");
    return RecipeMock.MOCK_FULL_RECIPES.map(r => ({
      ...r,
      extendedIngredients: formatIngredientsBySystem(r.extendedIngredients, system)
    }));
  }

  const user = userId ? await User.findById(userId) : null;
  const apiKey = config.spoonacular.apiKey;
  
  let url = `https://api.spoonacular.com/recipes/complexSearch?type=${type || ""}&sort=popularity&number=20&addRecipeInformation=true&fillIngredients=true&apiKey=${apiKey}`;

  if (user) {
    if (user.dietaryPreferences?.dietType && user.dietaryPreferences.dietType !== 'omnivore') {
      url += `&diet=${user.dietaryPreferences.dietType}`;
    }
    if (user.dietaryPreferences?.allergies?.length > 0) {
      url += `&excludeIngredients=${encodeURIComponent(user.dietaryPreferences.allergies.join(","))}`;
    }
    if (user.dietaryPreferences?.cuisinePreferences?.length > 0) {
      // Gợi ý món theo list cuisine ưu thích của user
      url += `&cuisine=${encodeURIComponent(user.dietaryPreferences.cuisinePreferences.join(","))}`;
    }
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Spoonacular limit reached");
    const data = await response.json();
    
    return data.results.map(r => ({
      ...r,
      extendedIngredients: formatIngredientsBySystem(r.extendedIngredients, system)
    }));
  } catch (error) {
    return [];
  }
};

export const getDetails = async (id, system = 'metric') => {
  // --- MOCK OVERRIDE ---
  if (config.spoonacular.useMock) {
    console.log(`🛠️  [Recipe Service] Using Mock Data for getDetails ID: ${id}`);
    
    // Tìm món ăn tương ứng với ID trong danh sách Mock
    const mockRecipe = RecipeMock.MOCK_FULL_RECIPES.find(r => r.id.toString() === id.toString());
    
    // Nếu không thấy thì lấy món đầu tiên làm mặc định
    const recipeToReturn = mockRecipe || RecipeMock.MOCK_FULL_RECIPES[0];

    return {
      ...recipeToReturn,
      extendedIngredients: formatIngredientsBySystem(recipeToReturn.extendedIngredients, system)
    };
  }

  const apiKey = config.spoonacular.apiKey;
  const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Spoonacular limit reached");
    const data = await response.json();
    data.extendedIngredients = formatIngredientsBySystem(data.extendedIngredients, system);
    return data;
  } catch (error) {
    return null;
  }
};
