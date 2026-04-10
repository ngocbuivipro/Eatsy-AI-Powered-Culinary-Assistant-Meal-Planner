import Pantry from "./pantry.model.js";
import { catchAsync } from "../../utils/asyncHandler.util.js";
import { sendResponse } from "../../utils/response.util.js";
import { ApiError } from "../../utils/ApiError.util.js";

// [GET] /api/pantry — Lấy tủ lạnh của user hiện tại
export const getPantry = catchAsync(async (req, res) => {
  let pantry = await Pantry.findOne({ userId: req.user._id });

  // Nếu chưa có tủ -> tự tạo 1 tủ rỗng cho user
  if (!pantry) {
    pantry = await Pantry.create({ userId: req.user._id, items: [] });
  }

  return sendResponse(res, 200, "Lấy pantry thành công", { pantry });
});

// [POST] /api/pantry — Thêm 1 nguyên liệu vào tủ
export const addPantryItem = catchAsync(async (req, res) => {
  const { spoonacularId, name, amount, unit, imageUrl } = req.body;

  if (!spoonacularId || !name) {
    throw new ApiError(400, "Thiếu spoonacularId hoặc name của nguyên liệu");
  }

  const pantry = await Pantry.findOneAndUpdate(
    { userId: req.user._id },
    { $push: { items: { spoonacularId, name, amount, unit, imageUrl } } },
    { new: true, upsert: true } // upsert: tự tạo mới nếu chưa có tủ
  );

  return sendResponse(res, 201, "Thêm nguyên liệu thành công", { pantry });
});

// [DELETE] /api/pantry/:itemId — Xóa 1 nguyên liệu khỏi tủ
export const removePantryItem = catchAsync(async (req, res) => {
  const { itemId } = req.params;

  // Kiểm tra pantry tồn tại và item có trong tủ không
  const pantry = await Pantry.findOne({ userId: req.user._id });

  if (!pantry) {
    throw new ApiError(404, "Không tìm thấy pantry của người dùng");
  }

  const itemExists = pantry.items.some((item) => item._id.toString() === itemId);

  if (!itemExists) {
    throw new ApiError(404, "Không tìm thấy nguyên liệu trong tủ lạnh");
  }

  // Item tồn tại → mới thực sự xóa
  await pantry.updateOne({ $pull: { items: { _id: itemId } } });
  await pantry.save();

  const updatedPantry = await Pantry.findOne({ userId: req.user._id });

  return sendResponse(res, 200, "Xóa nguyên liệu thành công", { pantry: updatedPantry });
});

// [DELETE] /api/pantry — Làm trống tủ lạnh hoàn toàn
export const clearPantry = catchAsync(async (req, res, next) => {
  const pantry = await Pantry.findOne({ userId: req.user._id });
  if (!pantry) {
    throw new ApiError(404, "Không tìm thấy pantry của người dùng");
  }

  pantry.items = [];
  await pantry.save();

  return sendResponse(res, 200, "Đã dọn sạch tủ lạnh", { pantry });
});
