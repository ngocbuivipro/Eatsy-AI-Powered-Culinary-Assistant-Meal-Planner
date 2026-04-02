import mongoose from "mongoose";

// ═══════════════════════════════════════════════
// 📋 CHAT SESSION SCHEMA — Phiên trò chuyện AI
// ═══════════════════════════════════════════════

// Sub-schema cho từng tin nhắn
const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: {
      type: String,
      required: [true, "Nội dung tin nhắn không được để trống"],
    },
    relatedRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

// Schema chính — ChatSession
const chatSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Cuộc trò chuyện mới",
      maxlength: 100,
    },
    // --- Danh sách tin nhắn ---
    // 🚀 THỰC TẾ PRODUCTION: Mảng vô cực (Unbounded Array) sẽ làm rách giới hạn 16MB document.
    // Nếu thiết kế Chatbot hội thoại dài, CHỈ NÊN lưu 50-100 tin nhắn gần nhất trực tiếp ở collection này.
    // Lịch sử tin nhắn cũ hơn cần được archive sang 1 Collection riêng (VD: ChatMessage)
    // Tạm thời ở V1 Eatsy ta embed trực tiếp, nhưng phải thiết lập cơ chế tự xóa tin nhắn cũ (#FIFO).
    messages: [messageSchema],

    // 🚀 THỰC TẾ PRODUCTION: Lưu trữ ngữ cảnh tĩnh (Snapshot)
    // AI cần biết state thực tại tại thời điểm chat. Việc snapshot lại các dữ liệu tĩnh 
    // như nguyên liệu đang có, mục tiêu và chế độ ăn của user sẽ giúp query nhanh,
    // không phải chắp vá ($lookup) từ nhiều collections khi generate prompt.
    context_snapshot: {
      spoonacularIngredientIds: {
        type: [Number],
        default: [], // Ví dụ: [1123, 9003] lưu trực tiếp snapshot từ Pantry
      },
      userDiet: {
        type: String,
        default: "omnivore", // Lấy từ User record
      },
      userGoals: {
        type: String,
        default: "maintain", // Lấy từ User record
      },
      topic: {
        type: String,
        enum: [
          "recipe_suggestion",
          "cooking_help",
          "ingredient_substitute",
          "meal_planning",
          "nutrition_advice",
          "general",
        ],
        default: "general",
      },
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
chatSessionSchema.index({ userId: 1 });
chatSessionSchema.index({ userId: 1, isActive: 1 });
chatSessionSchema.index({ createdAt: -1 });

// ═══════════════════════════════════════════════
// 📤 EXPORT MODEL
// ═══════════════════════════════════════════════
const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
export default ChatSession;
