/**
 * Shared AI client singletons.
 * Module-level instances are safe in Next.js serverless — one instance
 * per warm container, connection-reused across requests.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Mistral } from "@mistralai/mistralai";

let _genAI: GoogleGenerativeAI | null = null;
let _mistral: Mistral | null = null;

export function getGenAI(): GoogleGenerativeAI {
    if (!_genAI) {
        const key = process.env.GEMINI_API_KEY;
        if (!key) throw new Error("GEMINI_API_KEY is not configured");
        _genAI = new GoogleGenerativeAI(key);
    }
    return _genAI;
}

export function getMistralClient(): Mistral {
    if (!_mistral) {
        const key = process.env.MISTRAL_API_KEY;
        if (!key) throw new Error("MISTRAL_API_KEY is not configured");
        _mistral = new Mistral({ apiKey: key });
    }
    return _mistral;
}
