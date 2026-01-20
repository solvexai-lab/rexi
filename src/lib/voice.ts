import { GoogleGenerativeAI } from "@google/generative-ai";
import { Finding } from "./types/engine";

export async function synthesizeExplanations(
  findings: Finding[]
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.3,
    },
  });

  const prompt = `
    Transform the following raw legal findings into neutral, plain English sentences.
    
    CRITICAL CONSTRAINTS:
    1. Do NOT use subjective adjectives like "better", "worse", "unfair", "predatory", "expensive", or "cheap".
    2. Do NOT give advice (e.g., "You should not sign this").
    3. State the facts clearly and neutrally.
    4. Format as a simple list of sentences.

    FINDINGS:
    ${JSON.stringify(findings, null, 2)}

    Output format:
    - Sentence 1
    - Sentence 2
    ...
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().split("\n").filter(s => s.trim().startsWith("-")).map(s => s.replace(/^- /, "").trim());
  } catch (error) {
    console.error("Voice synthesis failed:", error);
    return findings.map(f => f.message);
  }
}
