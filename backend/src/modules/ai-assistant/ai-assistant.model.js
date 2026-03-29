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
    messages: [messageSchema],

    context: {
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
