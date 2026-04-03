// src/app.js
import express from "express";
import { protect } from "./middleware/auth.middleware.js";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

import userRoutes from "./modules/user/user.route.js";
import recipeRoutes from "./modules/recipe/recipe.route.js";
import categoryRoutes from "./modules/category/category.route.js";
import pantryRoutes from "./modules/pantry/pantry.route.js";

// Test route
app.get("/", (req, res) => {
  res.send("Eatsy Backend is running 🚀");
});

// Các API nghiệp vụ
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/pantry", pantryRoutes);

// BẮT BUỘC ĐỂ Ở CUỐI CÙNG LÀ BỘ ĐÔI NÀY!
app.use(notFound); // Chặn các route không tồn tại (404)
app.use(errorHandler); // Nếu các file khác văng error (ví dụ code thiếu var), hứng vào đây hết

export default app;
