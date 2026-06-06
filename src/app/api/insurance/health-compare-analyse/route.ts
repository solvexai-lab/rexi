/**
 * Health Insurance Compare Analyse API
 * POST /api/insurance/health-compare-analyse
 *
 * Gemini-powered comparison of extracted health insurers.
 * Mirrors /api/insurance/compare-analyse but with 17 health comparison rows,
 * 8 health risk checks, and 4 claim scenarios with proportionate deduction maths.
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
    getClientIP,
    checkRateLimit,
    rateLimitedResponse,
    addSecurityHeaders,
    validateRequestOrigin,
    logSecurityEvent,
} from '@/lib/security';
import type { ExtractedHealthInsurer, HealthCompareResult } from '@/lib/insurance/types';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const clientIP = getClientIP(req);

    if (!validateRequestOrigin(req)) {
        logSecurityEvent('INVALID_ORIGIN_HEALTH_COMPARE_ANALYSE', { ip: clientIP });
        return addSecurityHeaders(NextResponse.json({ error: 'Invalid request origin' }, { status: 403 }));
    }

    const rateLimit = await checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
        logSecurityEvent('RATE_LIMIT_HEALTH_COMPARE_ANALYSE', { ip: clientIP });
        return rateLimitedResponse(rateLimit.resetIn);
    }

    let body: { insurers: ExtractedHealthInsurer[] };
    try {
        body = await req.json();
    } catch {
        return addSecurityHeaders(NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }));
    }

    const { insurers } = body;
    if (!insurers || !Array.isArray(insurers) || insurers.length < 2) {
        return addSecurityHeaders(NextResponse.json({ error: 'At least 2 health insurer documents required' }, { status: 400 }));
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return addSecurityHeaders(NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 }));
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { temperature: 0.1, maxOutputTokens: 8192 },
    });

    const insurerSummary = insurers.map((ins, i) => ({
        index: i,
        insurerName: ins.insurerName,
        productName: ins.productName,
        documentType: ins.documentType,
        sumInsured: ins.sumInsured,
        premium: ins.premium,
        roomRentLimit: ins.roomRentLimit,
        roomRentLimitType: ins.roomRentLimitType,
        roomRentPercent: ins.roomRentPercent ?? null,
        icuLimit: ins.icuLimit,
        coPay: ins.coPay,
        deductible: ins.deductible,
        networkHospitals: ins.networkHospitals,
        claimSettlementRatio: ins.claimSettlementRatio,
        cumulativeBonus: ins.cumulativeBonus,
        restorationBenefit: ins.restorationBenefit,
        waitingPeriods: ins.waitingPeriods,
        subLimits: ins.subLimits,
        coverages: ins.coverages,
    }));

    const prompt = `You are REXI, an expert health insurance advisor Globally. Compare these ${insurers.length} health insurance documents and respond with ONLY valid JSON (no markdown, no explanation).

HEALTH INSURER DATA:
${JSON.stringify(insurerSummary, null, 2)}

PROPORTIONATE DEDUCTION RULE (CRITICAL for claim scenarios):
If room rent taken > policy limit: factor = policyLimit/actualRoom; adjustedBill = totalBill × factor; insurerPays = adjustedBill × (1 - coPay/100) - deductible; youPay = totalBill - insurerPays.

Return this EXACT JSON structure (use insurer indexes 0-${insurers.length - 1} throughout):
{
  "winners": {
    "bestValue": { "insurerIndex": 0, "reason": "Best sum insured for premium paid" },
    "bestCovered": { "insurerIndex": 1, "reason": "Most benefits including maternity, AYUSH, restoration" },
    "lowestRisk": { "insurerIndex": 0, "reason": "No room rent trap, zero co-pay, shortest PED wait" }
  },
  "comparisonRows": [
    { "feature": "Sum Insured", "description": "Maximum claim amount per year", "values": [
      { "insurerIndex": 0, "value": "₹10,00,000", "covered": null, "isWinner": true },
      { "insurerIndex": 1, "value": "₹5,00,000", "covered": null, "isWinner": false }
    ]},
    { "feature": "Annual Premium", "description": "Yearly cost", "values": [...]},
    { "feature": "Room Rent Limit", "description": "Daily room allowance — cap triggers proportionate deduction", "values": [...]},
    { "feature": "ICU Limit", "description": "ICU daily cap (null = no limit)", "values": [...]},
    { "feature": "Co-payment", "description": "% you bear on every claim", "values": [...]},
    { "feature": "Deductible", "description": "Fixed amount you always pay per claim", "values": [...]},
    { "feature": "PED Waiting Period", "description": "Months before pre-existing diseases covered", "values": [...]},
    { "feature": "Initial Waiting Period", "description": "Days before any claim (except accidents)", "values": [...]},
    { "feature": "Specific Disease Waiting", "description": "Months for conditions like hernia, cataract", "values": [...]},
    { "feature": "Maternity Waiting", "description": "Months before maternity claim allowed (0 = not covered)", "values": [...]},
    { "feature": "Restoration Benefit", "description": "SI refilled after exhaustion in same year", "values": [...]},
    { "feature": "Cumulative Bonus", "description": "SI increases for claim-free years", "values": [...]},
    { "feature": "Daycare Cover", "description": "Procedures under 24-hour stay covered", "values": [...]},
    { "feature": "Network Hospitals", "description": "Cashless hospital network size", "values": [...]},
    { "feature": "Claim Settlement Ratio", "description": "% claims settled (higher = better)", "values": [...]},
    { "feature": "AYUSH Cover", "description": "Ayurveda, Homeopathy, Unani treatments", "values": [...]},
    { "feature": "Maternity Cover", "description": "Delivery and newborn costs covered", "values": [...]}
  ],
  "riskMatrix": [
    { "riskId": "room-rent-trap", "title": "Room Rent Trap (Proportionate Deduction Risk)", "severity": "HIGH", "values": [
      { "insurerIndex": 0, "status": "covered" },
      { "insurerIndex": 1, "status": "missing" }
    ]},
    { "riskId": "high-copay", "title": "Co-payment ≥20%", "severity": "HIGH", "values": [...]},
    { "riskId": "long-ped-wait", "title": "PED Waiting > 24 months", "severity": "HIGH", "values": [...]},
    { "riskId": "low-sum-insured", "title": "Sum Insured < ₹5 Lakh", "severity": "HIGH", "values": [...]},
    { "riskId": "no-maternity", "title": "Maternity Not Covered", "severity": "MEDIUM", "values": [...]},
    { "riskId": "no-restoration", "title": "No Restoration Benefit", "severity": "MEDIUM", "values": [...]},
    { "riskId": "sublimit-risk", "title": "Dangerous Sub-limits", "severity": "MEDIUM", "values": [...]},
    { "riskId": "no-csr", "title": "Claim Settlement Ratio Unknown", "severity": "LOW", "values": [...]}
  ],
  "claimScenarios": [
    {
      "scenarioName": "Appendicitis Surgery",
      "description": "5-day stay, general ward ₹8,000/day, total bill ₹1,00,000",
      "totalCost": 100000,
      "costs": [
        { "insurerIndex": 0, "youPay": 5200, "insurerPays": 94800, "breakdown": "No room rent overage; co-pay 0%; deductible ₹0" },
        { "insurerIndex": 1, "youPay": 62000, "insurerPays": 38000, "breakdown": "Room ₹8k > limit ₹4k; factor 0.5; adjusted ₹50k; co-pay 20%: ₹10k; you pay ₹62k" }
      ]
    },
    {
      "scenarioName": "Knee Replacement",
      "description": "8-day stay, ₹10,000/day room. Total bill ₹3,00,000",
      "totalCost": 300000,
      "costs": [...]
    },
    {
      "scenarioName": "Critical ICU — 10 Days",
      "description": "ICU ₹25,000/day, total bill ₹5,00,000",
      "totalCost": 500000,
      "costs": [...]
    },
    {
      "scenarioName": "Maternity — Normal Delivery",
      "description": "3-day stay, total bill ₹1,20,000",
      "totalCost": 120000,
      "costs": [...]
    }
  ],
  "summary": "2-3 sentence plain English summary of the most important differences.",
  "detailedAnalysis": "## Detailed Health Insurance Comparison\\n\\nMarkdown analysis covering: room rent trap risk, claim scenarios, waiting period strategies, and final recommendation."
}

RULES:
- comparisonRows "covered" field: null for numeric rows (sum insured, premium, room rent limit as ₹/day etc), true/false for boolean rows (maternity cover, AYUSH, daycare, restoration, cumulative bonus).
- isWinner for numeric rows: higher is better for Sum Insured, Network Hospitals, CSR%. Lower is better for Premium, Co-pay, Deductible, Waiting Periods.
- For claim scenarios: apply proportionate deduction CORRECTLY. If room rent taken = ₹8,000 and limit = ₹4,000 → factor = 0.5 → adjusted bill = 50% of total. Then apply co-pay on adjusted amount. Then deduct deductible. youPay = totalCost - insurerPays.
- If maternity not covered or waiting period not elapsed → youPay = full ₹1,20,000 for maternity scenario.
- riskMatrix "status": "covered" = risk doesn't apply (e.g., no room rent cap), "missing" = risk present (e.g., has room rent cap), "partial" = unclear.
- RETURN ONLY JSON. No explanation outside JSON.`;

    let responseText: string;
    try {
        const result = await model.generateContent(prompt);
        responseText = result.response.text().trim();
    } catch (err: any) {
        console.error('[health-compare-analyse] Gemini error:', err);
        return addSecurityHeaders(NextResponse.json({ error: 'AI comparison failed. Please try again.' }, { status: 500 }));
    }

    // Strip markdown code blocks
    if (responseText.includes('```json')) {
        responseText = responseText.split('```json')[1].split('```')[0].trim();
    } else if (responseText.startsWith('```')) {
        responseText = responseText.split('```')[1].split('```')[0].trim();
    }

    let parsed: HealthCompareResult;
    try {
        parsed = JSON.parse(responseText);
    } catch {
        try {
            const match = responseText.match(/\{[\s\S]*\}/);
            if (match) {
                parsed = JSON.parse(match[0]);
            } else {
                throw new Error('No JSON found');
            }
        } catch {
            console.error('[health-compare-analyse] JSON parse failed. Raw:', responseText.slice(0, 300));
            return addSecurityHeaders(
                NextResponse.json({ error: 'AI returned invalid format. Please try again.' }, { status: 500 })
            );
        }
    }

    return addSecurityHeaders(NextResponse.json(parsed));
}
