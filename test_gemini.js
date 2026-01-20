import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: '.env.local' });

async function main() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There is no listModels on GoogleGenerativeAI class usually in older versions
    // Let's try a different approach to check if we can even hit the API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-1.5-flash-latest:", result.response.text());
  } catch (e) {
    console.error("Error with gemini-1.5-flash-latest:", e.message);
  }
}
main();
