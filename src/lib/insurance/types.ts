export interface VehicleInfo {
    make: string;
    model: string;
    registrationNo: string;
    manufacturingYear: number;
}

export interface Coverage {
    hasOwnDamage: boolean;
    hasThirdPartyLiability: boolean;
    hasZeroDepreciation: boolean;
    hasEngineProtection: boolean;
    hasReturnToInvoice: boolean;
    hasNCBProtection: boolean;
    hasRoadsideAssistance: boolean;
}

export interface PolicyData {
    documentType: 'policy' | 'quotation';
    vehicleInfo: VehicleInfo;
    idv: number;
    premium: number;
    policyNumber?: string;  // Only for policies
    quotationId?: string;   // Only for quotations
    expiryDate?: string;    // Only for policies (YYYY-MM-DD)
    validUntil?: string;    // Only for quotations
    coverages: Coverage;
    compulsoryDeductible: number;
    voluntaryDeductible: number;
    ncb: number;  // 0-50%
    insurerName: string;
}

export interface BrochureData {
    documentType: 'brochure';
    insurerName: string;
    productName: string;
    featuresOffered: string[];  // "Zero Depreciation", "Engine Protection", etc.
    cashlessGarages: number;
    exclusions: string[];       // "Wear and tear", "Consequential loss", etc.
}

export interface ClaimScenario {
    scenarioName: string;
    description: string;
    repairCost: number;
    insurerPays: number;
    youPay: number;
    explanation: string;
}

export interface RiskFlag {
    id: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    description: string;
    recommendation?: string;
}

export interface AnalysisResult {
    id: string;
    documentType: 'policy' | 'quotation' | 'brochure';
    rawText?: string;
    policyData?: PolicyData;
    brochureData?: BrochureData;
    scenarios?: ClaimScenario[];  // Only for policy/quotation
    riskFlags?: RiskFlag[];       // Only for policy/quotation
    extractionConfidence?: number;  // 0.0 - 1.0
    extractedPerils?: {  // For Plain English Accordion
        covered: string[];
        exclusions: string[];
    };
    createdAt: string;
}

