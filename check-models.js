
const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
  const genAI = new GoogleGenerativeAI(apiKey);
  const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  // There is no listModels in the client SDK usually, we have to use the REST API
  // or check if the SDK has it now.
  console.log("Checking model...");
  try {
    const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent("Hi");
    console.log("Success with gemini-1.5-flash");
  } catch (e) {
    console.log("Failed with gemini-1.5-flash:", e.message);
  }

  try {
    const result = await genAI.getGenerativeModel({ model: "gemini-1.5-pro" }).generateContent("Hi");
    console.log("Success with gemini-1.5-pro");
  } catch (e) {
    console.log("Failed with gemini-1.5-pro:", e.message);
  }
}

listModels();
