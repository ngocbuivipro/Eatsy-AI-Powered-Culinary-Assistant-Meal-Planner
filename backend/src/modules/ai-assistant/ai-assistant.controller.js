import { GoogleGenerativeAI } from "@google/generative-ai";
import Pantry from "../pantry/pantry.model.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?._id;

    if (!message) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập tin nhắn!" });
    }

    // 1. TRUY VẤN DỮ LIỆU TỦ LẠNH CỦA USER
    let pantryContext = "Hiện tại tủ lạnh của người dùng đang trống.";
    const pantry = await Pantry.findOne({ userId });
    
    if (pantry && pantry.items && pantry.items.length > 0) {
      const itemsList = pantry.items
        .map(item => `- ${item.amount} ${item.unit} ${item.name}`)
        .join("\n");
      pantryContext = `Người dùng hiện đang có các nguyên liệu sau trong tủ lạnh:\n${itemsList}`;
    }

    // 2. KHỞI TẠO AI VỚI CONTEXT CÁ NHÂN HÓA
    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
    if (!apiKey) {
      throw new Error("Không tìm thấy GEMINI_API_KEY trong hệ thống!");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `Bạn là trợ lý ảo của ứng dụng Eatsy. Nhiệm vụ của bạn là tư vấn món ăn dựa trên nguyên liệu người dùng đang có. 
      
      THÔNG TIN TỦ LẠNH HIỆN TẠI:
      ${pantryContext}
      
      QUY TẮC:
      - Luôn ưu tiên gợi ý các món ăn có thể nấu từ các nguyên liệu trên.
      - Trả lời thân thiện, ngắn gọn và chuyên nghiệp.
      - Nếu người dùng hỏi về món ăn mà họ thiếu nguyên liệu, hãy nhắc nhở nhẹ nhàng những thứ họ cần mua thêm.`,
    });

    // 3. GỬI TIN NHẮN
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      data: text,
    });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Lỗi bộ não AI! Bạn hãy kiểm tra lại API Key hoặc giới hạn yêu cầu.",
      error: error.message 
    });
  }
};
