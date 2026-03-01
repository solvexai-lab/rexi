/**
 * Health Insurance Chat API
 * POST /api/insurance/health/chat
 *
 * Dedicated health-only Rexi chat route.
 * Reads from health_insurance_analyses (never motor table).
 * Sends up to 100k chars of raw policy text for accurate, full-document answers.
 *
 * Called by RexiChatWidget when chatEndpoint="/api/insurance/health/chat"
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getHealthAnalysis } from '@/lib/insurance/health/database';

export const maxDuration = 60;
export const runtime = 'nodejs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
        temperature: 0.2,       // Low temp for factual, grounded answers
        maxOutputTokens: 700,
    },
});

function truncate(text: string, max: number): string {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '...[END OF EXCERPT]' : text;
}

export async function POST(req: NextRequest) {
    try {
        const { message, analysisId } = await req.json();

        if (!message || !analysisId) {
            return NextResponse.json({ error: 'Missing message or analysisId' }, { status: 400 });
        }

        // Fetch from health table only
        const analysis = await getHealthAnalysis(analysisId);
        if (!analysis?.policyData) {
            return NextResponse.json({ error: 'Health analysis not found' }, { status: 404 });
        }

        const { policyData, riskFlags, extractedConditions, rawText } = analysis;

        // Full document for RAG — 100k chars ≈ 25k tokens, well within Gemini 2.0 Flash's 1M context
        const fullPolicyText = truncate(rawText ?? '', 100000);

        // Compute maternity unlock date for the prompt
        const maternityUnlockDate = (() => {
            if (!policyData.policyStart || !policyData.waitingPeriods.maternityMonths) return null;
            const d = new Date(policyData.policyStart);
            d.setMonth(d.getMonth() + policyData.waitingPeriods.maternityMonths);
            return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        })();

        const prompt = `You are Rexi — a trusted Indian health insurance advisor helping a real policyholder understand their health insurance.

POLICY FACTS (extracted structured data):
- Insurer: ${policyData.insurerName} — ${policyData.productName}
- Coverage Type: ${policyData.coverageType}
- Sum Insured: ₹${policyData.sumInsured.toLocaleString('en-IN')}
- Annual Premium: ₹${policyData.premium.toLocaleString('en-IN')}
- Room Rent Limit: ${policyData.roomRentLimitType === 'none'
                ? 'No limit (any room category allowed)'
                : policyData.roomRentLimitType === 'percentage'
                    ? `${policyData.roomRentPercent}% of SI = ₹${Math.round((policyData.sumInsured * (policyData.roomRentPercent ?? 1)) / 100)}/day`
                    : `₹${policyData.roomRentLimit?.toLocaleString('en-IN')}/day (fixed cap)`}
- ICU Limit: ${policyData.icuLimit ? `₹${policyData.icuLimit.toLocaleString('en-IN')}/day` : 'No separate ICU cap'}
- Co-payment: ${policyData.coPay}%${policyData.coPay === 0 ? ' (zero co-pay ✅)' : ''}
- Deductible: ₹${policyData.deductible.toLocaleString('en-IN')}
- PED Waiting: ${policyData.waitingPeriods.pedMonths} months from policy start
- Initial Waiting: ${policyData.waitingPeriods.initialDays} days
- Specific Disease Waiting: ${policyData.waitingPeriods.specificDiseaseMonths} months
- Maternity: ${policyData.coverages.maternity
                ? `Covered — ${policyData.waitingPeriods.maternityMonths > 0 ? `waiting period ${policyData.waitingPeriods.maternityMonths} months${maternityUnlockDate ? `, unlocks ${maternityUnlockDate}` : ''}` : 'no waiting period'}`
                : 'NOT covered'}
- Network Hospitals: ${policyData.networkHospitals?.toLocaleString('en-IN') ?? 'Not stated'}
- Claim Settlement Ratio: ${policyData.claimSettlementRatio ? `${policyData.claimSettlementRatio}%` : 'Not stated'}
- Restoration Benefit: ${policyData.restorationBenefit ? 'Yes ✅' : 'No'}
- Cumulative Bonus: ${policyData.cumulativeBonus ? 'Yes ✅' : 'No'}
- Policy Period: ${policyData.policyStart ?? 'Unknown'} → ${policyData.policyEnd ?? 'Unknown'}

COVERAGES:
${JSON.stringify(policyData.coverages, null, 2)}

SUB-LIMITS:
${JSON.stringify(policyData.subLimits, null, 2)}

ACTIVE RISK FLAGS:
${JSON.stringify(riskFlags?.map(r => ({ severity: r.severity, title: r.title })), null, 2)}

COVERED CONDITIONS (extracted): ${extractedConditions?.covered?.join(', ') || 'See policy text'}
EXCLUDED CONDITIONS (extracted): ${extractedConditions?.excluded?.join(', ') || 'See policy text'}

FULL POLICY DOCUMENT:
"""
${fullPolicyText}
"""

RULES:
1. If the answer is clearly in the policy text above, quote it: "Your policy states..."
2. If not in the text, use the structured facts above and say "Based on your policy details..."
3. PROPORTIONATE DEDUCTION: If room rent is capped, ALWAYS explain that exceeding the limit reduces your ENTIRE bill proportionately — not just the room difference.
4. SHOW MATHS: If the user asks about a claim amount, calculate step by step: proportionate deduction → co-pay → deductible → final insurer payment.
5. WAITING PERIODS: Always check if the claim type would be subject to a waiting period and whether it has elapsed.
6. CLEAR VERDICT: End every claim question with "Insurer pays: ₹X | You pay: ₹Y"
7. TONE: Warm, plain English, like a knowledgeable friend. Bold key amounts and verdicts.
8. PROFESSIONAL LIMITS: Never give legal or tax advice. Stick to policy coverage analysis.

USER QUESTION: "${message}"

ANSWER:`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return NextResponse.json({ response: responseText });

    } catch (error: any) {
        console.error('[Health Chat] Error:', error);
        return NextResponse.json({ error: 'Failed to generate response. Please try again.' }, { status: 500 });
    }
}
