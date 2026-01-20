
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyDKARQBSTtQjVtWk_FoSQZpC8uGYuQ-YTU");

async function list() {
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // dummy
    // Actually there is no direct listModels in the standard SDK easily accessible without auth that might fail.
    // But we can try to generate a simple content with different names.
    const names = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"];
    for (const name of names) {
      try {
        const model = genAI.getGenerativeModel({ model: name });
        await model.generateContent("hi");
        console.log(`Model ${name} is available`);
      } catch (e) {
        console.log(`Model ${name} is NOT available: ${e.message}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
list();
