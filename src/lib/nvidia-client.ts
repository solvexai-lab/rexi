import { safeGeminiText } from "./gemini-utils";

export interface NvidiaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface NvidiaCompletionOptions {
  model?: string;
  messages: NvidiaMessage[];
  temperature?: number;
  maxTokens?: number;
}

const DEFAULT_MODEL = "meta/llama-3.3-70b-instruct";
const API_BASE = "https://integrate.api.nvidia.com/v1/chat/completions";

export async function nvidiaChatCompletion(options: NvidiaCompletionOptions): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not set");
  }

  const model = options.model || process.env.NVIDIA_MODEL || DEFAULT_MODEL;
  const timeoutMs = 45000; // 45s timeout to stay under Vercel's 60s limit

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: options.messages,
        temperature: options.temperature ?? 0.1,
        max_tokens: options.maxTokens ?? 4096,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NVIDIA API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("NVIDIA API returned empty content");
    }

    return content;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error(`NVIDIA API timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
}

/**
 * Unified AI call — tries NVIDIA first if USE_NVIDIA=true, otherwise falls back to Gemini.
 * Returns raw text response (usually JSON) for parsing.
 */
export async function unifiedGenerateContent({
  prompt,
  systemPrompt,
  temperature = 0.1,
  maxTokens = 8192,
}: {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const useNvidia = process.env.USE_NVIDIA === "true";

  if (useNvidia) {
    try {
      const messages: NvidiaMessage[] = [];
      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
      }
      messages.push({ role: "user", content: prompt });

      const text = await nvidiaChatCompletion({ messages, temperature, maxTokens });
      return text;
    } catch (nvidiaError) {
      console.error("NVIDIA failed, falling back to Gemini:", nvidiaError);
      // Fall through to Gemini
    }
  }

  // Gemini fallback
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const { DEFAULT_SAFETY_SETTINGS } = await import("./gemini-utils");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
      responseMimeType: "application/json",
    },
    safetySettings: DEFAULT_SAFETY_SETTINGS,
  });

  const result = await model.generateContent(prompt);
  const geminiResult = safeGeminiText(result.response);

  if (geminiResult.blocked) {
    throw new Error(`Gemini blocked: ${geminiResult.reason}`);
  }

  return geminiResult.text;
}
