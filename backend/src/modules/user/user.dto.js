// [backend/src/modules/user/user.dto.js]

/**
 * DTO để lọc dữ liệu User trước khi gửi về client
 * Loại bỏ password và các trường nhạy cảm khác
 */
export const UserResponseDTO = (user) => {
  if (!user) return null;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    authProvider: user.authProvider,
    dietaryPreferences: user.dietaryPreferences,
    healthGoals: user.healthGoals,
    measurementSystem: user.measurementSystem,
    savedRecipes: user.savedRecipes,
    isActive: user.isActive,
    hasCompletedOnboarding: user.hasCompletedOnboarding,
    createdAt: user.createdAt,
  };
};

/**
 * DTO dành cho các phản hồi Auth (Login/Register) kèm Token
 */
export const AuthResponseDTO = (user, token) => {
  return {
    user: UserResponseDTO(user),
    token,
  };
};
