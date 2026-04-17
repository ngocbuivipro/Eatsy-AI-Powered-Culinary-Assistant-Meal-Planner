// [backend/src/modules/ai-assistant/ai-assistant.controller.js]
import * as aiService from "./ai-assistant.service.js";
import { catchAsync } from "../../utils/asyncHandler.util.js";
import { sendResponse } from "../../utils/response.util.js";
import { MESSAGES } from "../../constants/messages.js";
import { ApiError } from "../../utils/ApiError.util.js";

export const chatWithAI = catchAsync(async (req, res) => {
  const { message, history } = req.body;
  const userId = req.user?._id;

  if (!message) {
    throw new ApiError(400, MESSAGES.AI.MISSING_PROMPT);
  }

  const aiResponse = await aiService.chat(userId, message, history);

  return sendResponse(
    res, 
    200, 
    MESSAGES.AI.RESPONSE_SUCCESS, 
    aiResponse
  );
});
