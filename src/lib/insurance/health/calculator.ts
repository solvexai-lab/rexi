/**
 * Health Insurance Calculator
 * Separate from motor calculator — health uses proportionate deduction logic,
 * waiting period checks, co-pay, and sub-limits. Motor uses depreciation + deductibles.
 */

import { HealthPolicyData, HealthClaimScenario } from '../types';

// ─── Proportionate Deduction Formula ─────────────────────────────────────────
//
// When room rent taken > policy limit:
//   factor = policyRoomLimit / actualRoomRent
//   adjustedBill = totalBill × factor
//   afterCoPay = adjustedBill × (1 - coPay/100)
//   insurerPays = afterCoPay - deductible (min 0)
//   youPay = totalBill - insurerPays

function computeClaim(
    totalCost: number,
    policy: HealthPolicyData,
    actualRoomRent: number,
    isCovered: boolean
): { insurerPays: number; youPay: number; breakdown: string[] } {
    if (!isCovered) {
        return { insurerPays: 0, youPay: totalCost, breakdown: ['Benefit not covered by this policy'] };
    }

    const breakdown: string[] = [];
    let adjustedBill = totalCost;

    // Room rent proportionate deduction
    if (policy.roomRentLimit && policy.roomRentLimitType === 'fixed' && actualRoomRent > policy.roomRentLimit) {
        const factor = policy.roomRentLimit / actualRoomRent;
        adjustedBill = Math.round(totalCost * factor);
        const deducted = totalCost - adjustedBill;
        breakdown.push(`Proportionate deduction (room ₹${actualRoomRent}/day > limit ₹${policy.roomRentLimit}/day): −₹${deducted.toLocaleString('en-IN')}`);
    } else if (policy.roomRentLimitType === 'percentage' && policy.roomRentPercent) {
        const dailyLimit = Math.round((policy.sumInsured * policy.roomRentPercent) / 100);
        if (actualRoomRent > dailyLimit) {
            const factor = dailyLimit / actualRoomRent;
            adjustedBill = Math.round(totalCost * factor);
            const deducted = totalCost - adjustedBill;
            breakdown.push(`Proportionate deduction (room ₹${actualRoomRent}/day > ${policy.roomRentPercent}% SI limit ₹${dailyLimit}/day): −₹${deducted.toLocaleString('en-IN')}`);
        }
    }

    // Co-payment
    let afterCoPay = adjustedBill;
    if (policy.coPay > 0) {
        const coPayAmount = Math.round(adjustedBill * policy.coPay / 100);
        afterCoPay = adjustedBill - coPayAmount;
        breakdown.push(`Co-pay ${policy.coPay}%: you bear −₹${coPayAmount.toLocaleString('en-IN')}`);
    }

    // Deductible
    let insurerPays = Math.max(0, afterCoPay - policy.deductible);
    if (policy.deductible > 0) {
        breakdown.push(`Deductible: −₹${policy.deductible.toLocaleString('en-IN')}`);
    }

    const youPay = totalCost - insurerPays;

    if (breakdown.length === 0) {
        breakdown.push(`Insurer pays full adjusted amount`);
    }

    return { insurerPays, youPay, breakdown };
}

// ─── Waiting period check ─────────────────────────────────────────────────────

function isWaitingPeriodElapsed(
    policyStartIso: string | null,
    waitMonths: number
): boolean {
    if (!policyStartIso || waitMonths === 0) return true;
    const start = new Date(policyStartIso);
    const unlock = new Date(start);
    unlock.setMonth(unlock.getMonth() + waitMonths);
    return new Date() >= unlock;
}

// ─── Scenario definitions ─────────────────────────────────────────────────────

export function calculateHealthScenarios(policy: HealthPolicyData): HealthClaimScenario[] {
    const scenarios: HealthClaimScenario[] = [];

    // 1. Appendicitis — standard 5-day stay, room rent ₹8,000/day, total ₹1,00,000
    const appendicitisCost = 100000;
    const appendicitisRoom = 8000;
    const appendicitisElapsed = isWaitingPeriodElapsed(policy.policyStart, policy.waitingPeriods.initialDays > 0 ? 1 : 0);
    const { insurerPays: aIP, youPay: aYP, breakdown: aBD } = computeClaim(
        appendicitisCost, policy, appendicitisRoom, appendicitisElapsed
    );
    scenarios.push({
        scenarioName: 'Appendicitis Surgery',
        emoji: '🔪',
        description: '5-day hospital stay, general ward. Room rent ₹8,000/day, total bill ₹1,00,000.',
        totalCost: appendicitisCost,
        insurerPays: aIP,
        youPay: aYP,
        isCovered: appendicitisElapsed,
        breakdown: aBD,
        explanation: appendicitisElapsed
            ? `With your policy, the insurer pays ₹${aIP.toLocaleString('en-IN')} and your out-of-pocket cost is ₹${aYP.toLocaleString('en-IN')}.`
            : 'Initial waiting period not yet elapsed — this claim would be rejected.',
    });

    // 2. Knee Replacement — 3-day ICU + 5-day room, total ₹3,00,000
    const kneeTotal = 300000;
    const kneeRoom = 10000;
    const kneeSubLimit = policy.subLimits.kneeReplacement;
    const kneeEffectiveCost = kneeSubLimit ? Math.min(kneeTotal, kneeSubLimit) : kneeTotal;
    const { insurerPays: kIP, youPay: kYP, breakdown: kBD } = computeClaim(
        kneeTotal, policy, kneeRoom, true
    );
    const kBreakdown = [...kBD];
    if (kneeSubLimit && kneeTotal > kneeSubLimit) {
        kBreakdown.unshift(`Knee replacement sub-limit: ₹${kneeSubLimit.toLocaleString('en-IN')} (bill ₹${kneeTotal.toLocaleString('en-IN')})`);
    }
    scenarios.push({
        scenarioName: 'Knee Replacement',
        emoji: '🦵',
        description: '8-day stay, ₹10,000/day room. Total bill ₹3,00,000.',
        totalCost: kneeTotal,
        insurerPays: kneeSubLimit ? Math.min(kIP, kneeSubLimit) : kIP,
        youPay: kneeTotal - (kneeSubLimit ? Math.min(kIP, kneeSubLimit) : kIP),
        isCovered: true,
        breakdown: kBreakdown,
        explanation: `Knee replacement may have sub-limits. Your effective coverage is ₹${(kneeSubLimit ?? kIP).toLocaleString('en-IN')}.`,
    });

    // 3. ICU / Critical Illness — 10-day ICU, ₹25,000/day, total ₹5,00,000
    const icuTotal = 500000;
    const icuRoom = 25000;
    const icuCovered = policy.coverages.inpatientHospitalization;
    const { insurerPays: iIP, youPay: iYP, breakdown: iBD } = computeClaim(
        icuTotal, policy, icuRoom, icuCovered
    );
    // Apply ICU limit if set
    const icuLimit = policy.icuLimit;
    let icuIP = iIP, icuYP = iYP, icuBD = [...iBD];
    if (icuLimit) {
        const icuDays = 10;
        const icuCap = icuLimit * icuDays;
        if (iIP > icuCap) {
            icuIP = icuCap;
            icuYP = icuTotal - icuCap;
            icuBD.push(`ICU daily cap ₹${icuLimit.toLocaleString('en-IN')}/day × ${icuDays} days = ₹${icuCap.toLocaleString('en-IN')}`);
        }
    }
    scenarios.push({
        scenarioName: 'Critical ICU Admission',
        emoji: '🏥',
        description: '10-day ICU stay at ₹25,000/day. Total bill ₹5,00,000.',
        totalCost: icuTotal,
        insurerPays: icuIP,
        youPay: icuYP,
        isCovered: icuCovered,
        breakdown: icuBD,
        explanation: icuCovered
            ? `ICU cover applies. Your share is ₹${icuYP.toLocaleString('en-IN')}.`
            : 'Inpatient cover missing — full cost falls on you.',
    });

    // 4. Maternity — normal delivery, total ₹1,20,000
    const maternityTotal = 120000;
    const maternityElapsed = isWaitingPeriodElapsed(policy.policyStart, policy.waitingPeriods.maternityMonths);
    const matCovered = policy.coverages.maternity && maternityElapsed;
    const matSubLimit = policy.subLimits.maternity;
    const { insurerPays: mIP, youPay: mYP, breakdown: mBD } = computeClaim(
        maternityTotal, policy, 6000, matCovered
    );
    const mBreakdown = [...mBD];
    if (matCovered && matSubLimit && maternityTotal > matSubLimit) {
        mBreakdown.unshift(`Maternity sub-limit: ₹${matSubLimit.toLocaleString('en-IN')} (bill ₹${maternityTotal.toLocaleString('en-IN')})`);
    }
    const effectiveMatIP = matCovered && matSubLimit ? Math.min(mIP, matSubLimit) : mIP;
    scenarios.push({
        scenarioName: 'Maternity — Normal Delivery',
        emoji: '🤰',
        description: '3-day stay, normal delivery. Total bill ₹1,20,000.',
        totalCost: maternityTotal,
        insurerPays: effectiveMatIP,
        youPay: maternityTotal - effectiveMatIP,
        isCovered: matCovered,
        breakdown: mBreakdown,
        explanation: !policy.coverages.maternity
            ? 'Maternity is not covered by this policy.'
            : !maternityElapsed
                ? `Maternity waiting period of ${policy.waitingPeriods.maternityMonths} months not yet elapsed — claim would be rejected.`
                : `Maternity covered. Your share: ₹${(maternityTotal - effectiveMatIP).toLocaleString('en-IN')}.`,
    });

    return scenarios;
}
