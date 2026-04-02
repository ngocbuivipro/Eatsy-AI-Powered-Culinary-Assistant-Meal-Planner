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

// Test route
app.get("/", (req, res) => {
  res.send("Eatsy Backend is running 🚀");
});

// Các API nghiệp vụ
app.use("/api/users", userRoutes);
// BẮT BUỘC ĐỂ Ở CUỐI CÙNG LÀ BỘ ĐÔI NÀY!
app.use(notFound); // Chặn các route không tồn tại (404)
app.use(errorHandler); // Nếu các file khác văng error (ví dụ code thiếu var), hứng vào đây hết

export default app;
