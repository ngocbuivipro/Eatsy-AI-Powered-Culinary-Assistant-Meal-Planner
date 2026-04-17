// [backend/src/modules/ai-assistant/ai-assistant.service.js]
import { GoogleGenerativeAI } from "@google/generative-ai";
import Pantry from "../pantry/pantry.model.js";
import { AI_PROMPTS } from "./prompts.js";
import config from "../../config/index.js";
import { ApiError } from "../../utils/ApiError.util.js";
import { MESSAGES } from "../../constants/messages.js";

export const getPantryContext = async (userId) => {
  const pantry = await Pantry.findOne({ userId });
  if (pantry && pantry.items && pantry.items.length > 0) {
    const itemsList = pantry.items
      .map(item => `- ${item.amount} ${item.unit} ${item.name}`)
      .join("\n");
    return `Người dùng hiện đang có các nguyên liệu sau trong tủ lạnh:\n${itemsList}`;
  }
  return "Hiện tại tủ lạnh của người dùng đang trống.";
};

export const chat = async (userId, message, history = []) => {
  const pantryContext = await getPantryContext(userId);
  
  const genAI = new GoogleGenerativeAI(config.ai.geminiKey);
  const model = genAI.getGenerativeModel({ 
    model: config.ai.geminiModel,
    systemInstruction: AI_PROMPTS.SYSTEM_INSTRUCTION(pantryContext),
  });

  const chatHistory = Array.isArray(history)
    ? history.map(msg => ({
        role: msg.role === "assistant" ? "model" : msg.role, 
        parts: [{ text: msg.text }],
      }))
    : [];

  const chatSession = model.startChat({ history: chatHistory });
  const result = await chatSession.sendMessage(message);
  const response = await result.response;
  
  if (!response) {
    throw new ApiError(500, MESSAGES.AI.ERROR);
  }

  return response.text();
};
