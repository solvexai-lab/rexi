
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testPrompt() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not found in .env.local");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const text = "The Contractor shall indemnify the Company against any and all claims without limitation of liability. The recipient shall keep all information confidential forever.";

  const prompt = `
You are an elite legal analyst providing INFORMATIONAL analysis. You DO NOT provide legal advice.

Analyze the following document for legal risks, predatory clauses, and industry-specific flaws.

CRITICAL FRAMING RULES:
1. Use SIMPLE, PLAIN ENGLISH in all interpretations. Avoid complex legal jargon. Explain concepts clearly for a non-technical business owner.
2. Use COMPARATIVE language, not PRESCRIPTIVE commands
3. Say "commonly interpreted as" not "this means"
4. Say "typical variations include" not "you should use"
5. Say "discussion points to consider" not "say this to them"
6. Provide confidence scores (0.0-1.0) for each finding
7. Include interpretation limits and context dependencies
8. Frame alternatives as "illustrative examples" not recommendations

For each issue found, return this EXACT JSON structure:

{
  "clauses": [
    {
      "clause_id": "clause_X",
      "clause_text_excerpt": "exact text from contract (max 300 chars)",
      "risk_signal": {
        "label": "Name of the risk pattern (Simple Name)",
        "severity": "critical|high|medium|low",
        "confidence": 0.87,
        "jurisdiction_assumptions": ["Common Law", "US-based"],
        "context_dependence": "High|Medium|Low"
      },
      "plain_english_interpretation": {
        "summary": "Simple, direct explanation of what this clause does in everyday language...",
        "why_it_matters": [
          "Explain why this matters to a normal person...",
          "Describe a real-world scenario where this could be a problem..."
        ],
        "interpretation_limits": "Interpretation depends on full contract context and applicable law."
      },
      "discussion_talking_points": {
        "purpose": "Inform discussion, not legal advice",
        "points": [
          "Simple question to ask the other party...",
          "Practical point to bring up during a meeting...",
          "Clear way to express a concern without using legal terms"
        ]
      }
    }
  ],
  "summary": {
    "overallSummary": "A very simple, high-level overview of the document in plain English..."
  }
}

Contract text:
${text}
`;

  console.log("Generating response...");
  const result = await model.generateContent(prompt);
  const response = await result.response;
  console.log("Response received:");
  console.log(response.text());
}

testPrompt();
