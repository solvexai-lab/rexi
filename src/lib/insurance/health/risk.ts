/**
 * Health Insurance Risk Flag Generator
 * 10 checks covering the most critical health policy traps Globally.
 * Separate from motor risk logic — health risks are fundamentally different.
 */

import { HealthPolicyData, HealthRiskFlag } from '../types';

export function generateHealthRiskFlags(policy: HealthPolicyData): HealthRiskFlag[] {
    const flags: HealthRiskFlag[] = [];

    // 1. Room rent trap — most dangerous and widely misunderstood
    if (policy.roomRentLimitType === 'fixed' && policy.roomRentLimit !== null && policy.roomRentLimit < 5000) {
        flags.push({
            id: 'room-rent-trap',
            severity: 'HIGH',
            title: 'Room Rent Trap — Proportionate Deduction Risk',
            description: `Your room rent limit is ₹${policy.roomRentLimit}/day. If you take a room at ₹8,000/day at a network hospital, the insurer applies proportionate deduction to your ENTIRE bill — not just the room. A ₹1 lakh surgery bill could become a ₹60,000 claim rejection.`,
            recommendation: 'Request an upgrade to "actual room rent" or at least ₹5,000/day. The premium increase is minimal vs. the claim exposure.',
        });
    } else if (policy.roomRentLimitType === 'percentage' && policy.roomRentPercent !== null && policy.roomRentPercent < 1) {
        flags.push({
            id: 'room-rent-trap-percent',
            severity: 'HIGH',
            title: 'Room Rent % Too Low — Proportionate Deduction Risk',
            description: `Room rent is capped at ${policy.roomRentPercent}% of Sum Insured per day = ₹${Math.round((policy.sumInsured * policy.roomRentPercent) / 100)}/day. Most network hospitals charge ₹6,000–₹12,000/day, triggering proportionate deduction on your entire bill.`,
            recommendation: 'Negotiate at least 1% of Sum Insured as daily room rent limit, or opt for a policy with no room rent cap.',
        });
    }

    // 2. High co-payment
    if (policy.coPay >= 20) {
        flags.push({
            id: 'high-copay',
            severity: 'HIGH',
            title: `High Co-payment — ${policy.coPay}% Out of Pocket`,
            description: `For every ₹1 lakh claim, you personally pay ₹${policy.coPay * 1000}. On a ₹5 lakh critical illness claim, your out-of-pocket is ₹${(policy.coPay * 5000).toLocaleString('en-IN')} before any other deductions.`,
            recommendation: 'Consider upgrading to a zero co-pay plan. The premium difference is rarely worth the claim exposure.',
        });
    } else if (policy.coPay > 0 && policy.coPay < 20) {
        flags.push({
            id: 'copay-exists',
            severity: 'MEDIUM',
            title: `${policy.coPay}% Co-payment Applies`,
            description: `A ${policy.coPay}% co-payment is deducted from every claim. On a ₹2 lakh hospitalisation, you bear ₹${(policy.coPay * 2000).toLocaleString('en-IN')}.`,
            recommendation: 'Verify if co-pay applies only for certain hospitals/ages or all claims. Zero co-pay plans are often only marginally more expensive.',
        });
    }

    // 3. PED waiting period too long
    if (policy.waitingPeriods.pedMonths > 24) {
        flags.push({
            id: 'ped-wait-too-long',
            severity: 'HIGH',
            title: `${policy.waitingPeriods.pedMonths}-Month PED Waiting Period`,
            description: `Pre-existing diseases (diabetes, hypertension, thyroid) are not covered for ${policy.waitingPeriods.pedMonths} months. If you're hospitalised for a related condition in this period, the entire claim is rejected — not just proportionally reduced.`,
            recommendation: 'Compare policies with 12-month PED waiting periods. With Portability rules, you can also switch insurers and carry forward your waiting period credit.',
        });
    }

    // 4. Low sum insured
    if (policy.sumInsured < 500000) {
        flags.push({
            id: 'low-sum-insured',
            severity: 'HIGH',
            title: `Sum Insured ₹${(policy.sumInsured / 100000).toFixed(1)}L Is Inadequate`,
            description: `A 10-day ICU stay in a private hospital in a metro city costs ₹3–7 lakh. Cancer treatment averages ₹15–25 lakh. Your sum insured of ₹${(policy.sumInsured / 100000).toFixed(1)}L would be exhausted in a single critical event.`,
            recommendation: 'Minimum ₹10L for individuals, ₹15L for a family floater. A Super Top-Up plan can boost coverage at low cost.',
        });
    }

    // 5. Maternity not covered
    if (!policy.coverages.maternity) {
        flags.push({
            id: 'no-maternity',
            severity: 'MEDIUM',
            title: 'Maternity Not Covered',
            description: 'Normal delivery costs ₹80,000–₹2 lakh; C-section ₹1.5–₹3 lakh in private hospitals. This policy does not cover maternity expenses.',
            recommendation: policy.coverageType === 'senior_citizen'
                ? 'Maternity cover is not applicable for senior citizen plans — this is expected.'
                : 'Look for plans with maternity cover. Ensure the waiting period (typically 24 months) is factored into your planning.',
        });
    }

    // 6. No daycare cover
    if (!policy.coverages.dayCare) {
        flags.push({
            id: 'no-daycare',
            severity: 'MEDIUM',
            title: 'Day-Care Procedures Not Covered',
            description: 'Cataract surgery, dialysis, and chemotherapy — all done in under 24 hours — would not be claimable. IRDAI mandates at least 132 day-care procedures be covered.',
            recommendation: 'Escalate to your insurer — newer IRDAI guidelines may make this mandatory. Verify the policy year and applicable regulations.',
        });
    }

    // 7. Dangerous sub-limits (below realistic cost)
    const dangerousSubs: string[] = [];
    if (policy.subLimits.cataract !== null && policy.subLimits.cataract < 40000) {
        dangerousSubs.push(`Cataract ₹${policy.subLimits.cataract.toLocaleString('en-IN')} (actual cost: ₹40,000–₹80,000/eye)`);
    }
    if (policy.subLimits.kneeReplacement !== null && policy.subLimits.kneeReplacement < 100000) {
        dangerousSubs.push(`Knee Replacement ₹${policy.subLimits.kneeReplacement.toLocaleString('en-IN')} (actual cost: ₹1.5–₹3 lakh)`);
    }
    if (dangerousSubs.length > 0) {
        flags.push({
            id: 'sublimit-inadequate',
            severity: 'MEDIUM',
            title: 'Sub-limits Below Real Procedure Costs',
            description: `These sub-limits are dangerously low: ${dangerousSubs.join('; ')}. The gap becomes your out-of-pocket expense even if your total sum insured is not exhausted.`,
            recommendation: 'Ask for a rider to remove or increase specific sub-limits. Alternatively, switch to a plan that is "sub-limit free".',
        });
    }

    // 8. No restoration benefit
    if (!policy.restorationBenefit && policy.sumInsured < 1000000) {
        flags.push({
            id: 'no-restoration',
            severity: 'MEDIUM',
            title: 'No Restoration Benefit',
            description: 'If your sum insured is exhausted in a hospitalisation, subsequent claims in the same year will not be covered. Without restoration, a single major event can leave you unprotected for the rest of the policy year.',
            recommendation: 'Opt for a plan with 100% restoration. For family floaters, this is especially important when the SI is shared across members.',
        });
    }

    // 9. No AYUSH cover
    if (!policy.coverages.ayush) {
        flags.push({
            id: 'no-ayush',
            severity: 'LOW',
            title: 'Ayurveda / Homeopathy Not Covered (AYUSH)',
            description: 'IRDAI mandates AYUSH cover in all standard health policies from 2020 onwards. This policy may be an older variant or a group plan exempt from this rule.',
            recommendation: 'Verify policy year. If issued post-2020, raise a complaint with IRDAI if AYUSH is missing.',
        });
    }

    // 10. Short post-hospitalisation cover
    if (policy.coverages.inpatientHospitalization && policy.coverages.postHospitalizationDays < 60) {
        flags.push({
            id: 'short-post-hosp',
            severity: 'LOW',
            title: `Short Post-Hospitalisation Cover (${policy.coverages.postHospitalizationDays} days)`,
            description: `Post-discharge medicines, physiotherapy, and follow-up consultations are only covered for ${policy.coverages.postHospitalizationDays} days. Most recoveries (especially surgeries) require 60–90 days of follow-up care.`,
            recommendation: 'Compare plans offering 90-day post-hospitalisation cover. The premium difference is marginal.',
        });
    }

    return flags;
}
