// [backend/src/modules/user/user.service.js]
import User from "./user.model.js";
import { hashPassword, comparePassword } from "../../utils/password.util.js";
import { generateToken } from "../../utils/jwt.util.js";
import { ApiError } from "../../utils/ApiError.util.js";
import { MESSAGES } from "../../constants/messages.js";

export const register = async (userData) => {
  const { name, email, password } = userData;

  if (!email || !password || !name) {
    throw new ApiError(400, MESSAGES.AUTH.MISSING_FIELDS);
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, MESSAGES.AUTH.EMAIL_EXISTS);
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    authProvider: "local",
  });

  const token = generateToken({ id: user._id });
  return { user, token };
};

export const login = async (email, password) => {
  if (!email || !password) {
    throw new ApiError(400, MESSAGES.AUTH.MISSING_FIELDS);
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await comparePassword(password, user.password))) {
    throw new ApiError(401, MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  const token = generateToken({ id: user._id });
  return { user, token };
};

export const findOrCreateOAuthUser = async (oauthData) => {
  const { email, name, providerId, authProvider, avatarUrl } = oauthData;

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
      email,
      name,
      authProvider,
      googleId: authProvider === "google" ? providerId : undefined,
      appleId: authProvider === "apple" ? providerId : undefined,
      avatarUrl: avatarUrl || "",
    });
  }

  const token = generateToken({ id: user._id });
  return { user, token };
};

export const updateProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, MESSAGES.AUTH.NOT_FOUND);
  }

  const allowedFields = ["name", "avatarUrl", "dietaryPreferences", "healthGoals", "measurementSystem", "hasCompletedOnboarding"];
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      user[field] = updateData[field];
    }
  });

  return await user.save();
};
