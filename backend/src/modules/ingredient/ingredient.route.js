import express from "express";
import { searchIngredients } from "./ingredient.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/search", protect, searchIngredients);

export default router;
