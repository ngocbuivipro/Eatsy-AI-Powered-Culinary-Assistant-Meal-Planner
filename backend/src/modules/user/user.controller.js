import User from "./user.model.js";
import { catchAsync } from "../../utils/asyncHandler.util.js";
import { sendResponse } from "../../utils/response.util.js";
import { ApiError } from "../../utils/ApiError.util.js";
import { generateToken } from "../../utils/jwt.util.js";
import { hashPassword, comparePassword } from "../../utils/password.util.js";

// [Task 1] Traditional Registration
export const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    throw new ApiError(400, "Please provide name, email, and password");
  }

  // Check if email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "Email already registered, please use another one");
  }

  // Encrypt password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    authProvider: "local",
  });

  // Auto-generate token to log in immediately
  const token = generateToken({ id: user._id });

  // Hide password from response
  user.password = undefined;

  return sendResponse(res, 201, "Registration successful", { user, token });
});

// [Task 2] Traditional Login
export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  // Find user and select password which is hidden by default
  const user = await User.findOne({ email }).select("+password");

  // Compare password
  if (!user || !(await comparePassword(password, user.password))) {
    throw new ApiError(401, "Invalid email or password, please try again");
  }

  // Generate token
  const token = generateToken({ id: user._id });

  // Hide password before sending response
  user.password = undefined; 

  return sendResponse(res, 200, "Login successful", { user, token });
});

// [Task 3] OAuth Login (Google/Apple)
export const oauthLogin = catchAsync(async (req, res, next) => {
  const { email, name, providerId, authProvider, avatarUrl } = req.body;

  if (!email || !providerId || !authProvider) {
    throw new ApiError(400, "Missing required information from Google/Apple");
  }

  let user = await User.findOne({ email });

  if (user) {
    if (authProvider === "google" && !user.googleId) {
      user.googleId = providerId;
      await user.save();
    }
    if (authProvider === "apple" && !user.appleId) {
      user.appleId = providerId;
      await user.save();
    }
  } else {
    user = await User.create({
      email: email,
      name: name,
      authProvider: authProvider,
      googleId: authProvider === "google" ? providerId : undefined,
      appleId: authProvider === "apple" ? providerId : undefined,
      avatarUrl: avatarUrl || "",
    });
  }

  const token = generateToken({ id: user._id });

  return sendResponse(res, 200, "OAuth Login successful", { 
    user, 
    token 
  });
});

// [Task 4] Get Current User Profile
export const getCurrentUserProfile = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  return sendResponse(res, 200, "Profile retrieved successfully", { user });
});

// [Task 5] Update Current User Profile
export const updateCurrentUserProfile = catchAsync(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const allowedFields = ["name", "avatarUrl", "dietaryPreferences", "healthGoals"];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  const updatedUser = await user.save();
  updatedUser.password = undefined;

  return sendResponse(res, 200, "Profile updated successfully", { user: updatedUser });
});
