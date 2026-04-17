// [backend/src/modules/pantry/pantry.controller.js]
import * as pantryService from "./pantry.service.js";
import { PantryResponseDTO } from "./pantry.dto.js";
import { catchAsync } from "../../utils/asyncHandler.util.js";
import { sendResponse } from "../../utils/response.util.js";
import { MESSAGES } from "../../constants/messages.js";

export const getPantry = catchAsync(async (req, res) => {
  const pantry = await pantryService.getByUser(req.user._id);
  
  return sendResponse(
    res, 
    200, 
    MESSAGES.PANTRY?.FETCH_SUCCESS || "Pantry fetched successfully", 
    { pantry: PantryResponseDTO(pantry) }
  );
});

export const addPantryItem = catchAsync(async (req, res) => {
  const pantry = await pantryService.addItem(req.user._id, req.body);
  
  return sendResponse(
    res, 
    201, 
    MESSAGES.PANTRY?.ADD_SUCCESS || "Item added to pantry", 
    { pantry: PantryResponseDTO(pantry) }
  );
});

export const removePantryItem = catchAsync(async (req, res) => {
  const pantry = await pantryService.removeItem(req.user._id, req.params.itemId);
  
  return sendResponse(
    res, 
    200, 
    MESSAGES.PANTRY?.REMOVE_SUCCESS || "Item removed from pantry", 
    { pantry: PantryResponseDTO(pantry) }
  );
});

export const clearPantry = catchAsync(async (req, res) => {
  const pantry = await pantryService.clear(req.user._id);
  
  return sendResponse(
    res, 
    200, 
    MESSAGES.PANTRY?.CLEAR_SUCCESS || "Pantry cleared successfully", 
    { pantry: PantryResponseDTO(pantry) }
  );
});
