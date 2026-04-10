import Pantry from "../pantry/pantry.model.js";
import Recipe from "./recipe.model.js";
import { catchAsync } from "../../utils/asyncHandler.util.js";
import { sendResponse } from "../../utils/response.util.js";
import { ApiError } from "../../utils/ApiError.util.js";

export const createRecipe = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    ingredients,
    steps,
    categories,
    difficulty,
    mealType,
    prepTime,
    cookTime,
    servings,
    nutrition,
    imageUrl,
    tags,
  } = req.body;

  if (
    !title ||
    !description ||
    ingredients === undefined ||
    steps === undefined ||
    prepTime === undefined ||
    cookTime === undefined ||
    servings === undefined
  ) {
    throw new ApiError(
      400,
      "Vui lòng nhập đầy đủ tên món ăn, mô tả, nguyên liệu, các bước thực hiện, thời gian chuẩn bị, thời gian nấu và khẩu phần"
    );
  }

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    throw new ApiError(400, "Công thức phải có ít nhất 1 nguyên liệu");
  }

  if (!Array.isArray(steps) || steps.length === 0) {
    throw new ApiError(400, "Công thức phải có ít nhất 1 bước thực hiện");
  }

  const recipe = await Recipe.create({
    title,
    description,
    ingredients,
    steps,
    categories,
    difficulty,
    mealType,
    prepTime,
    cookTime,
    servings,
    nutrition,
    imageUrl,
    tags,
    author: req.user._id,
    source: "user",
  });

  return sendResponse(res, 201, "Tạo công thức thành công", { recipe });
});

// @desc    Gợi ý món ăn thông qua Spoonacular
// @route   GET /api/recipes/match?ingredients=...
// @access  Private
export const matchRecipes = catchAsync(async (req, res, next) => {
  let ingredientNames = "";
  const { ingredients } = req.query;

  // 1. Kiểm tra xem Frontend có gửi danh sách nguyên liệu lên không
  if (ingredients) {
    ingredientNames = ingredients;
  } else {
    // Nếu không gửi, lấy từ Tủ lạnh của User trong Database (Yêu cầu đăng nhập)
    if (!req.user) {
      return next(
        new ApiError(
          401,
          "Vui lòng chọn nguyên liệu hoặc đăng nhập để lấy từ tủ lạnh của bạn."
        )
      );
    }

    const pantry = await Pantry.findOne({ userId: req.user._id });
    if (!pantry || !pantry.items || pantry.items.length === 0) {
      return next(
        new ApiError(
          400,
          "Tủ lạnh của bạn đang trống! Hãy chọn nguyên liệu hoặc thêm vào tủ lạnh trước."
        )
      );
    }
    ingredientNames = pantry.items.map((item) => item.name).join(",");
  }

  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return next(new ApiError(500, "Thiếu API Key của Spoonacular"));
  }

  // 2. Gọi Spoonacular API findByIngredients
  console.log(`Đang gọi Spoonacular Match với: ${ingredientNames}`);

  const spoonacularUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientNames)}&number=10&ranking=1&ignorePantry=false&apiKey=${apiKey}`;

  const response = await fetch(spoonacularUrl);

  if (!response.ok) {
    return next(new ApiError(502, "Lỗi khi giao tiếp với Spoonacular AI"));
  }

  const aiRecipes = await response.json();

  return sendResponse(res, 200, "Gợi ý món ăn thành công", aiRecipes);
});

// @desc    Lấy món ăn ngẫu nhiên/phổ biến theo loại bữa ăn (Home Feed)
// @route   GET /api/recipes/random?type=...
// @access  Private
export const getRandomRecipes = catchAsync(async (req, res, next) => {
  const { type } = req.query; // type: breakfast, lunch, dinner, snack, main course...
  
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return next(new ApiError(500, "Thiếu API Key của Spoonacular"));
  }

  // Sử dụng complexSearch để lấy các món phổ biến theo loại bữa ăn
  // Nếu không có type, nó sẽ lấy các món phổ biến ngẫu nhiên
  const url = `https://api.spoonacular.com/recipes/complexSearch?type=${type || ""}&sort=popularity&number=20&addRecipeInformation=true&fillIngredients=true&apiKey=${apiKey}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    return next(new ApiError(502, "Lỗi khi lấy danh sách món ăn từ Spoonacular"));
  }

  const data = await response.json();
  
  return sendResponse(res, 200, "Lấy danh sách món ăn thành công", { 
    recipes: data.results,
    mealType: type || "popular"
  });
});

// @desc    Lấy chi tiết 1 món ăn từ Spoonacular (Instructions, Ingredients, Nutrition)
// @route   GET /api/recipes/:id/details
// @access  Private
export const getRecipeDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return next(new ApiError(500, "Thiếu API Key của Spoonacular"));
  }

  const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    return next(new ApiError(502, "Lỗi khi lấy chi tiết món ăn từ Spoonacular"));
  }

  const recipeDetails = await response.json();
  
  return sendResponse(res, 200, "Lấy chi tiết món ăn thành công", { recipe: recipeDetails });
});
