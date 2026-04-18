// [frontend/src/constants/Endpoints.js]

export const ENDPOINTS = {
  BASE_URL: "/api",
  AUTH: {
    LOGIN: "/users/login",
    REGISTER: "/users/register",
    OAUTH: "/users/oauth",
    PROFILE: "/users/profile",
  },
  RECIPES: {
    BASE: "/recipe",
    MATCH: "/recipe/match",
    RANDOM: "/recipe/random",
    DETAILS: (id) => `/recipe/${id}/details`,
  },
  PANTRY: {
    BASE: "/pantry",
  },
  AI: {
    CHAT: "/ai-assistant/chat",
  }
};
