import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env.js";
import prisma from "../../config/db.js";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// Models to try in order — if one hits quota, fall back to the next
const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  bn: "Bengali",
  gu: "Gujarati",
  pa: "Punjabi",
  ml: "Malayalam",
  or: "Odia",
  as: "Assamese",
  ur: "Urdu",
  ks: "Kashmiri",
  mai: "Maithili",
};

// FAQs about the app and agriculture schemes
const FAQ_CONTEXT = `
You are "Krishi Mitra" (कृषि मित्र), a friendly farming assistant chatbot for the Krishiculture platform.

ABOUT THE PLATFORM:
- Krishiculture is a platform that helps Indian farmers discover and apply for government schemes, subsidies, and insurance programs.
- Farmers can check eligibility with just 2-3 inputs (state, land size, crop type).
- The platform supports 15 Indian languages.
- It provides scheme details, benefits, eligibility criteria, application process, and required documents.

COMMON FAQs:
Q: How do I check my eligibility?
A: Go to the home page and enter your state, land size, and crop type. The system will automatically show schemes you're eligible for.

Q: How do I apply for a scheme?
A: Find the scheme, click "Apply Now", and you'll be redirected to the official portal. Each scheme page shows step-by-step instructions.

Q: What documents do I need?
A: Common documents include Aadhar Card, Land Records, Bank Passbook, Passport Photo, and Mobile Number. Each scheme lists specific requirements.

Q: Is this service free?
A: Yes, Krishiculture is completely free. We help you find and access government schemes at no cost.

Q: What is PM-KISAN?
A: PM-KISAN provides ₹6,000/year to farmer families in 3 installments of ₹2,000 each. All landholding farmers with Aadhar and bank account are eligible.

Q: What is PMFBY?
A: Pradhan Mantri Fasal Bima Yojana provides crop insurance at low premiums (2% Kharif, 1.5% Rabi). It covers losses from natural calamities, pests, and diseases.

Q: What is Soil Health Card?
A: Free soil testing for farmers with customized fertilizer recommendations. Cards are issued every 2 years.

Q: What is Kisan Credit Card?
A: A credit facility providing farmers short-term loans for crop production, post-harvest expenses, and maintenance of farm assets at subsidized interest rates.

Q: How do I change the language?
A: Click the language toggle button on the top navigation bar to switch between supported languages.

Q: Can I use voice input?
A: Yes, click the microphone icon in the chatbot or search bar to use voice input.

INSTRUCTIONS:
- Always be helpful, simple, and friendly.
- Use short sentences that are easy to understand.
- If asked about a specific scheme, provide details from the database context if available.
- If you don't know something, say so honestly and suggest visiting the official portal.
- Always respond in the language specified by the user.
- Use emojis sparingly to keep the tone friendly.
- Keep responses concise (under 200 words).
`;

export const chatWithGemini = async (
  message: string,
  language: string,
  conversationHistory: Array<{ role: string; text: string }>
) => {
  try {
    // Fetch some scheme data for context
    const schemes = await prisma.scheme.findMany({
      where: { isActive: true },
      select: {
        schemeName: true,
        schemeId: true,
        state: true,
        category: true,
        supportedCrops: true,
        content: {
          select: {
            details: true,
            benefits: true,
            eligibility: true,
          },
        },
      },
      take: 10,
    });

    const schemeContext = schemes
      .map((s) => {
        const details = s.content?.details as any;
        return `- ${s.schemeName} (${s.category}): ${details?.description || "No description"}`;
      })
      .join("\n");

    const langName = LANGUAGE_MAP[language] || "English";

    const systemPrompt = `${FAQ_CONTEXT}

AVAILABLE SCHEMES IN DATABASE:
${schemeContext || "No schemes loaded yet."}

IMPORTANT: Respond ONLY in ${langName} language. The user's language code is "${language}".
`;

    // Build conversation history for context
    const historyFormatted = conversationHistory
      .slice(-6) // Last 6 messages for context
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");

    const fullPrompt = `${systemPrompt}

Previous conversation:
${historyFormatted}

User (in ${langName}): ${message}

Respond in ${langName}:`;

    // Try each model with retry logic
    let lastError: any = null;
    for (const modelName of MODELS) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(fullPrompt);
          const response = result.response.text();
          return response;
        } catch (err: any) {
          lastError = err;
          const is429 = err.message?.includes("429") || err.message?.includes("quota");
          if (is429 && attempt === 0) {
            // Wait before retrying the same model
            await new Promise((r) => setTimeout(r, 3000));
            continue;
          }
          // Move to next model
          console.warn(`Model ${modelName} failed (attempt ${attempt + 1}):`, err.message);
          break;
        }
      }
    }

    // All models exhausted — throw so catch block handles it
    throw lastError || new Error("All Gemini models failed");
  } catch (error: any) {
    console.error("Gemini API Error:", error.message);

    const is429 = error.message?.includes("429") || error.message?.includes("quota");

    // Rate-limit specific messages
    const rateLimitFallbacks: Record<string, string> = {
      en: "⏳ I'm receiving too many requests right now. Please wait a minute and try again.",
      hi: "⏳ अभी बहुत अधिक अनुरोध आ रहे हैं। कृपया एक मिनट प्रतीक्षा करें और पुनः प्रयास करें।",
      mr: "⏳ सध्या खूप जास्त विनंत्या आल्या आहेत. कृपया एक मिनिट थांबा आणि पुन्हा प्रयत्न करा.",
      ta: "⏳ தற்போது அதிக கோரிக்கைகள் வருகின்றன. ஒரு நிமிடம் காத்திருந்து மீண்டும் முயற்சிக்கவும்.",
      te: "⏳ ప్రస్తుతం చాలా ఎక్కువ అభ్యర్థనలు వస్తున్నాయి. దయచేసి ఒక నిమిషం వేచి ఉండి మళ్ళీ ప్రయత్నించండి.",
      gu: "⏳ હાલમાં ઘણી વધુ વિનંતીઓ આવી રહી છે. કૃપા કરીને એક મિનિટ રાહ જુઓ અને ફરીથી પ્રયાસ કરો.",
    };

    // Generic fallback messages
    const fallbacks: Record<string, string> = {
      en: "Sorry, I'm having trouble connecting right now. Please try again later.",
      hi: "क्षमा करें, मुझे अभी कनेक्ट करने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।",
      mr: "माफ करा, मला आत्ता कनेक्ट होण्यात अडचण येत आहे. कृपया नंतर पुन्हा प्रयत्न करा.",
      ta: "மன்னிக்கவும், தற்போது இணைப்பதில் சிக்கல் உள்ளது. பின்னர் மீண்டும் முயற்சிக்கவும்.",
      te: "క్షమించండి, ప్రస్తుతం కనెక్ట్ చేయడంలో సమస్య ఉంది. దయచేసి తర్వాత మళ్ళీ ప్రయత్నించండి.",
      gu: "માફ કરશો, હાલમાં કનેક્ટ કરવામાં સમસ્યા આવી રહી છે. કૃપા કરીને પછી ફરી પ્રયાસ કરો.",
    };

    if (is429) {
      return rateLimitFallbacks[language] || rateLimitFallbacks["en"];
    }
    return fallbacks[language] || fallbacks["en"];
  }
};
