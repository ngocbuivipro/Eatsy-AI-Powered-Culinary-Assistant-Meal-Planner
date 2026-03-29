import mongoose from "mongoose";

// ═══════════════════════════════════════════════
// 📋 RECIPE SCHEMA — Công thức nấu ăn
// ═══════════════════════════════════════════════

// Sub-schema cho nguyên liệu (nhúng trong Recipe)
const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    isOptional: { type: Boolean, default: false },
  },
  { _id: false }
);

// Sub-schema cho bước nấu
const stepSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true },
    instruction: { type: String, required: true },
    duration: { type: Number },
    imageUrl: { type: String },
  },
  { _id: false }
);

// Sub-schema cho đánh giá
const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: { type: String, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Schema chính cho Recipe
const recipeSchema = new mongoose.Schema(
  {
    // --- Thông tin cơ bản ---
    title: {
      type: String,
      required: [true, "Tên món ăn không được để trống"],
      trim: true,
      maxlength: [100, "Tên món ăn không quá 100 ký tự"],
    },

    description: {
      type: String,
      required: [true, "Mô tả không được để trống"],
      maxlength: [1000, "Mô tả không quá 1000 ký tự"],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null cho recipe import từ Spoonacular
    },

    // --- Nguồn gốc dữ liệu (Spoonacular integration) ---
    source: {
      type: String,
      enum: ["user", "spoonacular"],
      default: "user",
    },
    spoonacularId: {
      type: Number,
      unique: true,
      sparse: true, // cho phép nhiều document có giá trị null
    },

    // --- Nội dung chính ---
    ingredients: {
      type: [ingredientSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "Phải có ít nhất 1 nguyên liệu",
      },
    },

    steps: {
      type: [stepSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "Phải có ít nhất 1 bước thực hiện",
      },
    },

    // --- Phân loại ---
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    mealType: {
      type: [String],
      enum: ["breakfast", "lunch", "dinner", "snack", "dessert"],
      default: ["lunch"],
    },

    // --- Thời gian ---
    prepTime: { type: Number, required: true, min: 0 },
    cookTime: { type: Number, required: true, min: 0 },
    servings: { type: Number, required: true, min: 1 },

    // --- Dinh dưỡng (trên 1 phần ăn) ---
    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbohydrates: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
    },

    // --- Hình ảnh ---
    imageUrl: {
      type: String,
      default: "",
    },

    // --- Đánh giá ---
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },

    // --- Trạng thái ---
    isPublished: { type: Boolean, default: true },

    // Tags tìm kiếm
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ═══════════════════════════════════════════════
// 📇 INDEXES
// ═══════════════════════════════════════════════
recipeSchema.index({ title: "text", description: "text", tags: "text" });
recipeSchema.index({ author: 1 });
recipeSchema.index({ categories: 1 });
recipeSchema.index({ difficulty: 1 });
recipeSchema.index({ averageRating: -1 });
recipeSchema.index({ "ingredients.name": 1 });

// ═══════════════════════════════════════════════
// 🔧 VIRTUAL — Tổng thời gian nấu
// ═══════════════════════════════════════════════
recipeSchema.virtual("totalTime").get(function () {
  return this.prepTime + this.cookTime;
});

// ═══════════════════════════════════════════════
// 📤 EXPORT MODEL
// ═══════════════════════════════════════════════
const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
