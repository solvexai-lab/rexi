import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import {
    getClientIP,
    checkRateLimit,
    rateLimitedResponse,
    validateRequestOrigin,
    logSecurityEvent,
    CHAT_RATE_LIMIT,
} from "@/lib/security";

// Initialize Supabase Client (safe at module level — no API keys needed from env here)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ChatContext = 'insurance' | 'offer' | 'contract';

// Helper to truncate text to fit context window safely
function truncate(text: string, maxLength: number): string {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "...[TRUNCATED]" : text;
}

export async function POST(req: NextRequest) {
    // Bug #1 fix: origin validation + rate limiting (100/hr for chat sessions)
    const clientIP = getClientIP(req);

    if (!validateRequestOrigin(req)) {
        logSecurityEvent("INVALID_ORIGIN_REXI_CHAT", { ip: clientIP });
        return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
    }

    const rateLimit = await checkRateLimit(clientIP, CHAT_RATE_LIMIT);
    if (!rateLimit.allowed) {
        logSecurityEvent("RATE_LIMIT_REXI_CHAT", { ip: clientIP });
        return rateLimitedResponse(rateLimit.resetIn);
    }

    // Bug #8 fix: initialise Gemini client INSIDE the handler so GEMINI_API_KEY
    // is guaranteed to be resolved from env at request time, not at cold-start.
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1000,
        },
    });

    try {
        const { message, analysisId, context } = await req.json();

        if (!message || !analysisId || !context) {
            return NextResponse.json({ error: "Missing required fields: message, analysisId, context" }, { status: 400 });
        }

        let rawText = "";
        let structuredContext: any = {};
        let systemPrompt = "";

        // --- 1. DATA FETCHING (Hybrid RAG) ---
        if (context === 'insurance') {
            // Strategy: Insurance DB has columns for structured data
            const { data, error } = await supabase
                .from('insurance_analyses')
                .select('*')
                .eq('id', analysisId)
                .single();

            if (error || !data) throw new Error("Insurance analysis not found");

            rawText = data.raw_text;
            structuredContext = {
                insurer: data.insurer_name,
                idv: data.idv,
                premium: data.premium,
                coverages: data.coverages,
                risks: data.risk_flags,
                vehicle: {
                    make: data.vehicle_make,
                    model: data.vehicle_model,
                    reg: data.vehicle_registration
                }
            };

            systemPrompt = `You are Rexi, an expert Insurance Consultant.
GOAL: Explain policy coverage, simulate claim scenarios, and identify gaps.
SOURCE OF TRUTH:
1. **Structured Data (PRIMARY)**: Use the provided JSON strictly for IDV, Premium, and Coverages.
2. **Raw Text (SECONDARY)**: Use to cite specific definitions or exclusions.
TONE: Empathetic, clear, factual.
CRITICAL INSTRUCTIONS:
- If 'coverages.hasZeroDepreciation' is false, you MUST warn the user about depreciation costs in case of a claim.
- Use the exact 'idv' amount when discussing Total Loss or Theft.
- Do NOT hallucinate coverages not listed in the JSON.`;

        } else if (context === 'offer' || context === 'contract') {
            // Strategy: Document DB stores JSON analysis in 'analysis_result' column
            const { data, error } = await supabase
                .from('document_analyses')
                .select('raw_text, analysis_result')
                .eq('id', analysisId)
                .single();

            if (error || !data) throw new Error("Document analysis not found");

            rawText = data.raw_text;

            if (context === 'offer') {
                // Focus on Financials
                const analysis = data.analysis_result;
                structuredContext = {
                    summary: analysis.summary,
                    salaryBreakdown: analysis.offer?.salaryBreakdown,
                    marketComparison: analysis.marketComparison,
                    risks: analysis.risks
                };

                systemPrompt = `You are Rexi, a sharp and direct Salary Negotiation Coach.
GOAL: Give short, punchy advice to maximize pay.
SOURCE OF TRUTH:
1. **Structured Analysis (PRIMARY)**: Use JSON for numbers.
2. **Raw Text (SECONDARY)**: Use only if needed.
TONE: Crisp, simple, direct. No corporate jargon.
CRITICAL INSTRUCTIONS:
- Answer the user's question FIRST in one sentence.
- Use bullet points for details.
- Keep the total response under 150 words if possible.
- Use simple English (Grade 8 reading level).
- **DO NOT** use phrases like 'The agreement states...' or 'Clause X says...'. Just say 'Your deposit is...'`;

            } else { // context === 'contract'
                const analysis = data.analysis_result;
                structuredContext = {
                    summary: analysis.summary,
                    clauses: analysis.clauses,
                    compliance: analysis.legal_compliance_summary
                };

                systemPrompt = `You are Rexi, a no-nonsense Legal Analyst.
GOAL: Protect the user with simple, direct answers.
SOURCE OF TRUTH:
1. **Structured Analysis (PRIMARY)**: Use 'clauses' from JSON.
2. **Raw Text (SECONDARY)**: Use for specifics.
TONE: Extremely crisp, simple, and to the point.
CRITICAL INSTRUCTIONS:
- **DIRECT ANSWER FIRST**: Start with the exact answer (e.g., "Your deposit is ₹1,20,000.").
- **SIMPLE ENGLISH**: Explain like you are talking to a friend, not a lawyer.
- **NO FLUFF**: Remove words like "It is important to note," "Furthermore," or "Additionally."
- **Focus on the 'What' and 'Who'**: Who pays? How much?
- Highlight conflicts in **bold** but keep it brief.
- If a clause is bad, say "This is bad because..." simply.
FORMATTING:
- Max 3-4 short sentences per point.
- Use **bold** for key numbers.`;
            }
        } else {
            return NextResponse.json({ error: "Invalid context" }, { status: 400 });
        }

        // Context Window Safety: Gemini 2.0 Flash has 1M token context.
        // 100k chars ≈ 25k tokens — safe for full policy documents.
        const safeRawText = truncate(rawText, 100000);

        const finalPrompt = `
${systemPrompt}

=============
STRUCTURED ANALYSIS (High Confidence data - PREFER THIS):
${JSON.stringify(structuredContext, null, 2)}
=============

=============
DOCUMENT TEXT EXCERPT (Reference material):
"""
${safeRawText}
"""
=============

USER QUESTION: "${message}"

ANSWER:
`;

        // --- 3. GENERATION ---
        const result = await model.generateContent(finalPrompt);
        const responseText = result.response.text();

        return NextResponse.json({ response: responseText });

    } catch (error: any) {
        console.error("Rexi Unified Chat Error:", error);
        return NextResponse.json({ error: "Failed to generate response. Please try again." }, { status: 500 });
    }
}
