import express from "express";
import { registerUser, loginUser, oauthLogin } from "./user.controller.js";
import { protect } from "../../middleware/auth.middleware.js"; // Ví dụ để import sẵn

const router = express.Router();

// Route cho Task 1 và Task 2 (Dev khác sẽ code Controller sau)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Route cho Task 3: Đăng nhập bằng Google/Apple
router.post("/oauth", oauthLogin);

export default router;
