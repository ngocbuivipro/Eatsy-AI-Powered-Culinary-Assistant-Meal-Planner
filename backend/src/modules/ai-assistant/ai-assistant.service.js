// [backend/src/modules/ai-assistant/ai-assistant.service.js]
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../user/user.model.js";
import { AI_PROMPTS } from "./prompts.js";
import config from "../../config/index.js";
import { ApiError } from "../../utils/ApiError.util.js";
import { MESSAGES } from "../../constants/messages.js";

export const chat = async (userId, message, history = []) => {
  try {
    const user = await User.findById(userId);
    
    const genAI = new GoogleGenerativeAI(config.ai.geminiKey);
    const model = genAI.getGenerativeModel({ 
      model: config.ai.geminiModel,
      systemInstruction: {
        parts: [{ text: AI_PROMPTS.SYSTEM_INSTRUCTION(user?.toObject() || user) }],
      },
    });

    const chatHistory = Array.isArray(history)
      ? history.map(msg => ({
          role: msg.role === "assistant" ? "model" : (msg.role === "model" ? "model" : "user"), 
          parts: [{ text: msg.text }],
        }))
      : [];

    const chatSession = model.startChat({ history: chatHistory });
    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    
    if (!response) {
      throw new ApiError(500, "Gemini API returned an empty response.");
    }

    return response.text();
  } catch (error) {
    console.error("❌ [AI Service Error Detail]:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data || error.response || "No response data"
    });
    
    if (error instanceof ApiError) throw error;
    
    // Trả về lỗi chi tiết hơn một chút để debug trên UI
    throw new ApiError(500, `AI Error: ${error.message || "Unknown error"}. Check console for details.`);
  }
};
