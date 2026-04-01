import mongoose from "mongoose";

// ═══════════════════════════════════════════════
// 📋 PANTRY SCHEMA — Tủ nguyên liệu của user
// ═══════════════════════════════════════════════

// Sub-schema cho từng item trong tủ
const pantryItemSchema = new mongoose.Schema(
  {
    ingredient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
      required: [true, "ID nguyên liệu không được để trống"],
    },
    // 🚀 THỰC TẾ PRODUCTION: Lưu kèm tên (Denormalization) để UI vẽ nhanh danh sách
    // mà không cần phải chạy lệnh $lookup đắt đỏ sang collection Ingredient.
    // LƯU Ý: Tuyệt đối KHÔNG dùng field này để search!
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Số lượng không thể âm"],
    },
    unit: {
      type: String,
      required: true,
      enum: ["gram", "kg", "ml", "liter", "piece", "tbsp", "tsp", "cup"],
    },
    expiryDate: {
      type: Date,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

// Schema chính — Pantry (Tủ lạnh)
const pantrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // mỗi user chỉ có 1 pantry
    },
    items: [pantryItemSchema],
  },
  {
    timestamps: true,
  }
);

// ═══════════════════════════════════════════════
// 📇 INDEXES
// ═══════════════════════════════════════════════
pantrySchema.index({ userId: 1 });
pantrySchema.index({ "items.ingredient_id": 1 }); // tìm nguyên liệu theo ID
pantrySchema.index({ "items.expiryDate": 1 }); // tìm nguyên liệu sắp hết hạn

// ═══════════════════════════════════════════════
// 📤 EXPORT MODEL
// ═══════════════════════════════════════════════
const Pantry = mongoose.model("Pantry", pantrySchema);
export default Pantry;
