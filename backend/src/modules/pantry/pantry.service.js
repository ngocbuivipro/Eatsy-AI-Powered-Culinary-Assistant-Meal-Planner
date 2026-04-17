// [backend/src/modules/pantry/pantry.service.js]
import Pantry from "./pantry.model.js";
import { ApiError } from "../../utils/ApiError.util.js";
import { MESSAGES } from "../../constants/messages.js";

export const getByUser = async (userId) => {
  let pantry = await Pantry.findOne({ userId });
  if (!pantry) {
    pantry = await Pantry.create({ userId, items: [] });
  }
  return pantry;
};

export const addItem = async (userId, itemData) => {
  const { spoonacularId, name, amount, unit, imageUrl } = itemData;

  if (!spoonacularId || !name) {
    throw new ApiError(400, "Missing ingredient ID or name.");
  }

  const pantry = await Pantry.findOneAndUpdate(
    { userId },
    { $push: { items: { spoonacularId, name, amount, unit, imageUrl } } },
    { new: true, upsert: true }
  );
  return pantry;
};

export const removeItem = async (userId, itemId) => {
  const pantry = await Pantry.findOne({ userId });

  if (!pantry) {
    throw new ApiError(404, MESSAGES.PANTRY.NOT_FOUND || "Pantry not found.");
  }

  const itemExists = pantry.items.some((item) => item._id.toString() === itemId);
  if (!itemExists) {
    throw new ApiError(404, "Ingredient not found in pantry.");
  }

  await pantry.updateOne({ $pull: { items: { _id: itemId } } });
  return await Pantry.findOne({ userId });
};

export const clear = async (userId) => {
  const pantry = await Pantry.findOne({ userId });
  if (!pantry) {
    throw new ApiError(404, MESSAGES.PANTRY.NOT_FOUND || "Pantry not found.");
  }

  pantry.items = [];
  return await pantry.save();
};
