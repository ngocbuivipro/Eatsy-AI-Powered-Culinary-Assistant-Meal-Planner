// [backend/src/modules/user/user.controller.js]
import * as userService from "./user.service.js";
import { AuthResponseDTO, UserResponseDTO } from "./user.dto.js";
import { catchAsync } from "../../utils/asyncHandler.util.js";
import { sendResponse } from "../../utils/response.util.js";
import { MESSAGES } from "../../constants/messages.js";

// [Lead Architect Note]: Controller now only handles HTTP layer (req, res)
// Business logic is fully decoupled into userService.

export const registerUser = catchAsync(async (req, res) => {
  const { user, token } = await userService.register(req.body);
  
  return sendResponse(
    res, 
    201, 
    MESSAGES.AUTH.REGISTRATION_SUCCESS, 
    AuthResponseDTO(user, token)
  );
});

export const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await userService.login(email, password);

  return sendResponse(
    res, 
    200, 
    MESSAGES.AUTH.LOGIN_SUCCESS, 
    AuthResponseDTO(user, token)
  );
});

export const oauthLogin = catchAsync(async (req, res) => {
  const { user, token } = await userService.findOrCreateOAuthUser(req.body);

  return sendResponse(
    res, 
    200, 
    MESSAGES.AUTH.LOGIN_SUCCESS, 
    AuthResponseDTO(user, token)
  );
});

export const getCurrentUserProfile = catchAsync(async (req, res) => {
  // req.user logic is handled by auth middleware
  return sendResponse(
    res, 
    200, 
    MESSAGES.AUTH.PROFILE_UPDATED, // Use appropriate message
    { user: UserResponseDTO(req.user) }
  );
});

export const updateCurrentUserProfile = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateProfile(req.user?._id, req.body);
  
  return sendResponse(
    res, 
    200, 
    MESSAGES.AUTH.PROFILE_UPDATED, 
    { user: UserResponseDTO(updatedUser) }
  );
});
