import { HarmCategory, HarmBlockThreshold, type EnhancedGenerateContentResponse } from "@google/generative-ai";

export const DEFAULT_SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export interface SafeGeminiResult {
  text: string;
  blocked: boolean;
  reason?: string;
}

export function safeGeminiText(response: EnhancedGenerateContentResponse): SafeGeminiResult {
  try {
    // Check if response has any candidates
    if (!response.candidates || response.candidates.length === 0) {
      const reason =
        (response as any).promptFeedback?.blockReason ||
        (response as any).promptFeedback?.safetyRatings?.find((r: any) => r.blocked)?.category ||
        "Response blocked or empty";

      return { text: "", blocked: true, reason };
    }

    // Try to extract text
    const text = response.text();
    return { text, blocked: false };
  } catch (error: any) {
    return { text: "", blocked: true, reason: error.message || "Unknown extraction error" };
  }
}
// Deployed Sat Jun  6 13:45:27 IST 2026
