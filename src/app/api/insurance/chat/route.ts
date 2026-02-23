
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAnalysis } from "@/lib/insurance/database";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const { message, analysisId } = await req.json();

        if (!message || !analysisId) {
            return NextResponse.json({ error: "Missing message or analysisId" }, { status: 400 });
        }

        // 1. Fetch Policy Context
        const analysis = await getAnalysis(analysisId);

        if (!analysis) {
            return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
        }

        const { rawText, policyData, documentType } = analysis;

        // 2. Prepare Context (Limit text length)
        const contextText = rawText ? rawText.slice(0, 20000) : "No raw text available.";

        // 3. Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.2, // Low temp for factual answers
                maxOutputTokens: 500,
            }
        });

        // 4. Construct Prompt
        const prompt = `
You are Rexi, an expert insurance consultant.
Your goal is to explain the user's policy in simple terms and advise on scenarios.

CONTEXT:
- Document Type: ${documentType}
- Insurer: ${policyData?.insurerName || 'Unknown'}
- Vehicle: ${policyData?.vehicleInfo?.make} ${policyData?.vehicleInfo?.model} (${policyData?.vehicleInfo?.registrationNo})
- IDV (Max Payout): ${policyData?.idv}
- Premium: ${policyData?.premium}
- Expiry Date: ${policyData?.expiryDate || 'N/A'}

DETECTED COVERAGES (Facts):
${JSON.stringify(policyData?.coverages, null, 2)}

DETECTED RISKS (Warnings):
${JSON.stringify(analysis.riskFlags?.map(r => r.title), null, 2)}

POLICY TEXT SNIPPET:
"""
${contextText}
"""

USER QUESTION: "${message}"

INSTRUCTIONS:
1. **Source of Truth:** Start by checking the **POLICY TEXT SNIPPET** above.
    - If the info is there, say: "According to your policy document..." or "Your policy explicitly states..."
    - If NOT there, use general knowledge but say: "While your specific document doesn't detail this, standard policies usually cover..."
2. **Handle Scenarios:** Explain the process clearly.
   - *Example:* "If you hit another car, your Third Party liability (which is included) will pay for their damages, while your Own Damage cover pays for your repairs."
3. **Use Specifics:** Mention the exact IDV (${policyData?.idv}) or limits found in the text.
    - If the user asks about a limit that is in the text (like Deductible), find it and quote it.
4. **Clarify Missing Cover:** If a coverage is MISSING (e.g., no Zero Dep), warn them clearly.
5. **Tone:** Professional, empathetic, and clear. Avoid jargon. Use **bold** for amounts and key terms.

ANSWER:`;

        // 5. Generate Response
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        return NextResponse.json({ response });

    } catch (error: any) {
        console.error("Rexi Chat Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
