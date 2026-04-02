import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { matchRecipes } from "./recipe.controller.js";

const router = express.Router();

router.get("/match", protect, matchRecipes);

export default router;
