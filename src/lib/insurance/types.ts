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

// ─── Insurance Compare Types ────────────────────────────────────────────────

/** Data extracted from a single insurer document during Phase 1 (SSE stream) */
export interface ExtractedInsurer {
    index: number;
    fileName: string;
    insurerName: string;
    documentType: 'policy' | 'quotation' | 'brochure';
    premium: number;
    idv: number;
    compulsoryDeductible: number;
    voluntaryDeductible: number;
    ncb: number;
    coverages: Coverage;
    vehicleInfo?: VehicleInfo;
    extractionError?: string; // set if OCR/extract failed for this file
}

/** One row in the side-by-side comparison table */
export interface CompareRow {
    feature: string;
    description: string;
    values: {
        insurerIndex: number;
        value: string;
        covered: boolean | null; // null = N/A (numeric value row)
        isWinner: boolean;
    }[];
}

/** One row in the risk matrix */
export interface CompareRiskRow {
    riskId: string;
    title: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    values: {
        insurerIndex: number;
        status: 'covered' | 'missing' | 'partial';
    }[];
}

/** Winner badges */
export interface CompareWinners {
    bestValue: { insurerIndex: number; reason: string };
    bestCovered: { insurerIndex: number; reason: string };
    lowestRisk: { insurerIndex: number; reason: string };
}

/** Per-scenario out-of-pocket costs across all insurers */
export interface CompareClaimScenario {
    scenarioName: string;
    description: string;
    repairCost: number;
    costs: { insurerIndex: number; youPay: number; insurerPays: number }[];
}

/** Full comparison result from Phase 2 (Gemini analysis) */
export interface InsuranceCompareResult {
    winners: CompareWinners;
    comparisonRows: CompareRow[];
    riskMatrix: CompareRiskRow[];
    claimScenarios: CompareClaimScenario[];
    summary: string;
    detailedAnalysis: string;
}


// ─── Health Insurance Types ───────────────────────────────────────────────────

export interface HealthCoverage {
    inpatientHospitalization: boolean;
    dayCare: boolean;
    preHospitalizationDays: number;       // 30 | 60 | 90
    postHospitalizationDays: number;      // 60 | 90 | 180
    ambulance: boolean;
    maternity: boolean;
    newbornCover: boolean;
    ayush: boolean;
    opd: boolean;
    criticalIllness: boolean;
    organDonor: boolean;
    mentalHealth: boolean;
    domiciliaryHospitalization: boolean;
    internationalCover: boolean;
}

export interface HealthWaitingPeriods {
    initialDays: number;            // typically 30
    pedMonths: number;              // 12 | 24 | 36 | 48
    specificDiseaseMonths: number;  // 12 | 24
    maternityMonths: number;        // 0 = not covered
}

export interface HealthSubLimits {
    cataract: number | null;          // null = no sub-limit / not covered
    kneeReplacement: number | null;
    hernia: number | null;
    maternity: number | null;
    organDonor: number | null;
}

export interface HealthPolicyData {
    documentType: 'policy' | 'certificate' | 'brochure';
    insurerName: string;
    productName: string;
    policyNumber: string | null;
    coverageType: 'individual' | 'floater' | 'senior_citizen' | 'group';
    sumInsured: number;
    premium: number;
    policyStart: string | null;       // ISO date YYYY-MM-DD
    policyEnd: string | null;
    roomRentLimit: number | null;     // ₹/day; null = no cap
    roomRentLimitType: 'fixed' | 'percentage' | 'none';
    roomRentPercent: number | null;   // e.g. 1 = "1% of SI per day"
    icuLimit: number | null;          // ₹/day; null = no cap
    coPay: number;                    // %, 0 = no copay
    deductible: number;               // ₹
    waitingPeriods: HealthWaitingPeriods;
    subLimits: HealthSubLimits;
    coverages: HealthCoverage;
    networkHospitals: number | null;
    claimSettlementRatio: number | null;  // %
    cumulativeBonus: boolean;
    restorationBenefit: boolean;
}

export interface HealthRiskFlag {
    id: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    description: string;
    recommendation: string;
}

export interface HealthClaimScenario {
    scenarioName: string;
    emoji: string;
    description: string;
    totalCost: number;
    insurerPays: number;
    youPay: number;
    isCovered: boolean;
    breakdown: string[];   // ["Proportionate deduction: ₹18,000", "Co-pay 10%: ₹8,200"]
    explanation: string;
}

export interface HealthAnalysisResult {
    id: string;
    documentType: 'policy' | 'certificate' | 'brochure';
    policyData: HealthPolicyData;
    scenarios?: HealthClaimScenario[];
    riskFlags?: HealthRiskFlag[];
    extractedConditions?: { covered: string[]; excluded: string[] };
    extractionConfidence: number;
    rawText?: string;
    createdAt: string;
}

// ─── Health Compare Types ─────────────────────────────────────────────────────

export interface ExtractedHealthInsurer {
    index: number;
    fileName: string;
    insurerName: string;
    productName: string;
    documentType: 'policy' | 'certificate' | 'brochure';
    sumInsured: number;
    premium: number;
    roomRentLimit: number | null;
    roomRentLimitType: 'fixed' | 'percentage' | 'none';
    roomRentPercent: number | null;
    icuLimit: number | null;
    coPay: number;
    deductible: number;
    waitingPeriods: HealthWaitingPeriods;
    subLimits: HealthSubLimits;
    coverages: HealthCoverage;
    networkHospitals: number | null;
    claimSettlementRatio: number | null;
    cumulativeBonus: boolean;
    restorationBenefit: boolean;
    extractionError?: string;
}

export interface HealthCompareScenario {
    scenarioName: string;
    description: string;
    totalCost: number;
    costs: {
        insurerIndex: number;
        youPay: number;
        insurerPays: number;
        breakdown: string;
    }[];
}

/** Full health comparison result (Phase 2 analysis) */
export interface HealthCompareResult {
    winners: CompareWinners;               // reuses existing: bestValue, bestCovered, lowestRisk
    comparisonRows: CompareRow[];          // reuses existing row type
    riskMatrix: CompareRiskRow[];          // reuses existing risk row type
    claimScenarios: HealthCompareScenario[];
    summary: string;
    detailedAnalysis: string;
}
