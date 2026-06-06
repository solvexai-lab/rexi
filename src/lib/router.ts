import { GoogleGenerativeAI } from "@google/generative-ai";
import { DocumentType } from "./types/engine";

export async function classifyDocument(text: string): Promise<{ type: DocumentType; confidence: number }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  });

  const prompt = `
    Classify the following document into one of these types:
    - EMPLOYMENT_OFFER
    - RESIDENTIAL_LEASE
    - COMMERCIAL_LEASE
    - NDA
    - SERVICE_AGREEMENT
    - INSURANCE_POLICY
    - GENERAL_CONTRACT

    Return ONLY a JSON object:
    {
      "type": "DOCUMENT_TYPE",
      "confidence": 0.95,
      "reasoning": "Brief explanation"
    }

    DOCUMENT TEXT (first 5000 chars):
    ${text.slice(0, 5000)}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const parsed = JSON.parse(response.text().trim());
    
    return {
      type: parsed.type as DocumentType,
      confidence: parsed.confidence || 0.8,
    };
  } catch (error) {
    console.error("Classification failed:", error);
    return { type: "GENERAL_CONTRACT", confidence: 0.5 };
  }
}
