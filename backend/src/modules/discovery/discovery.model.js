import mongoose from "mongoose";

// ═══════════════════════════════════════════════
// 📋 CATEGORY SCHEMA — Danh mục phân loại
// ═══════════════════════════════════════════════

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục không được để trống"],
      unique: true,
      trim: true,
      maxlength: 50,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    icon: {
      type: String,
      default: "🍽️",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: [
        "meal_type",
        "cuisine",
        "diet",
        "occasion",
        "cooking_method",
      ],
      required: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
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
categorySchema.index({ type: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ sortOrder: 1 });

// ═══════════════════════════════════════════════
// 🔧 MIDDLEWARE — Tự động tạo slug từ name
// ═══════════════════════════════════════════════
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

// ═══════════════════════════════════════════════
// 📤 EXPORT MODEL
// ═══════════════════════════════════════════════
const Category = mongoose.model("Category", categorySchema);
export default Category;
