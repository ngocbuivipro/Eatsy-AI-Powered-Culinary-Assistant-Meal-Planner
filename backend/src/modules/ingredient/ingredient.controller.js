import { catchAsync } from "../../utils/asyncHandler.util.js";
import { sendResponse } from "../../utils/response.util.js";
import { ApiError } from "../../utils/ApiError.util.js";

// @desc    Tìm kiếm nguyên liệu từ Spoonacular API
// @route   GET /api/ingredients/search?query=...
// @access  Private
export const searchIngredients = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  
  if (!query) {
    return next(new ApiError(400, "Vui lòng nhập từ khóa tìm kiếm"));
  }

  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!apiKey) {
    return next(new ApiError(500, "Thiếu API Key của Spoonacular"));
  }

  // Gọi Spoonacular Autocomplete API for ingredients
  const url = `https://api.spoonacular.com/food/ingredients/autocomplete?query=${encodeURIComponent(query)}&number=10&metaInformation=true&apiKey=${apiKey}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    return next(new ApiError(502, "Lỗi kết nối Spoonacular"));
  }

  const data = await response.json();
  
  // Transform data chuẩn bị cho App
  const results = data.map(item => ({
    spoonacularId: item.id,
    name: item.name,
    imageUrl: item.image ? `https://spoonacular.com/cdn/ingredients_100x100/${item.image}` : "",
    possibleUnits: item.possibleUnits || ["piece"]
  }));

  return sendResponse(res, 200, "Tìm kiếm thành công", { results });
});
