import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { createRecipe, matchRecipes, getRecipeDetails, getRandomRecipes } from "./recipe.controller.js";

const router = express.Router();

router.post("/", protect, createRecipe);
router.get("/random", protect, getRandomRecipes);
router.get("/match", protect, matchRecipes);
router.get("/:id/details", protect, getRecipeDetails);

export default router;
