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

// @desc    Gợi ý món ăn thông qua Spoonacular dựa trên Tủ Lạnh
// @route   GET /api/recipes/match
// @access  Private
export const matchRecipes = catchAsync(async (req, res, next) => {
  // 1. Gắp toàn tuyến mảng Đồ Ăn trong Pantry của User
  const pantry = await Pantry.findOne({ userId: req.user._id });

  if (!pantry || !pantry.items || pantry.items.length === 0) {
    return next(
      new ApiError(
        400,
        "Tủ lạnh của bạn đang trống! Hãy thêm nguyên liệu trước khi gọi AI gợi ý."
      )
    );
  }

  // Bóc name của nguyên liệu thành 1 chuỗi phân cách bởi dấu phẩy
  // (Spoonacular API findByIngredients yêu cầu danh sách tên ngăn cách bởi dấu phẩy)
  const ingredientNames = pantry.items.map((item) => item.name).join(",");

  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return next(
      new ApiError(
        500,
        "Hệ thống bị cấu hình thiếu SPOONACULAR_API_KEY trong file .env"
      )
    );
  }

  // 2. Bắn mảng này thẳng lên Endpoint API findByIngredients của Spoonacular
  console.log(`Đang gọi Spoonacular AI với nguyên liệu: ${ingredientNames}`);

  const spoonacularUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientNames)}&number=10&ranking=1&ignorePantry=false&apiKey=${apiKey}`;

  const response = await fetch(spoonacularUrl);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Spoonacular API Error:", errorData);
    return next(new ApiError(502, "Lỗi khi giao tiếp với Spoonacular AI"));
  }

  // 3. Hứng list % Match và món ăn từ Spoonacular
  const aiRecipes = await response.json();

  // (Tùy chọn: Bạn có thể trộn thêm Recipe Local nếu thích ở đây)
  // ...

  // Trả kết quả về cho Frontend cực kỳ nhàn hạ
  return sendResponse(res, 200, "AI đã gợi ý món ăn thành công", aiRecipes);
});
