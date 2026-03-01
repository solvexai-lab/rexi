/**
 * Health Insurance Analysis API
 * POST /api/insurance/analyze-health
 *
 * Completely separate from /api/insurance/analyze (motor).
 * Uses health-specific classifier, extractor, calculator, risk engine, and DB table.
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractTextWithMistral } from '@/lib/mistral-ocr';
import { classifyHealthDocumentWithLLM } from '@/lib/insurance/health/classifier';
import {
    extractHealthPolicyData,
    applyHealthFallbacks,
    extractHealthConditions,
    calculateHealthConfidence,
    extractHealthBrochureData,
} from '@/lib/insurance/health/extractor';
import { calculateHealthScenarios } from '@/lib/insurance/health/calculator';
import { generateHealthRiskFlags } from '@/lib/insurance/health/risk';
import { storeHealthAnalysis } from '@/lib/insurance/health/database';
import { getClientIP, checkRateLimit, validateRequestOrigin, logSecurityEvent } from '@/lib/security';

export const maxDuration = 60;
export const runtime = 'nodejs';

const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB

export async function POST(req: NextRequest) {
    const clientIP = getClientIP(req);

    if (!validateRequestOrigin(req)) {
        logSecurityEvent('INVALID_ORIGIN_HEALTH_ANALYZE', { ip: clientIP });
        return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
    }

    const rateLimit = await checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
        logSecurityEvent('RATE_LIMIT_HEALTH_ANALYZE', { ip: clientIP });
        return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Size limit
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File too large (max 4.5MB)' }, { status: 400 });
        }

        // Accepted types
        const accepted = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/webp'];
        if (!accepted.includes(file.type) && !file.name.match(/\.(pdf|jpg|jpeg|png|heic|webp)$/i)) {
            return NextResponse.json({ error: 'Unsupported file type. Upload a PDF or image.' }, { status: 400 });
        }

        // 1. OCR
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const rawText = await extractTextWithMistral(buffer);

        if (!rawText || rawText.length < 100) {
            return NextResponse.json({ error: 'Could not extract text from document. Try a clearer scan.' }, { status: 400 });
        }

        console.log(`[Health Analyze] Extracted ${rawText.length} chars`);

        // 2. Classify - Use LLM for health as regex is too unreliable for distinguishing brochure vs policy
        const documentType = await classifyHealthDocumentWithLLM(rawText);
        console.log(`[Health Analyze] Document type: ${documentType}`);

        let id: string;

        if (documentType === 'brochure') {
            // 3a. Brochure path — now calculating risk flags too!
            const [brochureData, conditions] = await Promise.all([
                extractHealthBrochureData(rawText),
                extractHealthConditions(rawText),
            ]);

            // Create a pseudo-policy for risk calculation
            const pseudoPolicy: any = {
                documentType: 'brochure',
                insurerName: brochureData.insurerName,
                productName: brochureData.productName,
                policyNumber: null,
                coverageType: 'individual',
                sumInsured: 0, // Not fixed in brochures
                premium: 0,
                policyStart: null,
                policyEnd: null,
                roomRentLimit: null,
                roomRentLimitType: 'none',
                roomRentPercent: null,
                icuLimit: null,
                coPay: 0,
                deductible: 0,
                waitingPeriods: { initialDays: 30, pedMonths: 36, specificDiseaseMonths: 24, maternityMonths: 0 },
                subLimits: { cataract: null, kneeReplacement: null, hernia: null, maternity: null, organDonor: null },
                coverages: {
                    inpatientHospitalization: true, dayCare: true, preHospitalizationDays: 30,
                    postHospitalizationDays: 60, ambulance: true, maternity: false, newbornCover: false,
                    ayush: false, opd: false, criticalIllness: false, organDonor: false,
                    mentalHealth: false, domiciliaryHospitalization: false, internationalCover: false,
                },
                networkHospitals: null,
                claimSettlementRatio: null,
                cumulativeBonus: false,
                restorationBenefit: false,
            };

            // Enhance with fallbacks just in case
            const policyData = applyHealthFallbacks(pseudoPolicy, rawText);
            const riskFlags = generateHealthRiskFlags(policyData);

            id = await storeHealthAnalysis({
                id: '',
                documentType: 'brochure',
                policyData,
                riskFlags,
                extractedConditions: conditions,
                extractionConfidence: 0.7,
                rawText,
                createdAt: new Date().toISOString(),
            });
        } else {
            // 3b. Policy / certificate path
            const [rawPolicyData, conditions] = await Promise.all([
                extractHealthPolicyData(rawText),
                extractHealthConditions(rawText),
            ]);

            const policyData = applyHealthFallbacks(rawPolicyData, rawText);
            const [scenarios, riskFlags] = await Promise.all([
                Promise.resolve(calculateHealthScenarios(policyData)),
                Promise.resolve(generateHealthRiskFlags(policyData)),
            ]);

            const confidence = calculateHealthConfidence(policyData);

            id = await storeHealthAnalysis({
                id: '',
                documentType,
                policyData,
                scenarios,
                riskFlags,
                extractedConditions: conditions,
                extractionConfidence: confidence,
                rawText,
                createdAt: new Date().toISOString(),
            });
        }

        console.log(`[Health Analyze] Stored with ID: ${id}`);

        return NextResponse.json({
            success: true,
            redirectTo: `/insurance/health/dashboard/${id}`,
            id,
        });

    } catch (error: any) {
        console.error('[Health Analyze] Failed:', error);
        return NextResponse.json({ error: 'Health analysis failed. Please try again.' }, { status: 500 });
    }
}
