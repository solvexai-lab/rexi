// Insurance Claim Scenario Calculator
import { PolicyData, ClaimScenario } from './types';

/**
 * Calculate what user pays in 3 common claim scenarios
 */
export function calculateScenarios(policyData: PolicyData): ClaimScenario[] {
    const { idv, coverages } = policyData;
    // Default deductibles if not provided
    const compulsoryDeductible = policyData.compulsoryDeductible || 0;
    const voluntaryDeductible = policyData.voluntaryDeductible || 0;
    const totalDeductible = compulsoryDeductible + voluntaryDeductible;

    // Scenario 1: The "Fender Bender" (₹15,000 repair)
    const fenderBenderCost = 15000;
    const fenderDepreciation = coverages.hasZeroDepreciation ? 0 : 6000; // 40% depreciation on parts
    const fenderYouPay = fenderDepreciation + totalDeductible;

    const fenderBender: ClaimScenario = {
        scenarioName: 'The "Fender Bender"',
        description: 'Minor accident - bumper, headlight, fender damage',
        repairCost: fenderBenderCost,
        insurerPays: fenderBenderCost - fenderYouPay,
        youPay: fenderYouPay,
        explanation: coverages.hasZeroDepreciation
            ? `Recommendation: Your Zero Dep cover saves you ₹${fenderDepreciation.toLocaleString()}!`
            : `⚠️ Recommendation: Add Zero Depreciation on renewal`
    };

    // Scenario 2: The "Monsoon Nightmare" (₹80,000 engine damage)
    const monsoonCost = 80000;
    const monsoonCovered = coverages.hasEngineProtection;
    const monsoonYouPay = monsoonCovered ? totalDeductible : monsoonCost;

    const monsoonNightmare: ClaimScenario = {
        scenarioName: 'The "Monsoon Nightmare"',
        description: 'Engine flooded, water seepage damage',
        repairCost: monsoonCost,
        insurerPays: monsoonCovered ? (monsoonCost - totalDeductible) : 0,
        youPay: monsoonYouPay,
        explanation: monsoonCovered
            ? `Recommendation: Your Engine Protection saves you ₹${(monsoonCost - totalDeductible).toLocaleString()}!`
            : `⚠️ Recommendation: Add Engine Protection (critical for monsoons)`
    };

    // Scenario 3: The "Total Loss" (100% IDV claim)
    const totalLossCost = idv;
    const totalLossDepreciation = coverages.hasReturnToInvoice ? 0 : idv * 0.2; // 20% depreciation
    const totalLossYouPay = totalLossDepreciation;

    const totalLoss: ClaimScenario = {
        scenarioName: 'The "Total Loss"',
        description: 'Vehicle stolen or beyond repair',
        repairCost: totalLossCost,
        insurerPays: totalLossCost - totalLossYouPay,
        youPay: totalLossYouPay,
        explanation: coverages.hasReturnToInvoice
            ? `Recommendation: Your RTI cover ensures full invoice value payout!`
            : `⚠️ Recommendation: Consider Return to Invoice for new vehicles`
    };

    return [fenderBender, monsoonNightmare, totalLoss];
}

/**
 * Calculate days remaining until policy expires
 */
export function calculateDaysRemaining(expiryDate: string): number {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Get policy status based on days remaining
 */
export function getPolicyStatus(daysRemaining: number): 'active' | 'expiring' | 'expired' {
    if (daysRemaining < 0) return 'expired';
    if (daysRemaining <= 30) return 'expiring';
    return 'active';
}

/**
 * Calculate extraction confidence based on field completeness
 */
export function calculatePolicyConfidence(data: PolicyData): number {
    const requiredFields = [
        data.vehicleInfo.make,
        data.vehicleInfo.model,
        data.vehicleInfo.registrationNo,
        data.idv,
        data.premium,
        data.insurerName
    ];

    const filledFields = requiredFields.filter(field => field && field !== '' && field !== 0).length;
    return filledFields / requiredFields.length;
}

export function calculateBrochureConfidence(data: any): number {
    const filledCount = [
        data.insurerName,
        data.productName,
        data.featuresOffered?.length > 0,
        data.exclusions?.length > 0
    ].filter(Boolean).length;

    return filledCount / 4;
}
