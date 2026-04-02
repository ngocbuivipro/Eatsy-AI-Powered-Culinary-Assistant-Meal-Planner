import mongoose from "mongoose";

// ═══════════════════════════════════════════════
// 🧊 PANTRY SCHEMA — Tủ lạnh chứa nguyên liệu
// ═══════════════════════════════════════════════

const pantryItemSchema = new mongoose.Schema({
  // ID cực kì quan trọng: Spoonacular trả về ID nguyên liệu toàn là Số (VD: 1123 = Trứng)
  // Nếu lưu kiểu Mongoose ObjectId thông thường sẽ bị lỗi ép kiểu. Vì vậy bắt buộc để Number.
  spoonacularId: {
    type: Number,
    required: [true, "Cần mã Spoonacular ID để đẩy lên Cỗ máy AI matching"],
  },
  name: {
    type: String,
    required: [true, "Tên đồ ăn (bằng tiếng Anh cho chuẩn Spoonacular)"],
    lowercase: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Khối lượng phải là số dương"],
    default: 1,
  },
  unit: {
    type: String, 
    // Spoonacular unit format (g, kg, cups, oz...)
    trim: true,
    default: "piece"
  },
  imageUrl: {
    type: String,
    // Spoonacular trả về link ảnh, lưu lại thẳng xuống Local DB cho xịn mịn
    default: "",
  },
  addedAt: {
    type: Date,
    default: Date.now,
  }
});

const pantrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Một user chỉ được phép có duy nhất 1 tủ lạnh
    },
    // Mảng chứa nguyên liệu bên trong tủ, tái sử dụng Sub-document bên trên
    items: [pantryItemSchema],
  },
  {
    timestamps: true,
  }
);

// Tạo index cho truy xuất nhanh tốc độ cao theo User
pantrySchema.index({ userId: 1 });

const Pantry = mongoose.model("Pantry", pantrySchema);
export default Pantry;
