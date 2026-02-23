import { GoogleGenerativeAI } from "@google/generative-ai";

export type DocumentType = 'policy' | 'quotation' | 'brochure';

/**
 * Classifies insurance documents using regex patterns + LLM fallback
 */
export async function classifyDocument(text: string): Promise<DocumentType> {
    // Rule-based detection (fast path)
    const hasVehicleReg = /[A-Z]{2}\s*\d{1,2}\s*[A-Z]{1,2}\s*\d{4}/.test(text);
    const hasPolicyNumber = /Policy\s*(?:No|Number|#)\s*:\s*\w+/i.test(text);
    const hasQuotationId = /(?:Quotation|Proposal|Quote)\s*(?:No|ID|#)/i.test(text);
    const hasValidUntil = /Valid\s*(?:Until|Till|Upto)/i.test(text);
    const hasGenericMarketing = /(?:Why\s*Choose|Key\s*Benefits|Our\s*Features)/i.test(text);

    // Classification Logic
    if (hasPolicyNumber && hasVehicleReg) return 'policy';
    if (hasQuotationId && hasValidUntil) return 'quotation';
    if (hasGenericMarketing && !hasVehicleReg) return 'brochure';

    // Fallback: LLM-based classification
    return await classifyWithLLM(text);
}

/**
 * LLM-based classification for edge cases
 */
async function classifyWithLLM(text: string): Promise<DocumentType> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 10,
        }
    });

    const prompt = `Classify this insurance document:
  - "policy": Has policy number, issued to specific customer with vehicle details
  - "quotation": Proposal/estimate, valid for limited time, may say "Quote" or "Proposal"
  - "brochure": Generic marketing material, no customer-specific data
  
  Document excerpt: ${text.slice(0, 2000)}
  
  Respond with ONLY one word: policy, quotation, or brochure`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const classification = response.text().trim().toLowerCase();

    if (['policy', 'quotation', 'brochure'].includes(classification)) {
        return classification as DocumentType;
    }

    // Default fallback if LLM returns unexpected value
    console.warn(`Unexpected LLM classification: ${classification}. Defaulting to policy.`);
    return 'policy';
}
