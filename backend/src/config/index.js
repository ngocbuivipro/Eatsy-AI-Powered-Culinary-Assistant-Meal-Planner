// [backend/src/config/index.js]
import dotenv from "dotenv";
import path from "path";

// Tải biến môi trường từ file .env
dotenv.config();

// MONGODB_URI hoặc MONGO_URI đều được chấp nhận
const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI;

const requiredEnv = [
  "PORT",
  "JWT_SECRET",
  "GEMINI_API_KEY",
  "SPOONACULAR_API_KEY",
];

// Validate các biến cơ bản
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ CRITICAL ERROR: Ecosystem variable ${key} is missing in .env file!`);
    process.exit(1);
  }
});

// Validate DB separately
if (!dbUri) {
    console.error(`❌ CRITICAL ERROR: Database URI (MONGODB_URI or MONGO_URI) is missing in .env file!`);
    process.exit(1);
}

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5050,
  db: {
    uri: dbUri,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  ai: {
    geminiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  },
  spoonacular: {
    apiKey: process.env.SPOONACULAR_API_KEY,
  },
};

export default config;
