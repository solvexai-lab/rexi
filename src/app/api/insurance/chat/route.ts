import { NextRequest, NextResponse } from "next/server";
import { getGenAI } from "@/lib/ai-clients";
import { getAnalysis } from "@/lib/insurance/database";
import {
    getClientIP,
    checkRateLimit,
    rateLimitedResponse,
    validateRequestOrigin,
    logSecurityEvent,
    CHAT_RATE_LIMIT,
} from "@/lib/security";

export const maxDuration = 60;
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    // Bug #1 fix: origin validation + rate limiting (100/hr for chat sessions)
    const clientIP = getClientIP(req);

    if (!validateRequestOrigin(req)) {
        logSecurityEvent("INVALID_ORIGIN_MOTOR_CHAT", { ip: clientIP });
        return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const rateLimit = await checkRateLimit(clientIP, CHAT_RATE_LIMIT);
    if (!rateLimit.allowed) {
        logSecurityEvent("RATE_LIMIT_MOTOR_CHAT", { ip: clientIP });
        return rateLimitedResponse(rateLimit.resetIn);
    }

    try {
        const { message, analysisId } = await req.json();

        if (!message || typeof message !== "string" || !message.trim()) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }
        if (message.length > 2000) {
            return NextResponse.json({ error: "Message too long (max 2000 characters)" }, { status: 400 });
        }

        const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!analysisId || !UUID_REGEX.test(analysisId)) {
            return NextResponse.json({ error: "Invalid analysis ID" }, { status: 400 });
        }

        const safeMessage = message.replace(/["\\]/g, (c) => `\\${c}`).replace(/\n{3,}/g, "\n\n");

        // 1. Fetch Policy Context
        const analysis = await getAnalysis(analysisId);

        if (!analysis) {
            return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
        }

        const { rawText, policyData, documentType } = analysis;

        // Bug #4 fix: context window raised from 20K to 100K chars
        // Gemini 2.0 Flash has 1M token context; 100K chars ≈ 25K tokens — fully safe
        const contextText = rawText ? rawText.slice(0, 100000) : "No raw text available.";

        // 2. Initialize Gemini (inside handler to avoid cold-start env issues)
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-preview-05-20",
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 500,
            },
        });

        // 3. Construct Prompt
        const isBrochure = documentType === "brochure";
        const brochureData = analysis.brochureData as any;

        const prompt = isBrochure
            ? `You are Rexi, an expert motor insurance consultant.
The user uploaded a BROCHURE (not a policy), so premium, IDV, and claim figures are not available — those are determined at purchase time.

CONTEXT:
- Document Type: Brochure
- Insurer: ${brochureData?.insurerName || "Unknown"}
- Product: ${brochureData?.productName || "Motor Insurance"}
- Features Offered: ${(brochureData?.featuresOffered ?? []).join(", ") || "See brochure text"}
- Exclusions: ${(brochureData?.exclusions ?? []).join(", ") || "See brochure text"}
- Cashless Garages: ${brochureData?.cashlessGarages ?? "Not specified"}

BROCHURE TEXT:
"""
${contextText}
"""

USER QUESTION: "${safeMessage}"

INSTRUCTIONS:
1. Answer based on the brochure content above.
2. Clearly note that exact premium/IDV figures are not in a brochure — they depend on the vehicle and are confirmed at purchase.
3. Be helpful, concise, and use **bold** for key terms.

ANSWER:`
            : `You are Rexi, an expert insurance consultant.
Your goal is to explain the user's policy in simple terms and advise on scenarios.

CONTEXT:
- Document Type: ${documentType}
- Insurer: ${policyData?.insurerName || "Unknown"}
- Vehicle: ${policyData?.vehicleInfo?.make} ${policyData?.vehicleInfo?.model} (${policyData?.vehicleInfo?.registrationNo})
- IDV (Max Payout): ₹${policyData?.idv}
- Premium: ₹${policyData?.premium}
- Expiry Date: ${policyData?.expiryDate || "N/A"}

DETECTED COVERAGES (Facts):
${JSON.stringify(policyData?.coverages, null, 2)}

DETECTED RISKS (Warnings):
${JSON.stringify(analysis.riskFlags?.map((r) => r.title), null, 2)}

FULL POLICY TEXT (use this for precise clause answers):
"""
${contextText}
"""

USER QUESTION: "${safeMessage}"

INSTRUCTIONS:
1. **Source of Truth:** Start by checking the **FULL POLICY TEXT** above.
    - If the info is there, say: "According to your policy document..." or "Your policy explicitly states..."
    - If NOT there, use general knowledge but say: "While your specific document doesn't detail this, standard policies usually cover..."
2. **Handle Scenarios:** Explain the process clearly.
3. **Use Specifics:** Mention the exact IDV (₹${policyData?.idv}) or limits found in the text.
4. **Clarify Missing Cover:** If a coverage is MISSING (e.g., no Zero Dep), warn them clearly.
5. **Tone:** Professional, empathetic, and clear. Avoid jargon. Use **bold** for amounts and key terms.

ANSWER:`;

        // 4. Generate Response
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        return NextResponse.json({ response });
    } catch (error: any) {
        console.error("Motor Insurance Chat Error:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
