import Category from "./category.model.js";
import { catchAsync } from "../../utils/asyncHandler.util.js";
import { sendResponse } from "../../utils/response.util.js";

// @desc    Lấy danh sách category đang hoạt động, sắp xếp theo thứ tự hiển thị
// @route   GET /api/categories
// @access  Public
export const getActiveCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .select("_id name spoonacularTag tagType imageUrl sortOrder isActive")
    .lean();

  return sendResponse(res, 200, "Lấy danh sách danh mục thành công", {
    categories,
  });
});
