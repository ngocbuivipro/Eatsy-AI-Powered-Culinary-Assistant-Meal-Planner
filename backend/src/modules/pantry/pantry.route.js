import express from "express";
import { getPantry, addPantryItem, removePantryItem, clearPantry } from "./pantry.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getPantry);
router.post("/", protect, addPantryItem);
router.delete("/", protect, clearPantry);
router.delete("/:itemId", protect, removePantryItem);

export default router;
