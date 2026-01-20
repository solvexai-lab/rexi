
const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
  const genAI = new GoogleGenerativeAI(apiKey);
  console.log("Checking gemini-pro...");
  try {
    const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent("Hi");
    console.log("Success with gemini-pro");
  } catch (e) {
    console.log("Failed with gemini-pro:", e.message);
  }
}

listModels();
