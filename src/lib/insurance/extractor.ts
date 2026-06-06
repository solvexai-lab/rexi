import { getGenAI } from '../ai-clients';
import { PolicyData, BrochureData, Coverage, RiskFlag } from './types';

/**
 * Extract policy or quotation data from insurance document text
 */
export async function extractPolicyData(text: string): Promise<PolicyData> {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-preview-05-20",
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
        }
    });

    const prompt = `Extract insurance policy data strictly from the text provided.
    
    CRITICAL INSTRUCTIONS FOR COVERAGES:
    - **hasOwnDamage**: True if "OD Premium", "Own Damage", "Comprehensive", or "Package Policy" is mentioned.
    - **hasThirdPartyLiability**: True if "TP Premium", "Liability", or "Third Party" is mentioned.
    - **hasZeroDepreciation**: True if "Zero Dep", "Nil Depreciation", "Bumper to Bumper", or "Depreciation Waiver" is listed.
    - **hasEngineProtection**: True if "Engine Protect", "Engine Secure", "Hydrostatic Lock", or "Aggregates" is listed.
    - **hasReturnToInvoice**: True if "Return to Invoice", "RTI", or "Invoice Price" is listed.
    - **hasNCBProtection**: True if "NCB Protect" or "No Claim Bonus Protection" is listed.
    - **hasRoadsideAssistance**: True if "Roadside Assistance", "RSA", "24x7 Assistance", or "Spot Assistance" is listed.

    Format as JSON:
    {
      "vehicleInfo": { "make": "e.g. Maruti", "model": "e.g. Swift", "registrationNo": "e.g. MH12AB1234", "manufacturingYear": 2020 },
      "idv": 0,
      "premium": 0,
      "policyNumber": "string or null",
      "quotationId": "string or null",
      "expiryDate": "YYYY-MM-DD or null",
      "validUntil": "YYYY-MM-DD or null",
      "coverages": {
        "hasOwnDamage": boolean,
        "hasThirdPartyLiability": boolean,
        "hasZeroDepreciation": boolean,
        "hasEngineProtection": boolean,
        "hasReturnToInvoice": boolean,
        "hasNCBProtection": boolean,
        "hasRoadsideAssistance": boolean
      },
      "compulsoryDeductible": 0,
      "voluntaryDeductible": 0,
      "ncb": 0,
      "insurerName": "string"
    }
    
    Note:
    - If "Comprehensive" or "Package Policy", set hasOwnDamage = true and hasThirdPartyLiability = true.
    - If "Third Party Liability Only", set hasOwnDamage = false and hasThirdPartyLiability = true.
    
    Document Text: ${text.slice(0, 80000)}`;

    try {
        const result = await model.generateContent(prompt);
        const data = JSON.parse(result.response.text());

        // Ensure vehicleInfo exists with all fields
        const vehicleInfo = {
            make: data.vehicleInfo?.make || '',
            model: data.vehicleInfo?.model || '',
            registrationNo: data.vehicleInfo?.registrationNo || '',
            manufacturingYear: data.vehicleInfo?.manufacturingYear || 0
        };

        // Ensure coverages exists
        const coverages: Coverage = {
            hasOwnDamage: data.coverages?.hasOwnDamage || false,
            hasThirdPartyLiability: data.coverages?.hasThirdPartyLiability || false,
            hasZeroDepreciation: data.coverages?.hasZeroDepreciation || false,
            hasEngineProtection: data.coverages?.hasEngineProtection || false,
            hasReturnToInvoice: data.coverages?.hasReturnToInvoice || false,
            hasNCBProtection: data.coverages?.hasNCBProtection || false,
            hasRoadsideAssistance: data.coverages?.hasRoadsideAssistance || false
        };

        const rawData = {
            documentType: (data.policyNumber ? 'policy' : 'quotation') as 'policy' | 'quotation',
            vehicleInfo,
            idv: data.idv || 0,
            premium: data.premium || 0,
            policyNumber: data.policyNumber || null,
            quotationId: data.quotationId || null,
            expiryDate: data.expiryDate || null,
            validUntil: data.validUntil || null,
            coverages,
            compulsoryDeductible: data.compulsoryDeductible || 0,
            voluntaryDeductible: data.voluntaryDeductible || 0,
            ncb: data.ncb || 0,
            insurerName: data.insurerName || 'Unknown Insurer'
        };

        // Apply keyword matching fallbacks
        return applyFallbacks(rawData, text);
    } catch (error) {
        console.error('Error extracting policy data:', error);
        throw new Error('Failed to extract policy data from PDF');
    }
}

function applyFallbacks(data: PolicyData, fullText: string): PolicyData {
    const text = fullText.toLowerCase();

    // Helper to check if text contains any of the keywords
    const has = (keywords: string[]) => keywords.some(k => text.includes(k));

    // Force enable flags if keywords are clearly present
    if (!data.coverages.hasOwnDamage) {
        if (has(['comprehensive', 'package policy', 'own damage', 'od premium'])) {
            data.coverages.hasOwnDamage = true;
        }
    }

    if (!data.coverages.hasThirdPartyLiability) {
        if (has(['third party', 'liability', 'tp premium']) || data.coverages.hasOwnDamage) { // Comprehensive implies TP
            data.coverages.hasThirdPartyLiability = true;
        }
    }

    if (!data.coverages.hasZeroDepreciation) {
        if (has(['zero dep', 'nil dep', 'depreciation waiver', 'bumper to bumper'])) {
            data.coverages.hasZeroDepreciation = true;
        }
    }

    if (!data.coverages.hasEngineProtection) {
        if (has(['engine protect', 'engine secure', 'hydrostatic', 'aggregates'])) {
            data.coverages.hasEngineProtection = true;
        }
    }

    if (!data.coverages.hasReturnToInvoice) {
        if (has(['return to invoice', 'invoice price', 'rti'])) {
            data.coverages.hasReturnToInvoice = true;
        }
    }

    if (!data.coverages.hasRoadsideAssistance) {
        if (has(['roadside', 'rsa', 'spot assistance', '24x7 assistance'])) {
            data.coverages.hasRoadsideAssistance = true;
        }
    }

    if (!data.coverages.hasNCBProtection) {
        if (has(['ncb protect', 'no claim bonus protect'])) {
            data.coverages.hasNCBProtection = true;
        }
    }

    return data;
}

/**
 * Extract brochure or marketing material data
 */
export async function extractBrochureData(text: string): Promise<BrochureData> {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-preview-05-20",
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
        }
    });

    const prompt = `Extract insurance product features:
  {
    "insurerName": "",
    "productName": "",
    "featuresOffered": ["Zero Depreciation", "Engine Protection"],
    "cashlessGarages": 0,
    "exclusions": ["Wear and tear", "Consequential loss"]
  }
  
  Brochure: ${text.slice(0, 60000)}`;

    try {
        const result = await model.generateContent(prompt);
        const data = JSON.parse(result.response.text());

        return {
            documentType: 'brochure',
            ...data
        };
    } catch (e) {
        console.error('Failed to parse brochure data:', e);
        return {
            documentType: 'brochure',
            insurerName: 'Unknown',
            productName: 'Unknown',
            featuresOffered: [],
            cashlessGarages: 0,
            exclusions: []
        };
    }
}

/**
 * Extract covered perils and exclusions for Plain English Accordion
 */
export async function extractCoveredPerils(policyText: string): Promise<{
    covered: string[];
    exclusions: string[];
}> {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-preview-05-20",
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
        }
    });

    const prompt = `Extract from this insurance policy document:
  1. What IS covered (perils/events protected)
  2. What is NOT covered (exclusions)
  
  Return JSON:
  {
    "covered": ["Accident", "Fire", "Theft", ...],
    "exclusions": ["Wear and tear", "Consequential loss", ...]
  }
  
  Policy text: ${policyText.slice(0, 80000)}`;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
}

/**
 * Detect missing critical coverages and generate risk flags
 */
import { calculateDaysRemaining } from './calculator';

export function detectMissingFeatures(coverages: Coverage, expiryDate?: string): RiskFlag[] {
    const flags: RiskFlag[] = [];
    const daysRemaining = expiryDate ? calculateDaysRemaining(expiryDate) : 365;
    const isRenewalImminent = daysRemaining < 45;

    const actionPrefix = isRenewalImminent ? "Ensure your NEXT policy has" : "Request endorsement to add";

    if (!coverages.hasZeroDepreciation) {
        flags.push({
            id: 'missing-zero-dep',
            severity: 'HIGH',
            title: 'Zero Depreciation Missing',
            description: 'You will pay for depreciation on parts during claims',
            recommendation: `${actionPrefix} Zero Depreciation (saves ₹5k-15k per claim)`
        });
    }

    if (!coverages.hasEngineProtection) {
        flags.push({
            id: 'missing-engine-protection',
            severity: 'MEDIUM',
            title: 'Engine Protection Missing',
            description: 'Engine/gearbox damage from water/oil leakage NOT covered',
            recommendation: `${actionPrefix} Engine Protection (critical for monsoons)`
        });
    }

    if (!coverages.hasReturnToInvoice) {
        flags.push({
            id: 'missing-rti',
            severity: 'MEDIUM',
            title: 'Return to Invoice Missing',
            description: 'Total loss claims will use depreciated IDV, not original price',
            recommendation: `${actionPrefix} Return to Invoice (for FULL value)`
        });
    }

    if (!coverages.hasRoadsideAssistance) {
        flags.push({
            id: 'missing-roadside',
            severity: 'LOW',
            title: 'Roadside Assistance Missing',
            description: 'No towing, flat tire help, or emergency services',
            recommendation: `${actionPrefix} Roadside Assistance (₹500-1000)`
        });
    }

    return flags;
}

/**
 * Wrapper function for use in API routes
 */
export function generateRiskFlags(policyData: PolicyData): RiskFlag[] {
    return detectMissingFeatures(policyData.coverages, policyData.expiryDate);
}
