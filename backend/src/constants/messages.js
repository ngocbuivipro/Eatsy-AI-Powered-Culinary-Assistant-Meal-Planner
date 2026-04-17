// [backend/src/constants/messages.js]

export const MESSAGES = {
  AUTH: {
    REGISTRATION_SUCCESS: "Registration successful. Welcome to Eatsy!",
    LOGIN_SUCCESS: "Login successful. Good to see you again!",
    INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
    EMAIL_EXISTS: "This email is already registered. Please use another one.",
    NOT_AUTHENTICATED: "Authentication required. Please log in.",
    PROFILE_UPDATED: "Profile updated successfully.",
    NOT_FOUND: "User not found.",
    MISSING_FIELDS: "Required fields are missing: name, email, and password.",
    INTERNAL_ERROR: "Something went wrong on our side. Please try again later.",
  },
  RECIPE: {
    CREATE_SUCCESS: "Recipe created successfully!",
    FETCH_SUCCESS: "Recipes retrieved successfully.",
    MATCH_SUCCESS: "Matched recipes found based on your ingredients.",
    NOT_FOUND: "Recipe not found.",
    MISSING_FIELDS: "Please provide all required fields (title, ingredients, steps, etc.).",
  },
  AI: {
    RESPONSE_SUCCESS: "AI consultation complete.",
    ERROR: "The AI brain is having a moment. Please check your API key or limits.",
    MISSING_PROMPT: "Please provide a message for the AI.",
  },
};
