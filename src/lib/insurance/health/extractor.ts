/**
 * Health Insurance Data Extractor
 * Uses Gemini to extract structured policy data from OCR'd text.
 * Separate from motor extractor — health has completely different fields and logic.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import {
    HealthPolicyData,
    HealthCoverage,
    HealthWaitingPeriods,
    HealthSubLimits,
} from '../types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ─── Defaults ─────────────────────────────────────────────────────────────────

function defaultCoverage(): HealthCoverage {
    return {
        inpatientHospitalization: true,
        dayCare: true,
        preHospitalizationDays: 30,
        postHospitalizationDays: 60,
        ambulance: true,
        maternity: false,
        newbornCover: false,
        ayush: false,
        opd: false,
        criticalIllness: false,
        organDonor: false,
        mentalHealth: false,
        domiciliaryHospitalization: false,
        internationalCover: false,
    };
}

function defaultWaitingPeriods(): HealthWaitingPeriods {
    return { initialDays: 30, pedMonths: 36, specificDiseaseMonths: 24, maternityMonths: 0 };
}

function defaultSubLimits(): HealthSubLimits {
    return { cataract: null, kneeReplacement: null, hernia: null, maternity: null, organDonor: null };
}

// ─── 1. Main policy extractor ─────────────────────────────────────────────────

export async function extractHealthPolicyData(text: string): Promise<HealthPolicyData> {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: { temperature: 0.1, responseMimeType: 'application/json' },
    });

    const prompt = `You are a universal expert at extracting structured data from health insurance policy documents (Policy Schedules, Certificates, and Brochures) across multiple jurisdictions, including India, UK, and the US.
 Extract the following fields from the policy text below. Return a single JSON object with EXACTLY these keys.

CRITICAL INSTRUCTIONS:
- ROOM RENT: Be extremely careful. Look for "Room Rent Limit", "Room Category", or "Room Rent Cap". 
  - If "Single Private AC Room" with no ₹ limit → set roomRentLimitType="none", roomRentLimit=null.
  - If "1% of Sum Insured" → set roomRentLimitType="percentage", roomRentPercent=1.
  - If a fixed amount like "₹5,000 per day" → set roomRentLimitType="fixed", roomRentLimit=5000.
- CO-PAY: Look for words like "Co-payment", "Co-pay", or "Cost Sharing". Often 10%, 20% or 0%.
- PROPORTIONATE DEDUCTION: If there is a room rent limit, there is almost always a proportionate deduction clause. Note this.
- SUM INSURED: Extract the total coverage amount (e.g., 5 Lakhs, 10,00,000).
- If a field is not found, use the standard defaults (null for strings, 0 for numbers, false for booleans).

JSON SCHEMA:
{
  "documentType": "policy" | "certificate" | "brochure",
  "insurerName": string,
  "productName": string,
  "policyNumber": string | null,
  "coverageType": "individual" | "floater" | "senior_citizen" | "group",
  "sumInsured": number,
  "premium": number,
  "policyStart": string | null,
  "policyEnd": string | null,
  "roomRentLimit": number | null,
  "roomRentLimitType": "fixed" | "percentage" | "none",
  "roomRentPercent": number | null,
  "icuLimit": number | null,
  "coPay": number,
  "deductible": number,
  "networkHospitals": number | null,
  "claimSettlementRatio": number | null,
  "cumulativeBonus": boolean,
  "restorationBenefit": boolean,
  "waitingPeriods": {
    "initialDays": number,
    "pedMonths": number,
    "specificDiseaseMonths": number,
    "maternityMonths": number
  },
  "subLimits": {
    "cataract": number | null,
    "kneeReplacement": number | null,
    "hernia": number | null,
    "maternity": number | null,
    "organDonor": number | null
  },
  "coverages": {
    "inpatientHospitalization": boolean,
    "dayCare": boolean,
    "preHospitalizationDays": number,
    "postHospitalizationDays": number,
    "ambulance": boolean,
    "maternity": boolean,
    "newbornCover": boolean,
    "ayush": boolean,
    "opd": boolean,
    "criticalIllness": boolean,
    "organDonor": boolean,
    "mentalHealth": boolean,
    "domiciliaryHospitalization": boolean,
    "internationalCover": boolean
  }
}

POLICY TEXT:
${text.slice(0, 80000)}

JSON:`;

    try {
        const result = await model.generateContent(prompt);
        const raw = result.response.text().trim();
        const parsed = JSON.parse(raw);
        return {
            documentType: parsed.documentType ?? 'policy',
            insurerName: parsed.insurerName ?? 'Unknown Insurer',
            productName: parsed.productName ?? 'Health Insurance Policy',
            policyNumber: parsed.policyNumber ?? null,
            coverageType: parsed.coverageType ?? 'individual',
            sumInsured: Number(parsed.sumInsured) || 0,
            premium: Number(parsed.premium) || 0,
            policyStart: parsed.policyStart ?? null,
            policyEnd: parsed.policyEnd ?? null,
            roomRentLimit: parsed.roomRentLimit ?? null,
            roomRentLimitType: parsed.roomRentLimitType ?? 'none',
            roomRentPercent: parsed.roomRentPercent ?? null,
            icuLimit: parsed.icuLimit ?? null,
            coPay: Number(parsed.coPay) || 0,
            deductible: Number(parsed.deductible) || 0,
            networkHospitals: parsed.networkHospitals ?? null,
            claimSettlementRatio: parsed.claimSettlementRatio ?? null,
            cumulativeBonus: Boolean(parsed.cumulativeBonus),
            restorationBenefit: Boolean(parsed.restorationBenefit),
            waitingPeriods: { ...defaultWaitingPeriods(), ...(parsed.waitingPeriods ?? {}) },
            subLimits: { ...defaultSubLimits(), ...(parsed.subLimits ?? {}) },
            coverages: { ...defaultCoverage(), ...(parsed.coverages ?? {}) },
        };
    } catch {
        return {
            documentType: 'policy',
            insurerName: 'Unknown Insurer',
            productName: 'Health Insurance Policy',
            policyNumber: null,
            coverageType: 'individual',
            sumInsured: 0,
            premium: 0,
            policyStart: null,
            policyEnd: null,
            roomRentLimit: null,
            roomRentLimitType: 'none',
            roomRentPercent: null,
            icuLimit: null,
            coPay: 0,
            deductible: 0,
            networkHospitals: null,
            claimSettlementRatio: null,
            cumulativeBonus: false,
            restorationBenefit: false,
            waitingPeriods: defaultWaitingPeriods(),
            subLimits: defaultSubLimits(),
            coverages: defaultCoverage(),
        };
    }
}

// ─── 2. Keyword fallbacks (no API call) ──────────────────────────────────────

export function applyHealthFallbacks(data: HealthPolicyData, text: string): HealthPolicyData {
    const t = text.toLowerCase();
    const result = { ...data };

    // Insurer name fallback
    if (result.insurerName === 'Unknown Insurer' || result.insurerName.toLowerCase().includes('unknown')) {
        const insurers = [
            'Star Health', 'HDFC ERGO', 'ICICI Lombard', 'Care Health', 'Religare',
            'Niva Bupa', 'Max Bupa', 'Aditya Birla', 'TATA AIG', 'SBI General',
            'Bajaj Allianz', 'United India', 'New India Assurance', 'Oriental Insurance',
            'National Insurance', 'Reliance General', 'Cholamandalam', 'Future Generali',
            'Liberty General', 'ManipalCigna', 'Navi General', 'Digit', 'Acko'
        ];
        for (const insurer of insurers) {
            if (new RegExp(insurer, 'i').test(text)) {
                result.insurerName = insurer;
                break;
            }
        }
    }

    // Room rent fallback
    if (result.roomRentLimitType === 'none' || (result.roomRentLimit && result.roomRentLimit < 500)) {
        // Look for "At Actuals" or "No Limit" - this is common in premium plans like Optima Secure
        if (/at\s*actuals|no\s*limit|no\s*cap|any\s*room/i.test(text)) {
            result.roomRentLimit = null;
            result.roomRentLimitType = 'none';
        } else {
            // Only try regex if it wasn't explicitly "At Actuals"
            const rrMatch = text.match(/room\s+rent[^\d₹]*[₹Rs.\s:]+(\d[\d,]+)/i);
            if (rrMatch) {
                result.roomRentLimit = parseInt(rrMatch[1].replace(/,/g, ''));
                result.roomRentLimitType = 'fixed';
            }
        }

        // Look for percentage caps: "1% of Sum Insured" or "Room Rent - 1% of SI"
        const rrPctMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s+of\s+(?:sum\s+insured|s\.?i\.?)/i);
        if (rrPctMatch) {
            result.roomRentPercent = parseFloat(rrPctMatch[1]);
            result.roomRentLimitType = 'percentage';
        }
    }

    // Clean up tiny hallucinations (like "₹24/day" which is likely a page number or 24/7 support text)
    if (result.roomRentLimit && result.roomRentLimit < 500) {
        result.roomRentLimit = null;
        result.roomRentLimitType = 'none';
    }

    // PED waiting period fallback
    if (result.waitingPeriods.pedMonths === 36) {
        const pedMatch = text.match(/pre[- ]?exist[^.\n]*?(\d+)\s*(?:month|year)/i);
        if (pedMatch) {
            let val = parseInt(pedMatch[1]);
            if (text.slice(pedMatch.index!, pedMatch.index! + 40).includes('year')) val *= 12;
            result.waitingPeriods = { ...result.waitingPeriods, pedMonths: val };
        }
    }

    // Co-pay fallback
    if (result.coPay === 0) {
        const coPayMatch = text.match(/(?:co[- ]?pay(?:ment)?|cost\s+sharing)[^\d]*(\d+)\s*%/i);
        if (coPayMatch) {
            result.coPay = parseInt(coPayMatch[1]);
        } else {
            const coPayReverse = text.match(/(\d+)\s*%\s*co[- ]?pay/i);
            if (coPayReverse) result.coPay = parseInt(coPayReverse[1]);
        }
    }

    // Network hospitals fallback
    if (!result.networkHospitals) {
        const nhMatch = text.match(/(\d[\d,]+)\s*(?:network|cashless)\s*hospital/i);
        if (nhMatch) result.networkHospitals = parseInt(nhMatch[1].replace(/,/g, ''));
    }

    // AYUSH fallback
    if (!result.coverages.ayush && /ayush|ayurveda|homeopathy|unani/i.test(t)) {
        result.coverages = { ...result.coverages, ayush: true };
    }

    // Maternity fallback
    if (!result.coverages.maternity && /maternity|childbirth|normal delivery|caesarean/i.test(t)) {
        result.coverages = { ...result.coverages, maternity: true };
    }

    // Restoration fallback
    if (!result.restorationBenefit && /restoration|refill|recharge/i.test(t)) {
        result.restorationBenefit = true;
    }

    // Cumulative bonus fallback
    if (!result.cumulativeBonus && /cumulative\s+bonus|no[- ]claim\s+bonus/i.test(t)) {
        result.cumulativeBonus = true;
    }

    return result;
}

// ─── 3. Covered / excluded conditions extractor ───────────────────────────────

export async function extractHealthConditions(
    text: string
): Promise<{ covered: string[]; excluded: string[] }> {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(`
From this health insurance policy text, extract plain-English lists of:
1. Covered conditions/benefits (what the policy pays for)
2. Excluded conditions (what is explicitly not covered)

Return JSON: { "covered": string[], "excluded": string[] }
Each item should be a short phrase (3–7 words), not full sentences.
Maximum 12 items per list. Focus on the most important ones.

POLICY TEXT:
${text.slice(0, 30000)}

JSON:`);

    try {
        const parsed = JSON.parse(result.response.text().trim());
        return {
            covered: Array.isArray(parsed.covered) ? parsed.covered.slice(0, 12) : [],
            excluded: Array.isArray(parsed.excluded) ? parsed.excluded.slice(0, 12) : [],
        };
    } catch {
        return { covered: [], excluded: [] };
    }
}

// ─── 4. Confidence scorer ─────────────────────────────────────────────────────

export function calculateHealthConfidence(data: HealthPolicyData): number {
    let score = 0;
    const checks = [
        data.insurerName !== 'Unknown Insurer',
        data.productName !== 'Health Insurance Policy',
        data.sumInsured > 0,
        data.premium > 0,
        data.policyNumber !== null,
        data.policyStart !== null,
        data.roomRentLimitType !== 'none' || data.insurerName !== 'Unknown Insurer',
        data.waitingPeriods.pedMonths !== 36 || data.waitingPeriods.initialDays !== 30,
    ];
    score = checks.filter(Boolean).length / checks.length;
    return Math.round(score * 100) / 100;
}

// ─── 5. Brochure extractor ────────────────────────────────────────────────────

export async function extractHealthBrochureData(text: string): Promise<{
    insurerName: string;
    productName: string;
    covered: string[];
    excluded: string[];
}> {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(`
Extract brochure highlights from this health insurance marketing document.
Return JSON: { "insurerName": string, "productName": string, "covered": string[], "excluded": string[] }
Each item in covered/excluded should be a short feature phrase (3–7 words).
Maximum 10 items per list.

BROCHURE TEXT:
${text.slice(0, 60000)}

JSON:`);

    try {
        const parsed = JSON.parse(result.response.text().trim());
        return {
            insurerName: parsed.insurerName ?? 'Unknown Insurer',
            productName: parsed.productName ?? 'Health Insurance',
            covered: Array.isArray(parsed.covered) ? parsed.covered.slice(0, 10) : [],
            excluded: Array.isArray(parsed.excluded) ? parsed.excluded.slice(0, 10) : [],
        };
    } catch {
        return { insurerName: 'Unknown Insurer', productName: 'Health Insurance', covered: [], excluded: [] };
    }
}
