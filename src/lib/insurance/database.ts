// Database operations for insurance analyses
import { createClient } from '@supabase/supabase-js';
import { AnalysisResult, PolicyData, BrochureData } from './types';

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

/**
 * Store analysis result in database
 */
export async function storeAnalysis(analysis: AnalysisResult): Promise<string> {
    const { documentType, policyData, brochureData, scenarios, riskFlags, extractionConfidence, extractedPerils } = analysis;

    const record: any = {
        document_type: documentType,
        scenarios: scenarios || [],
        risk_flags: riskFlags || [],
        extraction_confidence: extractionConfidence || 0.85,
        raw_text: analysis.rawText ? analysis.rawText.slice(0, 100000) : null, // Storing for Rexi Chat RAG (capped at 100K chars)
    };

    if (documentType !== 'brochure' && policyData) {
        // Policy/Quotation data - with safety checks
        record.vehicle_make = policyData.vehicleInfo?.make || null;
        record.vehicle_model = policyData.vehicleInfo?.model || null;
        record.vehicle_registration = policyData.vehicleInfo?.registrationNo || null;
        record.vehicle_year = policyData.vehicleInfo?.manufacturingYear || null;
        record.idv = policyData.idv?.toString() || '0';
        record.premium = policyData.premium?.toString() || '0';
        record.policy_number = policyData.policyNumber || null;
        record.quotation_id = policyData.quotationId || null;
        record.expiry_date = policyData.expiryDate || null;
        record.valid_until = policyData.validUntil || null;
        record.insurer_name = policyData.insurerName || 'Unknown';
        record.coverages = policyData.coverages || {};
        record.extracted_perils = extractedPerils || null;
        record.compulsory_deductible = policyData.compulsoryDeductible || 0;
        record.voluntary_deductible = policyData.voluntaryDeductible || 0;
        record.ncb = policyData.ncb || 0;
    } else if (brochureData) {
        // Brochure data
        record.insurer_name = brochureData.insurerName;
        record.brochure_features = {
            productName: brochureData.productName,
            featuresOffered: brochureData.featuresOffered,
            cashlessGarages: brochureData.cashlessGarages,
            exclusions: brochureData.exclusions,
        };
    }

    const { data, error } = await getSupabase()
        .from('insurance_analyses')
        .insert(record)
        .select('id')
        .single();

    if (error) throw new Error(error.message ?? 'Failed to store motor analysis');
    return data.id;
}

/**
 * Retrieve analysis by ID
 */
export async function getAnalysis(id: string): Promise<AnalysisResult> {
    const { data, error } = await getSupabase()
        .from('insurance_analyses')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw new Error(error.message ?? 'Motor analysis not found');

    // Transform to AnalysisResult format
    const result: AnalysisResult = {
        id: data.id,
        documentType: data.document_type,
        scenarios: data.scenarios,
        riskFlags: data.risk_flags,
        extractionConfidence: data.extraction_confidence,
        rawText: data.raw_text, // Retrieve for Rexi Chat
        createdAt: data.created_at,
    };

    if (data.document_type !== 'brochure') {
        result.policyData = {
            documentType: data.document_type,
            vehicleInfo: {
                make: data.vehicle_make,
                model: data.vehicle_model,
                registrationNo: data.vehicle_registration,
                manufacturingYear: data.vehicle_year,
            },
            idv: parseFloat(data.idv),
            premium: parseFloat(data.premium),
            policyNumber: data.policy_number,
            quotationId: data.quotation_id,
            expiryDate: data.expiry_date,
            validUntil: data.valid_until,
            coverages: data.coverages,
            compulsoryDeductible: parseFloat(data.compulsory_deductible) || 0,
            voluntaryDeductible: parseFloat(data.voluntary_deductible) || 0,
            ncb: parseFloat(data.ncb) || 0,
            insurerName: data.insurer_name,
        };
        result.extractedPerils = data.extracted_perils;
    } else {
        result.brochureData = {
            documentType: 'brochure',
            insurerName: data.insurer_name,
            ...(data.brochure_features || {}),
        };
    }

    return result;
}

/**
 * Create the insurance_analyses table (run once)
 */
export async function createInsuranceTable() {
    const { error } = await getSupabase().rpc('create_insurance_table_if_not_exists', {});
    if (error) console.error('Table creation error:', error);
    else console.log('✅ Insurance table ready');
}

/**
 * Update analysis result in database
 */
const UPDATABLE_FIELDS = [
    'document_type', 'scenarios', 'risk_flags', 'extraction_confidence',
    'vehicle_make', 'vehicle_model', 'vehicle_registration', 'vehicle_year',
    'idv', 'premium', 'policy_number', 'quotation_id', 'expiry_date',
    'valid_until', 'insurer_name', 'coverages', 'extracted_perils',
    'compulsory_deductible', 'voluntary_deductible', 'ncb', 'brochure_features'
] as const;

export async function updateAnalysis(id: string, updates: Record<string, unknown>): Promise<void> {
    const safeUpdates = Object.fromEntries(
        Object.entries(updates).filter(([k]) => UPDATABLE_FIELDS.includes(k as any))
    );

    if (Object.keys(safeUpdates).length === 0) return;
    const { error } = await getSupabase()
        .from('insurance_analyses')
        .update(safeUpdates)
        .eq('id', id);

    if (error) throw error;
}
