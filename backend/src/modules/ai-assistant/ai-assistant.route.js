import express from "express";
import { chatWithAI } from "./ai-assistant.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Sử dụng middleware protect để xác định danh tính và lấy dữ liệu tủ lạnh của người dùng
router.post("/chat", protect, chatWithAI);

export default router;
