// [frontend/src/constants/Endpoints.js]

export const ENDPOINTS = {
  BASE_URL: "/api",
  AUTH: {
    LOGIN: "/user/login",
    REGISTER: "/user/register",
    OAUTH: "/user/oauth",
    PROFILE: "/user/profile",
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
