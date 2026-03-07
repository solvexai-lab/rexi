/**
 * Health Insurance Database Layer
 * Reads and writes to health_insurance_analyses table.
 * NEVER queries insurance_analyses (motor) — completely separate.
 */

import { createClient } from '@supabase/supabase-js';
import { HealthAnalysisResult, HealthPolicyData, HealthRiskFlag, HealthClaimScenario } from '../types';

let _supabase: any = null;
function getSupabase() {
    if (!_supabase) {
        _supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    }
    return _supabase;
}

// ─── Store a new health analysis ──────────────────────────────────────────────

export async function storeHealthAnalysis(analysis: HealthAnalysisResult): Promise<string> {
    const p = analysis.policyData;

    const { data, error } = await getSupabase()
        .from('health_insurance_analyses')
        .insert({
            document_type: analysis.documentType,
            insurer_name: p?.insurerName ?? 'Unknown',
            product_name: p?.productName ?? null,
            policy_number: p?.policyNumber ?? null,
            coverage_type: p?.coverageType ?? null,
            sum_insured: p?.sumInsured ?? null,
            premium: p?.premium ?? null,
            policy_start: p?.policyStart ?? null,
            policy_end: p?.policyEnd ?? null,
            room_rent_limit: p?.roomRentLimit ?? null,
            room_rent_limit_type: p?.roomRentLimitType ?? 'none',
            room_rent_percent: p?.roomRentPercent ?? null,
            icu_limit: p?.icuLimit ?? null,
            co_pay: p?.coPay ?? 0,
            deductible: p?.deductible ?? 0,
            network_hospitals: p?.networkHospitals ?? null,
            claim_settlement_ratio: p?.claimSettlementRatio ?? null,
            cumulative_bonus: p?.cumulativeBonus ?? false,
            restoration_benefit: p?.restorationBenefit ?? false,
            waiting_periods: p?.waitingPeriods ?? null,
            sub_limits: p?.subLimits ?? null,
            coverages: p?.coverages ?? null,
            scenarios: analysis.scenarios ?? null,
            risk_flags: analysis.riskFlags ?? null,
            extracted_conditions: analysis.extractedConditions ?? null,
            extraction_confidence: analysis.extractionConfidence,
            raw_text: analysis.rawText ?? null,   // Never truncate — full OCR for Rexi
        })
        .select('id')
        .single();

    if (error) throw new Error(`Failed to store health analysis: ${error.message}`);
    return data.id;
}

// ─── Fetch a health analysis by ID ───────────────────────────────────────────

export async function getHealthAnalysis(id: string): Promise<HealthAnalysisResult> {
    const { data, error } = await getSupabase()
        .from('health_insurance_analyses')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) throw new Error(`Health analysis not found: ${id}`);

    // Reconstruct policyData for ALL document types (policy, certificate, AND brochure)
    // Brochures need policyData too — without it the dashboard shows "Invalid analysis data."
    const policyData: HealthPolicyData = {
        documentType: data.document_type,
        insurerName: data.insurer_name ?? 'Unknown Insurer',
        productName: data.product_name ?? 'Health Insurance Policy',
        policyNumber: data.policy_number ?? null,
        coverageType: data.coverage_type ?? 'individual',
        sumInsured: data.sum_insured ?? 0,
        premium: data.premium ?? 0,
        policyStart: data.policy_start ?? null,
        policyEnd: data.policy_end ?? null,
        roomRentLimit: data.room_rent_limit ?? null,
        roomRentLimitType: data.room_rent_limit_type ?? 'none',
        roomRentPercent: data.room_rent_percent ?? null,
        icuLimit: data.icu_limit ?? null,
        coPay: data.co_pay ?? 0,
        deductible: data.deductible ?? 0,
        networkHospitals: data.network_hospitals ?? null,
        claimSettlementRatio: data.claim_settlement_ratio ?? null,
        cumulativeBonus: data.cumulative_bonus ?? false,
        restorationBenefit: data.restoration_benefit ?? false,
        waitingPeriods: data.waiting_periods ?? { initialDays: 30, pedMonths: 36, specificDiseaseMonths: 24, maternityMonths: 0 },
        subLimits: data.sub_limits ?? { cataract: null, kneeReplacement: null, hernia: null, maternity: null, organDonor: null },
        coverages: data.coverages ?? {
            inpatientHospitalization: true, dayCare: true, preHospitalizationDays: 30,
            postHospitalizationDays: 60, ambulance: true, maternity: false, newbornCover: false,
            ayush: false, opd: false, criticalIllness: false, organDonor: false,
            mentalHealth: false, domiciliaryHospitalization: false, internationalCover: false,
        },
    };

    return {
        id: data.id,
        documentType: data.document_type,
        policyData,
        scenarios: (data.scenarios as HealthClaimScenario[]) ?? undefined,
        riskFlags: (data.risk_flags as HealthRiskFlag[]) ?? undefined,
        extractedConditions: data.extracted_conditions ?? undefined,
        extractionConfidence: data.extraction_confidence ?? 0.8,
        rawText: data.raw_text ?? undefined,
        createdAt: data.created_at,
    };
}

// ─── Update a health analysis ─────────────────────────────────────────────────

export async function updateHealthAnalysis(
    id: string,
    updates: Record<string, unknown>
): Promise<void> {
    const { error } = await getSupabase()
        .from('health_insurance_analyses')
        .update(updates)
        .eq('id', id);

    if (error) throw new Error(`Failed to update health analysis: ${error.message}`);
}

// ─── List recent health analyses (for upload page scan history) ───────────────

export async function listRecentHealthAnalyses(limit = 5): Promise<{
    id: string;
    insurerName: string;
    productName: string;
    sumInsured: number;
    documentType: string;
    createdAt: string;
}[]> {
    const { data, error } = await getSupabase()
        .from('health_insurance_analyses')
        .select('id, insurer_name, product_name, sum_insured, document_type, created_at')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) return [];

    return (data ?? []).map((r: any) => ({
        id: r.id,
        insurerName: r.insurer_name,
        productName: r.product_name ?? 'Health Policy',
        sumInsured: r.sum_insured ?? 0,
        documentType: r.document_type,
        createdAt: r.created_at,
    }));
}
