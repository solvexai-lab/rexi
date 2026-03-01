/**
 * Health Insurance Document Classifier
 * Separate from motor classifier — health documents use completely different keywords.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export type HealthDocumentType = 'policy' | 'certificate' | 'brochure';

// ─── Fast regex path (no API call) ────────────────────────────────────────────

const POLICY_SIGNALS = [
    /policy\s+schedule/i,
    /policy\s+number/i,
    /insured\s+member/i,
    /sum\s+insured/i,
    /premium\s+receipt/i,
    /certificate\s+of\s+insurance/i,
    /health\s+insurance\s+policy/i,
    /mediclaim\s+policy/i,
    /member\s+id/i,
    /renewal\s+notice/i,
];

const CERTIFICATE_SIGNALS = [
    /group\s+insurance\s+certificate/i,
    /member\s+certificate/i,
    /employer.*group/i,
    /group\s+mediclaim/i,
    /corporate\s+health/i,
];

const BROCHURE_SIGNALS = [
    /key\s+features/i,
    /product\s+brochure/i,
    /why\s+choose/i,
    /plan\s+highlights/i,
    /what\s+we\s+offer/i,
    /^features\s+at\s+a\s+glance/im,
];

export function classifyHealthDocument(text: string): HealthDocumentType {
    const sample = text.slice(0, 3000);

    const certScore = CERTIFICATE_SIGNALS.filter(r => r.test(sample)).length;
    if (certScore >= 1) return 'certificate';

    const policyScore = POLICY_SIGNALS.filter(r => r.test(sample)).length;
    if (policyScore >= 2) return 'policy';

    const brochureScore = BROCHURE_SIGNALS.filter(r => r.test(sample)).length;
    if (brochureScore >= 2) return 'brochure';

    // Single match defaults
    if (policyScore >= 1) return 'policy';
    if (brochureScore >= 1) return 'brochure';

    // LLM fallback for ambiguous docs
    return 'policy'; // safest default — triggers full extraction
}

// ─── LLM fallback for edge cases ─────────────────────────────────────────────

export async function classifyHealthDocumentWithLLM(text: string): Promise<HealthDocumentType> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(`
Classify this health insurance document. Reply with ONLY one word: "policy", "certificate", or "brochure".

- policy: Individual/family health insurance policy with policy number, premium paid, sum insured
- certificate: Group/employer health insurance certificate
- brochure: Marketing material, product features, no specific policyholder details

DOCUMENT (first 2000 chars):
${text.slice(0, 2000)}

CLASSIFICATION:`);

    const raw = result.response.text().trim().toLowerCase();
    if (raw.includes('certificate')) return 'certificate';
    if (raw.includes('brochure')) return 'brochure';
    return 'policy';
}
