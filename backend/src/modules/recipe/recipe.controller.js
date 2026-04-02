import Pantry from "../pantry/pantry.model.js";
import Recipe from "./recipe.model.js";
import { catchAsync } from "../../utils/asyncHandler.util.js";
import { sendResponse } from "../../utils/response.util.js";
import { ApiError } from "../../utils/ApiError.util.js";

// @desc    Gợi ý món ăn thông qua Spoonacular dựa trên Tủ Lạnh
// @route   GET /api/recipes/match
// @access  Private
export const matchRecipes = catchAsync(async (req, res, next) => {
  // 1. Gắp toàn tuyến mảng Đồ ăn trong Pantry của User
  const pantry = await Pantry.findOne({ userId: req.user._id });
  
  if (!pantry || !pantry.items || pantry.items.length === 0) {
    return next(new ApiError(400, "Tủ lạnh của bạn đang trống! Hãy thêm nguyên liệu trước khi gọi AI gợi ý."));
  }

  // Bóc name của nguyên liệu thành 1 chuỗi phân cách bởi dấu phẩy
  // (Spoonacular API findByIngredients yêu cầu danh sách tên ngăn cách bởi dấu phẩy)
  const ingredientNames = pantry.items.map(item => item.name).join(",");

  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return next(new ApiError(500, "Hệ thống bị cấu hình thiếu SPOONACULAR_API_KEY trong file .env"));
  }

  // 2. Bắn mảng này thẳng lên Endpoint API findByIngredients của Spoonacular
  console.log(`📡 Đang gọi Spoonacular AI với nguyên liệu: ${ingredientNames}`);
  
  const spoonacularUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientNames)}&number=10&ranking=1&ignorePantry=false&apiKey=${apiKey}`;
  
  const response = await fetch(spoonacularUrl);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Spoonacular API Error:", errorData);
    return next(new ApiError(502, "Lỗi khi giao tiếp với Spoonacular AI"));
  }
  
  // 3. Hứng list % Match và món ăn từ Spoonacular
  const aiRecipes = await response.json();

  // (Tuỳ chọn: Bạn có thể trộn thêm Recipe Local nếu thích ở đây)
  // ...

  // Trả kết quả về cho Frontend cực kỳ nhàn hạ
  sendResponse(res, 200, "AI đã gợi ý món ăn thành công", aiRecipes);
});
