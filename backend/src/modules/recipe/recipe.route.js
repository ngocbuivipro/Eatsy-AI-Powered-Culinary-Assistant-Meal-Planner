import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { createRecipe, matchRecipes } from "./recipe.controller.js";

const router = express.Router();

router.post("/", protect, createRecipe);
router.get("/match", protect, matchRecipes);

export default router;
