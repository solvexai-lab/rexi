import { GoogleGenerativeAI } from "@google/generative-ai";
import { ExtractionSchema, ExtractedValue } from "./types/engine";

export async function extractFields(
  text: string,
  schema: ExtractionSchema
): Promise<ExtractedValue[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-05-20",
    generationConfig: {
      temperature: 0.0,
      responseMimeType: "application/json",
    },
  });

  const prompt = `
    Extract the following fields from the document text.
    For each field, provide the value, the exact text snippet from the document, the surrounding context, and a confidence score (0-1).

    FIELDS TO EXTRACT:
    ${JSON.stringify(schema.fields, null, 2)}

    Return ONLY a JSON array of objects:
    [
      {
        "key": "field_key",
        "value": any,
        "sourceText": "exact snippet",
        "context": "surrounding sentence",
        "confidence": 0.98
      }
    ]

    DOCUMENT TEXT (first 10000 chars):
    ${text.slice(0, 10000)}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text().trim());
  } catch (error) {
    console.error("Extraction failed:", error);
    return [];
  }
}
