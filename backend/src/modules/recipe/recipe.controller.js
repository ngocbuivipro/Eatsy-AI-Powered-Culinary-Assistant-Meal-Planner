// [backend/src/modules/recipe/recipe.controller.js]
import * as recipeService from "./recipe.service.js";
import { RecipeResponseDTO, RecipeListDTO } from "./recipe.dto.js";
import { catchAsync } from "../../utils/asyncHandler.util.js";
import { sendResponse } from "../../utils/response.util.js";
import { MESSAGES } from "../../constants/messages.js";

export const createRecipe = catchAsync(async (req, res) => {
  const recipe = await recipeService.create(req.body, req.user._id);
  
  return sendResponse(
    res, 
    201, 
    MESSAGES.RECIPE.CREATE_SUCCESS, 
    { recipe: RecipeResponseDTO(recipe) }
  );
});

export const matchRecipes = catchAsync(async (req, res) => {
  const { ingredients } = req.query;
  const recipes = await recipeService.matchByPantry(req.user?._id, ingredients);
  
  return sendResponse(
    res, 
    200, 
    MESSAGES.RECIPE.MATCH_SUCCESS, 
    RecipeListDTO(recipes)
  );
});

export const getRandomRecipes = catchAsync(async (req, res) => {
  const { type } = req.query;
  const system = req.user?.measurementSystem || 'metric';
  const userId = req.user?._id;
  
  const recipes = await recipeService.getDiscovery(type, system, userId);
  
  return sendResponse(
    res, 
    200, 
    MESSAGES.RECIPE.FETCH_SUCCESS, 
    { 
      recipes: RecipeListDTO(recipes),
      mealType: type || "popular"
    }
  );
});

export const getRecipeDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  const system = req.user?.measurementSystem || 'metric';
  
  const recipe = await recipeService.getDetails(id, system);

  return sendResponse(
    res, 
    200, 
    MESSAGES.RECIPE.FETCH_SUCCESS, 
    { recipe: RecipeResponseDTO(recipe) }
  );
});
