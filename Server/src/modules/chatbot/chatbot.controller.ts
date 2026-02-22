import { Request, Response } from "express";
import { chatWithGemini } from "./chatbot.service.js";

export const handleChat = async (req: Request, res: Response) => {
  try {
    const { message, language = "en", history = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const reply = await chatWithGemini(message.trim(), language, history);

    res.json({
      success: true,
      data: {
        reply,
        language,
      },
    });
  } catch (err: any) {
    console.error("Chatbot controller error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to process chat message",
    });
  }
};
