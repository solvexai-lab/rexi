/**
 * Health Insurance Compare Extract API
 * POST /api/insurance/health-compare-extract
 *
 * SSE stream — mirrors /api/insurance/compare-extract but uses health extraction.
 * Emits ExtractedHealthInsurer events per file.
 */

import { NextRequest } from 'next/server';
import { extractTextWithMistral } from '@/lib/mistral-ocr';
import { classifyHealthDocument } from '@/lib/insurance/health/classifier';
import { extractHealthPolicyData, applyHealthFallbacks, extractHealthBrochureData } from '@/lib/insurance/health/extractor';
import {
    getClientIP,
    checkRateLimit,
    validateRequestOrigin,
    logSecurityEvent,
} from '@/lib/security';
import type { ExtractedHealthInsurer } from '@/lib/insurance/types';

export const maxDuration = 120;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_FILES = 4;
const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
const ALLOWED_MIME = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/heic',
    'image/heif',
    'image/webp',
];

function sseEvent(data: object): string {
    return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
    const clientIP = getClientIP(req);

    if (!validateRequestOrigin(req)) {
        logSecurityEvent('INVALID_ORIGIN_HEALTH_COMPARE_EXTRACT', { ip: clientIP });
        return new Response(JSON.stringify({ error: 'Invalid request origin' }), { status: 403 });
    }

    const rateLimit = await checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
        logSecurityEvent('RATE_LIMIT_HEALTH_COMPARE_EXTRACT', { ip: clientIP });
        return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
    }

    let formData: FormData;
    try {
        formData = await req.formData();
    } catch {
        return new Response(JSON.stringify({ error: 'Invalid form data' }), { status: 400 });
    }

    const files: { file: File; index: number }[] = [];
    for (let i = 0; i < MAX_FILES; i++) {
        const f = formData.get(`file${i}`) as File | null;
        if (f) files.push({ file: f, index: i });
    }

    if (files.length < 2) {
        return new Response(JSON.stringify({ error: 'Please upload at least 2 health insurance documents' }), { status: 400 });
    }

    for (const { file } of files) {
        if (file.size > MAX_FILE_SIZE) {
            return new Response(JSON.stringify({ error: `${file.name} exceeds 4.5MB limit` }), { status: 400 });
        }
        const mime = file.type || 'application/pdf';
        if (!ALLOWED_MIME.includes(mime.toLowerCase())) {
            return new Response(JSON.stringify({ error: `${file.name}: Unsupported file type` }), { status: 400 });
        }
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const emit = (data: object) => {
                controller.enqueue(encoder.encode(sseEvent(data)));
            };

            const extracted: ExtractedHealthInsurer[] = [];

            for (const { file, index } of files) {
                try {
                    emit({ index, status: 'extracting', fileName: file.name, stage: 'Reading document…' });

                    const bytes = await file.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    const mimeType = file.type || 'application/pdf';

                    const text = await extractTextWithMistral(buffer, mimeType);

                    if (!text || text.length < 50) {
                        emit({ index, status: 'error', fileName: file.name, message: 'Could not extract text from document' });
                        continue;
                    }

                    emit({ index, status: 'extracting', fileName: file.name, stage: 'Classifying health document…' });
                    const docType = classifyHealthDocument(text);

                    emit({ index, status: 'extracting', fileName: file.name, stage: 'Extracting health data…' });

                    let insurerData: ExtractedHealthInsurer;

                    if (docType === 'brochure') {
                        const brochure = await extractHealthBrochureData(text);
                        insurerData = {
                            index,
                            fileName: file.name,
                            insurerName: brochure.insurerName,
                            productName: brochure.productName,
                            documentType: 'brochure',
                            sumInsured: 0,
                            premium: 0,
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
                                postHospitalizationDays: 60, ambulance: false, maternity: false, newbornCover: false,
                                ayush: false, opd: false, criticalIllness: false, organDonor: false,
                                mentalHealth: false, domiciliaryHospitalization: false, internationalCover: false,
                            },
                            networkHospitals: null,
                            claimSettlementRatio: null,
                            cumulativeBonus: false,
                            restorationBenefit: false,
                        };
                    } else {
                        const rawPolicy = await extractHealthPolicyData(text);
                        const policy = applyHealthFallbacks(rawPolicy, text);
                        insurerData = {
                            index,
                            fileName: file.name,
                            insurerName: policy.insurerName,
                            productName: policy.productName,
                            documentType: docType,
                            sumInsured: policy.sumInsured,
                            premium: policy.premium,
                            roomRentLimit: policy.roomRentLimit,
                            roomRentLimitType: policy.roomRentLimitType,
                            roomRentPercent: policy.roomRentPercent,
                            icuLimit: policy.icuLimit,
                            coPay: policy.coPay,
                            deductible: policy.deductible,
                            waitingPeriods: policy.waitingPeriods,
                            subLimits: policy.subLimits,
                            coverages: policy.coverages,
                            networkHospitals: policy.networkHospitals,
                            claimSettlementRatio: policy.claimSettlementRatio,
                            cumulativeBonus: policy.cumulativeBonus,
                            restorationBenefit: policy.restorationBenefit,
                        };
                    }

                    extracted.push(insurerData);
                    emit({ index, status: 'done', insurer: insurerData });

                } catch (err: any) {
                    console.error(`[health-compare-extract] Error on file ${index}:`, err);
                    emit({ index, status: 'error', fileName: file.name, message: err.message || 'Failed to process file' });
                }
            }

            // Fatal: not enough documents extracted for a meaningful comparison
            if (extracted.length < 2) {
                emit({
                    type: 'fatal',
                    message: extracted.length === 0
                        ? 'Could not extract data from any of the uploaded documents. Please check that files are clear, readable PDFs or images.'
                        : 'Only one document was successfully processed. Please upload at least 2 health insurance policies or certificates to compare.',
                });
                controller.close();
                return;
            }

            // Duplicate product detection
            const products = extracted.map(e => `${e.insurerName.toLowerCase()}-${e.productName.toLowerCase()}`);
            const hasDuplicates = new Set(products).size < products.length;
            if (hasDuplicates) {
                emit({ type: 'warning', message: 'Two or more documents appear to be the same health product. Results may be less meaningful.' });
            }

            emit({ type: 'complete', extracted });
            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
        },
    });
}
