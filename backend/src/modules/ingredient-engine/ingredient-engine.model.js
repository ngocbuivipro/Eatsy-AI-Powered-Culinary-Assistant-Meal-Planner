import mongoose from "mongoose";

// ═══════════════════════════════════════════════
// 📋 PANTRY SCHEMA — Tủ nguyên liệu của user
// ═══════════════════════════════════════════════

// Sub-schema cho từng item trong tủ
const pantryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên nguyên liệu không được để trống"],
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
    category: {
      type: String,
      enum: [
        "vegetable",
        "fruit",
        "meat",
        "seafood",
        "dairy",
        "grain",
        "spice",
        "sauce",
        "other",
      ],
      default: "other",
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
pantrySchema.index({ "items.name": 1 });
pantrySchema.index({ "items.expiryDate": 1 });

// ═══════════════════════════════════════════════
// 📤 EXPORT MODEL
// ═══════════════════════════════════════════════
const Pantry = mongoose.model("Pantry", pantrySchema);
export default Pantry;
