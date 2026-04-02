import mongoose from "mongoose";

// ═══════════════════════════════════════════════
// 🍔 CATEGORY SCHEMA — Tương thích Spoonacular
// ═══════════════════════════════════════════════
// Spoonacular API không dùng ID số cho category, mà dùng chuỗi string để query
// Ví dụ: query url `&type=main course` hoặc `&cuisine=italian`

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục không được để trống"],
      trim: true,
      unique: true, // VD: "Bữa Sáng", "Món chay"
    },
    // Trường này là chìa khóa để ghép với API Spoonacular
    spoonacularTag: {
      type: String, 
      required: [true, "Phải gài tag Spoonacular (vd: breakfast, vegetarian)"],
      trim: true,
    },
    // Ánh xạ tag thuộc mảng nào của Spoonacular để tiện gọi Query
    tagType: {
      type: String,
      enum: ["cuisine", "diet", "type", "intolerance"], 
      default: "type"
    },
    imageUrl: {
      type: String,
      required: [true, "Bắt buộc có ảnh để hiển thị ở Frontend"],
    },
    sortOrder: {
      type: Number,
      default: 0, // Dùng để xếp hạng: 1 là nằm trên top, 0 là nằm dưới
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

const Category = mongoose.model("Category", categorySchema);
export default Category;
