import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).listModels();
  // Wait, listModels is on the genAI object or via a client?
  // Let's use the REST API approach or check documentation if possible.
  // Actually, I'll just try 'gemini-1.5-flash-latest' first as it's common.
}
