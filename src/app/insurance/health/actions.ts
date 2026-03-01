"use server";

/**
 * Health Insurance Server Actions
 * Pattern mirrors: src/app/insurance/actions.ts (motor actions)
 *
 * All actions operate only on health_insurance_analyses.
 * No motor table is ever touched from here.
 */

import { revalidatePath } from "next/cache";
import { updateHealthAnalysis } from "@/lib/insurance/health/database";
import type { HealthPolicyData } from "@/lib/insurance/types";

/**
 * Update a health policy's editable fields.
 * Called from HealthEditPolicyModal.
 */
export async function updateHealthPolicyAction(
    id: string,
    patch: Partial<HealthPolicyData>
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!id || typeof id !== "string" || id.trim() === "") {
            return { success: false, error: "Invalid analysis ID" };
        }

        // Sanitise: only allow safe editable fields — never allow overwriting raw_text or id
        const allowedFields: (keyof HealthPolicyData)[] = [
            "sumInsured",
            "premium",
            "policyStart",
            "policyEnd",
            "roomRentLimit",
            "roomRentLimitType",
            "roomRentPercent",
            "icuLimit",
            "coPay",
            "deductible",
            "coverageType",
            "policyNumber",
            "insurerName",
            "productName",
        ];

        const dbUpdates: Record<string, any> = {};
        if ('sumInsured' in patch) dbUpdates.sum_insured = patch.sumInsured;
        if ('premium' in patch) dbUpdates.premium = patch.premium;
        if ('policyStart' in patch) dbUpdates.policy_start = patch.policyStart;
        if ('policyEnd' in patch) dbUpdates.policy_end = patch.policyEnd;
        if ('roomRentLimit' in patch) dbUpdates.room_rent_limit = patch.roomRentLimit;
        if ('roomRentLimitType' in patch) dbUpdates.room_rent_limit_type = patch.roomRentLimitType;
        if ('roomRentPercent' in patch) dbUpdates.room_rent_percent = patch.roomRentPercent;
        if ('icuLimit' in patch) dbUpdates.icu_limit = patch.icuLimit;
        if ('coPay' in patch) dbUpdates.co_pay = patch.coPay;
        if ('deductible' in patch) dbUpdates.deductible = patch.deductible;
        if ('coverageType' in patch) dbUpdates.coverage_type = patch.coverageType;
        if ('policyNumber' in patch) dbUpdates.policy_number = patch.policyNumber;
        if ('insurerName' in patch) dbUpdates.insurer_name = patch.insurerName;
        if ('productName' in patch) dbUpdates.product_name = patch.productName;

        await updateHealthAnalysis(id, dbUpdates);

        // Revalidate the dashboard page so updated data is shown immediately
        revalidatePath(`/insurance/health/dashboard/${id}`);

        return { success: true };
    } catch (err: any) {
        console.error("[Health Action] updateHealthPolicyAction failed:", err);
        return { success: false, error: err.message || "Update failed" };
    }
}

/**
 * Re-run risk flags after a manual policy edit.
 * This calls the risk engine on the server and writes updated flags to DB.
 */
export async function regenerateHealthRiskFlagsAction(
    id: string,
    policyData: HealthPolicyData
): Promise<{ success: boolean; error?: string }> {
    try {
        const { generateHealthRiskFlags } = await import("@/lib/insurance/health/risk");
        const { calculateHealthScenarios } = await import("@/lib/insurance/health/calculator");
        const { updateHealthAnalysis } = await import("@/lib/insurance/health/database");

        const riskFlags = generateHealthRiskFlags(policyData);
        const scenarios = calculateHealthScenarios(policyData);

        await updateHealthAnalysis(id, { risk_flags: riskFlags, scenarios: scenarios });

        revalidatePath(`/insurance/health/dashboard/${id}`);

        return { success: true };
    } catch (err: any) {
        console.error("[Health Action] regenerateHealthRiskFlagsAction failed:", err);
        return { success: false, error: err.message || "Risk regeneration failed" };
    }
}
