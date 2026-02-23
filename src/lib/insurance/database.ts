// Database operations for insurance analyses
import { createClient } from '@supabase/supabase-js';
import { AnalysisResult, PolicyData, BrochureData } from './types';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
        raw_text: analysis.rawText || null, // Storing for Rexi Chat RAG
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

    const { data, error } = await supabase
        .from('insurance_analyses')
        .insert(record)
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
}

/**
 * Retrieve analysis by ID
 */
export async function getAnalysis(id: string): Promise<AnalysisResult> {
    const { data, error } = await supabase
        .from('insurance_analyses')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

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
            compulsoryDeductible: 0, // Not stored separately
            voluntaryDeductible: 0,
            ncb: 0,
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
    const { error } = await supabase.rpc('create_insurance_table_if_not_exists', {});
    if (error) console.error('Table creation error:', error);
    else console.log('✅ Insurance table ready');
}

/**
 * Update analysis result in database
 */
export async function updateAnalysis(id: string, updates: Partial<any>): Promise<void> {
    const { error } = await supabase
        .from('insurance_analyses')
        .update(updates)
        .eq('id', id);

    if (error) throw error;
}
