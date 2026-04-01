import mongoose from "mongoose";

// ═══════════════════════════════════════════════
// 📋 MEAL PLAN SCHEMA — Kế hoạch bữa ăn
// ═══════════════════════════════════════════════

// Sub-schema cho từng bữa ăn trong kế hoạch
const mealItemSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Ngày không được để trống"],
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    servings: {
      type: Number,
      default: 1,
      min: 1,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      maxlength: 200,
    },
  },
  { _id: true }
);

// Schema chính — MealPlan
const mealPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Kế hoạch bữa ăn",
      maxlength: 100,
    },
    startDate: {
      type: Date,
      required: [true, "Ngày bắt đầu không được để trống"],
    },
    endDate: {
      type: Date,
      required: [true, "Ngày kết thúc không được để trống"],
    },
    meals: [mealItemSchema],

    totalNutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbohydrates: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ═══════════════════════════════════════════════
// 📇 INDEXES
// ═══════════════════════════════════════════════
mealPlanSchema.index({ userId: 1 });
mealPlanSchema.index({ startDate: 1, endDate: 1 });
mealPlanSchema.index({ userId: 1, isActive: 1 });

// ═══════════════════════════════════════════════
// 📤 EXPORT MODEL
// ═══════════════════════════════════════════════
const MealPlan = mongoose.model("MealPlan", mealPlanSchema);
export default MealPlan;
