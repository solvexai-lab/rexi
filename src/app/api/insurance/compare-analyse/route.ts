import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    getClientIP,
    checkRateLimit,
    rateLimitedResponse,
    addSecurityHeaders,
    validateRequestOrigin,
    logSecurityEvent,
} from "@/lib/security";
import type { ExtractedInsurer, InsuranceCompareResult } from "@/lib/insurance/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    const clientIP = getClientIP(req);

    if (!validateRequestOrigin(req)) {
        logSecurityEvent("INVALID_ORIGIN_COMPARE_ANALYSE", { ip: clientIP });
        return addSecurityHeaders(NextResponse.json({ error: "Invalid request origin" }, { status: 403 }));
    }

    const rateLimit = await checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
        logSecurityEvent("RATE_LIMIT_COMPARE_ANALYSE", { ip: clientIP });
        return rateLimitedResponse(rateLimit.resetIn);
    }

    let body: { insurers: ExtractedInsurer[] };
    try {
        body = await req.json();
    } catch {
        return addSecurityHeaders(NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }));
    }

    const { insurers } = body;
    if (!insurers || !Array.isArray(insurers) || insurers.length < 2) {
        return addSecurityHeaders(
            NextResponse.json({ error: "At least 2 insurer documents required" }, { status: 400 })
        );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return addSecurityHeaders(NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 }));
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-preview-05-20",
        generationConfig: { temperature: 0.1, maxOutputTokens: 8192 },
    });

    const insurerSummary = insurers.map((ins, i) => ({
        index: i,
        insurerName: ins.insurerName,
        documentType: ins.documentType,
        premium: ins.premium,
        idv: ins.idv,
        compulsoryDeductible: ins.compulsoryDeductible,
        voluntaryDeductible: ins.voluntaryDeductible,
        totalDeductible: (ins.compulsoryDeductible || 0) + (ins.voluntaryDeductible || 0),
        ncb: ins.ncb,
        coverages: ins.coverages,
    }));

    const prompt = `You are REXI, an expert motor insurance advisor Globally. Compare these ${insurers.length} insurance documents and respond with ONLY valid JSON (no markdown, no explanation).

INSURER DATA:
${JSON.stringify(insurerSummary, null, 2)}

COVERAGE KEYS:
hasOwnDamage, hasThirdPartyLiability, hasZeroDepreciation, hasEngineProtection, hasReturnToInvoice, hasNCBProtection, hasRoadsideAssistance

Return this EXACT JSON structure (use insurer indexes 0-${insurers.length - 1} throughout):
{
  "winners": {
    "bestValue": { "insurerIndex": 0, "reason": "Lowest premium with Zero Dep included" },
    "bestCovered": { "insurerIndex": 1, "reason": "All 7 add-ons covered" },
    "lowestRisk": { "insurerIndex": 0, "reason": "Lowest deductible, NCB protected" }
  },
  "comparisonRows": [
    { "feature": "Annual Premium", "description": "Total yearly cost", "values": [
      { "insurerIndex": 0, "value": "₹12,500", "covered": null, "isWinner": true },
      { "insurerIndex": 1, "value": "₹14,800", "covered": null, "isWinner": false }
    ]},
    { "feature": "IDV (Max Payout)", "description": "What insurer pays for total loss", "values": [...]},
    { "feature": "Compulsory Deductible", "description": "You always pay this per claim", "values": [...]},
    { "feature": "Voluntary Deductible", "description": "Extra you opted to pay", "values": [...]},
    { "feature": "Total Deductible", "description": "Your out-of-pocket minimum per claim", "values": [...]},
    { "feature": "Own Damage", "description": "Covers your vehicle damage", "values": [{ "covered": true/false }...]},
    { "feature": "Third Party", "description": "Covers damage to others", "values": [...]},
    { "feature": "Zero Depreciation", "description": "Full claim without depreciation cuts", "values": [...]},
    { "feature": "Engine Protection", "description": "Water/oil damage to engine covered", "values": [...]},
    { "feature": "Return to Invoice", "description": "Total loss = original invoice value", "values": [...]},
    { "feature": "NCB Protection", "description": "Keep bonus even after a claim", "values": [...]},
    { "feature": "Roadside Assistance", "description": "Towing, emergency help 24x7", "values": [...]}
  ],
  "riskMatrix": [
    { "riskId": "zero-dep", "title": "Zero Depreciation Missing", "severity": "HIGH", "values": [
      { "insurerIndex": 0, "status": "covered" },
      { "insurerIndex": 1, "status": "missing" }
    ]},
    { "riskId": "engine-protect", "title": "Engine Protection Missing", "severity": "MEDIUM", "values": [...]},
    { "riskId": "rti", "title": "Return to Invoice Missing", "severity": "MEDIUM", "values": [...]},
    { "riskId": "ncb-protect", "title": "NCB Not Protected", "severity": "LOW", "values": [...]},
    { "riskId": "roadside", "title": "No Roadside Assistance", "severity": "LOW", "values": [...]},
    { "riskId": "high-deductible", "title": "High Total Deductible (>₹5000)", "severity": "MEDIUM", "values": [...]}
  ],
  "claimScenarios": [
    {
      "scenarioName": "Fender Bender",
      "description": "Minor accident — bumper, headlight damage (₹15,000 repair)",
      "repairCost": 15000,
      "costs": [
        { "insurerIndex": 0, "youPay": 1500, "insurerPays": 13500 },
        { "insurerIndex": 1, "youPay": 7000, "insurerPays": 8000 }
      ]
    },
    {
      "scenarioName": "Monsoon Nightmare",
      "description": "Engine flooded, water seepage damage (₹80,000 repair)",
      "repairCost": 80000,
      "costs": [...]
    },
    {
      "scenarioName": "Total Loss",
      "description": "Vehicle stolen or beyond repair",
      "repairCost": -1,
      "costs": [...]
    }
  ],
  "summary": "2-3 sentence plain English summary of the key differences",
  "detailedAnalysis": "## Detailed Comparison\\n\\nMarkdown formatted deep-dive covering premium value, coverage gaps, risk profile, hidden costs, and final recommendation."
}

RULES:
- For claimScenarios, if engine protection is missing, youPay = full repair cost (₹80,000). If covered, youPay = totalDeductible only.
- For Total Loss scenario, if RTI missing, youPay = IDV * 0.2 (depreciation). If RTI covered, youPay = 0.
- For Fender Bender, if Zero Dep missing, youPay = totalDeductible + ₹6,000 depreciation. If covered, youPay = totalDeductible.
- "covered" field in comparisonRows: use null for numeric rows (premium, IDV, deductible), true/false for boolean coverage rows.
- For riskMatrix "status": "covered" if feature present, "missing" if absent, "partial" if unclear.
- repairCost of -1 means "use IDV". In costs, calculate based on actual IDV of each insurer.
- isWinner: for numeric rows (lower is better for cost, higher for IDV), mark the best value true.
- RETURN ONLY JSON. No explanation outside JSON.`;

    let responseText: string;
    try {
        const result = await model.generateContent(prompt);
        responseText = result.response.text().trim();
    } catch (err: any) {
        console.error("[compare-analyse] Gemini error:", err);
        return addSecurityHeaders(NextResponse.json({ error: "AI comparison failed. Please try again." }, { status: 500 }));
    }

    // Strip markdown code blocks if present
    if (responseText.includes("```json")) {
        responseText = responseText.split("```json")[1].split("```")[0].trim();
    } else if (responseText.startsWith("```")) {
        responseText = responseText.split("```")[1].split("```")[0].trim();
    }

    let parsed: InsuranceCompareResult;
    try {
        parsed = JSON.parse(responseText);
    } catch {
        // Try JSON repair
        try {
            const match = responseText.match(/\{[\s\S]*\}/);
            if (match) parsed = JSON.parse(match[0]);
            else throw new Error("No JSON found");
        } catch {
            console.error("[compare-analyse] JSON parse failed. Raw:", responseText.slice(0, 300));
            return addSecurityHeaders(
                NextResponse.json({ error: "AI returned invalid format. Please try again." }, { status: 500 })
            );
        }
    }

    return addSecurityHeaders(NextResponse.json(parsed));
}
