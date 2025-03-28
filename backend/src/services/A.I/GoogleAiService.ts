
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || "");

const model = genAi.getGenerativeModel({ model: "models/gemini-2.0-flash" });

export const getAiResponse = async (message: string) => {
    const prompt = `
    Act as a helpful AI assistant for a social media app. 
    Answer based on the user's message: "${message}".
    Keep it short and friendly. Always end your message with ay ay captain!
    `;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        let candidates = result.response?.candidates || [];
        let responseParts = candidates.length > 0 ? candidates[0]?.content?.parts : [];
        let responseText = responseParts.length > 0 ? responseParts[0]?.text?.trim() : "Sorry, I couldn't process that.";

        return responseText;
    } catch (error) {
        console.error("AI Service Error:", error);
        return "There was an error processing your request.";
    }
};

