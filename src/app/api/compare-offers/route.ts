import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getClientIP,
  checkRateLimit,
  rateLimitedResponse,
  sanitizeText,
  addSecurityHeaders,
  validateRequestOrigin,
  logSecurityEvent,
} from "@/lib/security";
import type { OfferComparisonResponse, OfferAnalysisResponse } from "@/lib/types/offer-analysis";
import { normalizeSalaryToCity, formatINR } from "@/lib/salary-engine";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DISCLAIMER = "This comparison is for informational purposes only and does not constitute legal or financial advice. Always consult with appropriate professionals before making career decisions.";

export async function POST(req: NextRequest) {
  const clientIP = getClientIP(req);

  if (!validateRequestOrigin(req)) {
    logSecurityEvent("INVALID_ORIGIN", { ip: clientIP, origin: req.headers.get("origin") });
    return addSecurityHeaders(
      NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
    );
  }

  const rateLimit = await checkRateLimit(clientIP);
  if (!rateLimit.allowed) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { ip: clientIP });
    return rateLimitedResponse(rateLimit.resetIn);
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
      );
    }

    const { offers, perspective = "balanced" } = body as {
      offers: OfferAnalysisResponse[];
      perspective?: "balanced" | "money" | "stability" | "growth"
    };

    if (!offers || !Array.isArray(offers) || offers.length < 2) {
      return addSecurityHeaders(
        NextResponse.json({ error: "At least 2 offers required for comparison" }, { status: 400 })
      );
    }

    if (offers.length > 5) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Maximum 5 offers allowed for comparison" }, { status: 400 })
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 })
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
      },
    });

    const offersData = offers.map((o, i) => {
      const year1Ctc = o.offer?.economicAnalysis?.year1EffectiveCTC || o.offer?.salaryBreakdown?.totalCTC || o.offer?.baseSalary || 0;
      const year2Ctc = o.offer?.economicAnalysis?.year2SteadyCTC || o.offer?.salaryBreakdown?.totalCTC || o.offer?.baseSalary || 0;
      const city = o.offer?.location || "Bengaluru";
      const normalizedSalary = normalizeSalaryToCity(year2Ctc, city, "Pune");

      return {
        id: o.offer?.id || `offer-${i + 1}`,
        company: o.offer?.company || "Unknown Company",
        role: o.offer?.role || "Unknown Role",
        baseSalary: o.offer?.baseSalary || 0,
        currency: o.offer?.currency || "INR",
        bonus: o.offer?.bonus || 0,
        bonusPercentage: o.offer?.bonusPercentage || 0,
        bonusIsVariable: o.offer?.bonusIsVariable || false,
        bonusCondition: o.offer?.bonusCondition || null,
        equity: o.offer?.equity,
        benefits: o.offer?.benefits || [],
        pto: o.offer?.pto || "Not specified",
        ptoCarryForward: o.offer?.ptoCarryForward || null,
        location: o.offer?.location || "Not specified",
        workMode: o.offer?.workMode || "Not specified",
        noticePeriod: o.offer?.noticePeriod || "Not specified",
        noticeBuyoutAllowed: o.offer?.noticeBuyoutAllowed ?? null,
        nonCompete: o.offer?.nonCompete,
        signingBonus: o.offer?.signingBonus || 0,
        probationPeriod: o.offer?.probationPeriod || "Not specified",
        probationNoticePeriod: o.offer?.probationNoticePeriod || null,
        bondPeriod: o.offer?.bondPeriod || null,
        bondAmount: o.offer?.bondAmount || 0,
        overallScore: o.overallScore || 0,
        risks: o.risks || [],
        riskCount: o.risks?.length || 0,
        criticalRisks: o.risks?.filter((r: any) => r.severity === 'critical').length || 0,
        highRisks: o.risks?.filter((r: any) => r.severity === 'high').length || 0,
        year1EffectiveCTC: year1Ctc,
        year2SteadyCTC: year2Ctc,
        joiningBonus: o.offer?.oneTimeBenefits?.joiningBonus || 0,
        relocationAllowance: o.offer?.oneTimeBenefits?.relocationAllowance || 0,
        clawbackMonths: o.offer?.oneTimeBenefits?.joiningBonusClawbackMonths || 0,
        livabilityIndex: o.offer?.economicAnalysis?.livabilityIndex || 0,
        livabilityGrade: o.offer?.economicAnalysis?.livabilityGrade || "Unknown",
        savingsRateYear1: o.offer?.economicAnalysis?.savingsRateYear1 || 0,
        savingsRateYear2: o.offer?.economicAnalysis?.savingsRateYear2 || 0,
        cityCluster: o.offer?.economicAnalysis?.cityEconomics?.cluster || "C",
        monthlyCost: o.offer?.economicAnalysis?.cityEconomics?.adjustedMonthlyCost || 0,
        clawbackRiskLevel: o.offer?.economicAnalysis?.clawbackRisk?.riskLevel || 'low',
        normalizedSalaryPuneEquivalent: normalizedSalary,
      };
    });

    const prompt = `You are REXI - an expert career advisor specializing Globallyn job market. Compare these job offers and respond with ONLY valid JSON (no markdown, no explanation).

PERSPECTIVE: ${perspective}
- balanced: Equal weight to all factors
- money: Focus on compensation (60% weight)
- stability: Focus on job security and low risk (50% weight)
- growth: Focus on equity and career growth (50% weight)

STRICT RULES FOR DATA CONSISTENCY:
1. You MUST use the "overallScore" provided in the input for each offer in your "offers" array. DO NOT change it.
2. Use "normalizedSalaryPuneEquivalent" for fair city-adjusted comparison (all salaries normalized to Pune cost of living).
3. For the "comparisonMatrix", ensure the values match the input exactly (e.g., if Base Salary is 1000000, show "₹10 LPA").
4. Consider "year1EffectiveCTC" vs "year2SteadyCTC" - Year 1 includes bonuses, Year 2 is steady state.
5. Factor in "livabilityIndex" - higher is better (shows how many times take-home covers monthly costs).
6. Consider "clawbackMonths" as a risk factor - longer clawback = more "trapped" period.

=== INTELLIGENT COMPARISON FACTORS ===

**BONUS COMPARISON**:
- If "bonusIsVariable" is true, the bonus is NOT guaranteed (e.g., "up to 20%"). Display as "Up to ₹X" and penalize slightly in stability score.
- Use "bonusCondition" text if available for accurate description (e.g., "up to 20% based on performance rating").
- Compare GUARANTEED vs VARIABLE pay - guaranteed pay is more valuable for stability.

**RISK COMPARISON**:
- Use "riskCount", "criticalRisks", "highRisks" to compare risk profiles.
- An offer with 0 critical risks is significantly safer than one with 2+ critical risks.
- Consider "bondPeriod" and "bondAmount" as major risk factors - a 2-year bond with ₹2L penalty is a red flag.
- Factor "clawbackRiskLevel" (low/medium/high) into the risk score.

**HIDDEN TRAPS TO HIGHLIGHT**:
- Long notice periods (90+ days) with no buyout option ("noticeBuyoutAllowed": false) = trapped
- Probation period with short notice ("probationNoticePeriod": "7 days") = risky first months
- Non-compete clauses with broad scope = career limitation
- Low "savingsRateYear2" (<15%) = living paycheck to paycheck

**WORK-LIFE FACTORS**:
- "workMode": Full Remote > Hybrid 2-day > Hybrid 3-day > Office 5-day
- "pto" and "ptoCarryForward" - more PTO and carry-forward is better
- Location cluster matters for quality of life

OFFERS DATA:
${JSON.stringify(offersData, null, 2)}

Return this exact JSON structure (use the EXACT "id" values from above for all offerId fields):
{
"offers": [
{ "offerId": "exact-id-from-above", "company": "Company Name", "role": "Role", "totalCompensation": 0, "baseSalary": 0, "bonus": 0, "bonusIsVariable": false, "equityValue": 0, "benefitsScore": 80, "workLifeScore": 75, "riskScore": 70, "overallScore": 0 }
],

  "recommendation": {
    "bestOverall": "exact-id-of-best",
    "bestCompensation": "exact-id-of-highest-pay",
    "bestWorkLife": "exact-id-of-best-wlb",
    "lowestRisk": "exact-id-of-safest"
  },
  "comparisonMatrix": [
      { "category": "Base Salary (Guaranteed)", "values": [{ "offerId": "id1", "value": "₹X LPA", "winner": true }, { "offerId": "id2", "value": "₹Y LPA", "winner": false }] },
      { "category": "Bonus", "values": [{ "offerId": "id1", "value": "₹X (Guaranteed)" or "Up to ₹X (Variable)", "winner": true }] },
      { "category": "Year 1 Total (with bonuses)", "values": [...] },
      { "category": "Year 2+ Steady CTC", "values": [...] },
      { "category": "City-Adjusted Value (Pune eq.)", "values": [...] },
      { "category": "Livability Index", "values": [...] },
      { "category": "Savings Rate (Year 2)", "values": [...] },
      { "category": "Joining Bonus", "values": [...] },
      { "category": "Clawback Risk", "values": [{ "value": "Low (6 months)" or "High (24 months)", "winner": ... }] },
      { "category": "Risk Profile", "values": [{ "value": "X critical, Y high risks", "winner": lower is better }] },
      { "category": "Bond/Lock-in", "values": [{ "value": "None" or "24 months (₹2L penalty)", "winner": None is better }] },
      { "category": "Notice Period", "values": [{ "value": "30 days (buyout OK)" or "90 days (no buyout)", "winner": shorter + buyout is better }] },
      { "category": "Work Mode", "values": [...] },
      { "category": "PTO", "values": [...] },
      { "category": "Benefits", "values": [...] }
    ],
  "summary": "Brief comparison summary highlighting key differences, especially around guaranteed vs variable pay and risk profiles",
  "detailedAnalysis": "## Detailed breakdown\\n\\nMarkdown formatted analysis including:\\n- Compensation comparison (guaranteed vs variable)\\n- Risk profile comparison\\n- Hidden traps in each offer\\n- Recommendation rationale"
}

IMPORTANT: Return ONLY the JSON object, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text().trim();

    // Clean up markdown code blocks if present
    if (responseText.includes("```json")) {
      responseText = responseText.split("```json")[1].split("```")[0].trim();
    } else if (responseText.includes("```")) {
      responseText = responseText.split("```")[1].split("```")[0].trim();
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch {
      console.error("Initial comparison JSON parse failed. First 500 chars:", responseText.substring(0, 500));

      let repairedText = responseText;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        repairedText = jsonMatch[0];
      }

      try {
        parsedResponse = JSON.parse(repairedText);
      } catch {
        const openBraces = (repairedText.match(/\{/g) || []).length;
        const closeBraces = (repairedText.match(/\}/g) || []).length;
        const openBrackets = (repairedText.match(/\[/g) || []).length;
        const closeBrackets = (repairedText.match(/\]/g) || []).length;

        for (let i = 0; i < openBrackets - closeBrackets; i++) repairedText += "]";
        for (let i = 0; i < openBraces - closeBraces; i++) repairedText += "}";

        try {
          parsedResponse = JSON.parse(repairedText);
        } catch {
          console.error("All comparison JSON parse attempts failed. Raw text length:", responseText.length);
          return addSecurityHeaders(
            NextResponse.json({ error: "AI returned invalid comparison format. Please try again." }, { status: 500 })
          );
        }
      }
    }

    const idMap = new Map<string, string>();
    offersData.forEach((o) => {
      if (o.id) idMap.set(o.id.toLowerCase(), o.id);
      if (o.company) idMap.set(o.company.toLowerCase(), o.id);
    });

    const normalizeId = (aiId: any): string => {
      if (!aiId || typeof aiId !== "string") return offersData[0]?.id || "";
      const lower = aiId.toLowerCase();
      if (idMap.has(lower)) return idMap.get(lower)!;
      for (const [key, val] of idMap.entries()) {
        if (lower.includes(key) || key.includes(lower)) return val;
      }
      return offersData[0]?.id || aiId;
    };

    const normalizedOffers = (parsedResponse.offers || []).map((o: any, idx: number) => ({
      ...o,
      offerId: normalizeId(o.offerId) || offersData[idx]?.id,
    }));

    const normalizedRecommendation = {
      bestOverall: normalizeId(parsedResponse.recommendation?.bestOverall),
      bestCompensation: normalizeId(parsedResponse.recommendation?.bestCompensation),
      bestWorkLife: normalizeId(parsedResponse.recommendation?.bestWorkLife),
      lowestRisk: normalizeId(parsedResponse.recommendation?.lowestRisk),
    };

    const normalizedMatrix = (parsedResponse.comparisonMatrix || []).map((row: any) => ({
      ...row,
      values: (row.values || []).map((v: any, idx: number) => ({
        ...v,
        offerId: normalizeId(v.offerId) || offersData[idx]?.id,
      })),
    }));

    const finalResponse: OfferComparisonResponse = {
      offers: normalizedOffers,
      recommendation: normalizedRecommendation,
      comparisonMatrix: normalizedMatrix,
      summary: parsedResponse.summary || "Comparison complete.",
      detailedAnalysis: parsedResponse.detailedAnalysis || "",
      metadata: {
        analysisDate: new Date().toISOString(),
        disclaimer: DISCLAIMER,
      },
    };

    return addSecurityHeaders(NextResponse.json(finalResponse));
  } catch (error) {
    console.error("Offer comparison error:", error);
    return addSecurityHeaders(
      NextResponse.json(
        { error: "Failed to compare offers. Please try again." },
        { status: 500 }
      )
    );
  }
}
