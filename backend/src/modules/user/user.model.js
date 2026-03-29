import mongoose from "mongoose";

// ═══════════════════════════════════════════════
// 📋 USER SCHEMA — Thông tin người dùng
// ═══════════════════════════════════════════════

const userSchema = new mongoose.Schema(
  {
    // --- Thông tin cơ bản ---
    name: {
      type: String,
      required: [true, "Tên không được để trống"],
      trim: true,
      minlength: [2, "Tên phải có ít nhất 2 ký tự"],
      maxlength: [50, "Tên không được quá 50 ký tự"],
    },

    email: {
      type: String,
      required: [true, "Email không được để trống"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
    },

    password: {
      type: String,
      required: [true, "Mật khẩu không được để trống"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
      select: false, // mặc định KHÔNG trả password khi query
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    // --- Tùy chọn ăn uống (cá nhân hóa AI) ---
    dietaryPreferences: {
      dietType: {
        type: String,
        enum: ["omnivore", "vegetarian", "vegan", "pescatarian", "keto", "paleo"],
        default: "omnivore",
      },
      allergies: {
        type: [String],
        default: [],
      },
      dislikedIngredients: {
        type: [String],
        default: [],
      },
      cuisinePreferences: {
        type: [String],
        default: [],
      },
    },

    // --- Mục tiêu sức khỏe ---
    healthGoals: {
      goal: {
        type: String,
        enum: ["maintain", "lose_weight", "gain_muscle", "eat_healthier"],
        default: "maintain",
      },
      dailyCalorieTarget: {
        type: Number,
        default: 2000,
        min: [800, "Lượng calo tối thiểu là 800"],
        max: [5000, "Lượng calo tối đa là 5000"],
      },
    },

    // --- Công thức đã lưu (bookmark) ---
    savedRecipes: [
      {
        recipeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Recipe",
        },
        savedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // --- Trạng thái tài khoản ---
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ═══════════════════════════════════════════════
// 📇 INDEXES — Chỉ mục giúp tìm kiếm nhanh
// ═══════════════════════════════════════════════
userSchema.index({ email: 1 });

// ═══════════════════════════════════════════════
// 🔧 VIRTUALS — Trường ảo, không lưu trong DB
// ═══════════════════════════════════════════════
userSchema.virtual("recipes", {
  ref: "Recipe",
  localField: "_id",
  foreignField: "author",
});

// ═══════════════════════════════════════════════
// 📤 EXPORT MODEL
// ═══════════════════════════════════════════════
const User = mongoose.model("User", userSchema);
export default User;
