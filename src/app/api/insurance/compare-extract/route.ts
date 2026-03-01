import { NextRequest } from "next/server";
import { extractTextWithMistral } from "@/lib/mistral-ocr";
import { classifyDocument } from "@/lib/insurance/classifier";
import { extractPolicyData, extractBrochureData } from "@/lib/insurance/extractor";
import { getClientIP, checkRateLimit, validateRequestOrigin, logSecurityEvent } from "@/lib/security";
import type { ExtractedInsurer } from "@/lib/insurance/types";

export const maxDuration = 120;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_FILES = 4;
const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5 MB
const ALLOWED_MIME = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/heic",
    "image/heif",
    "image/webp",
];

function sseEvent(data: object): string {
    return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
    const clientIP = getClientIP(req);

    if (!validateRequestOrigin(req)) {
        logSecurityEvent("INVALID_ORIGIN_COMPARE_EXTRACT", { ip: clientIP });
        return new Response(JSON.stringify({ error: "Invalid request origin" }), { status: 403 });
    }

    const rateLimit = await checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
        logSecurityEvent("RATE_LIMIT_COMPARE_EXTRACT", { ip: clientIP });
        return new Response(JSON.stringify({ error: "Too many requests" }), { status: 429 });
    }

    let formData: FormData;
    try {
        formData = await req.formData();
    } catch {
        return new Response(JSON.stringify({ error: "Invalid form data" }), { status: 400 });
    }

    // Collect files (file0, file1, file2, file3)
    const files: { file: File; index: number }[] = [];
    for (let i = 0; i < MAX_FILES; i++) {
        const f = formData.get(`file${i}`) as File | null;
        if (f) files.push({ file: f, index: i });
    }

    if (files.length < 2) {
        return new Response(JSON.stringify({ error: "Please upload at least 2 insurance documents" }), { status: 400 });
    }

    // Validate each file
    for (const { file } of files) {
        if (file.size > MAX_FILE_SIZE) {
            return new Response(JSON.stringify({ error: `${file.name} exceeds 4.5 MB limit` }), { status: 400 });
        }
        const mime = file.type || "application/pdf";
        if (!ALLOWED_MIME.includes(mime.toLowerCase())) {
            return new Response(
                JSON.stringify({ error: `${file.name}: Unsupported file type. Use PDF or image files.` }),
                { status: 400 }
            );
        }
    }

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const emit = (data: object) => {
                controller.enqueue(encoder.encode(sseEvent(data)));
            };

            const extracted: ExtractedInsurer[] = [];

            for (const { file, index } of files) {
                try {
                    emit({ index, status: "extracting", fileName: file.name, stage: "Reading document…" });

                    const bytes = await file.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    const mimeType = file.type || "application/pdf";

                    const text = await extractTextWithMistral(buffer, mimeType);

                    if (!text || text.length < 50) {
                        emit({ index, status: "error", fileName: file.name, message: "Could not extract text from document" });
                        continue;
                    }

                    emit({ index, status: "extracting", fileName: file.name, stage: "Classifying document…" });
                    const docType = await classifyDocument(text);

                    emit({ index, status: "extracting", fileName: file.name, stage: "Reading coverages…" });

                    let insurerData: ExtractedInsurer;

                    if (docType === "brochure") {
                        const brochure = await extractBrochureData(text);
                        insurerData = {
                            index,
                            fileName: file.name,
                            insurerName: brochure.insurerName || "Unknown Insurer",
                            documentType: "brochure",
                            premium: 0,
                            idv: 0,
                            compulsoryDeductible: 0,
                            voluntaryDeductible: 0,
                            ncb: 0,
                            coverages: {
                                hasOwnDamage: brochure.featuresOffered?.some(f => /own damage|comprehensive/i.test(f)) ?? false,
                                hasThirdPartyLiability: brochure.featuresOffered?.some(f => /third.?party|liability/i.test(f)) ?? false,
                                hasZeroDepreciation: brochure.featuresOffered?.some(f => /zero.?dep|nil.?dep/i.test(f)) ?? false,
                                hasEngineProtection: brochure.featuresOffered?.some(f => /engine/i.test(f)) ?? false,
                                hasReturnToInvoice: brochure.featuresOffered?.some(f => /invoice|rti/i.test(f)) ?? false,
                                hasNCBProtection: brochure.featuresOffered?.some(f => /ncb/i.test(f)) ?? false,
                                hasRoadsideAssistance: brochure.featuresOffered?.some(f => /roadside|rsa/i.test(f)) ?? false,
                            },
                        };
                    } else {
                        const policy = await extractPolicyData(text);
                        insurerData = {
                            index,
                            fileName: file.name,
                            insurerName: policy.insurerName || "Unknown Insurer",
                            documentType: docType,
                            premium: policy.premium || 0,
                            idv: policy.idv || 0,
                            compulsoryDeductible: policy.compulsoryDeductible || 0,
                            voluntaryDeductible: policy.voluntaryDeductible || 0,
                            ncb: policy.ncb || 0,
                            coverages: policy.coverages,
                            vehicleInfo: policy.vehicleInfo,
                        };
                    }

                    extracted.push(insurerData);
                    emit({ index, status: "done", insurer: insurerData });

                } catch (err: any) {
                    console.error(`[compare-extract] Error on file ${index}:`, err);
                    emit({ index, status: "error", fileName: file.name, message: err.message || "Failed to process file" });
                }
            }

            // Fatal: not enough documents for comparison
            if (extracted.length < 2) {
                emit({
                    type: 'fatal',
                    message: extracted.length === 0
                        ? 'Could not extract data from any of the uploaded documents. Please check that files are readable PDFs or images.'
                        : 'Only one document was successfully processed. Please upload at least 2 insurance documents to compare.',
                });
                controller.close();
                return;
            }

            // Detect duplicate insurers
            const insurerNames = extracted.map(e => e.insurerName.toLowerCase().trim());
            const hasDuplicates = new Set(insurerNames).size < insurerNames.length;
            if (hasDuplicates) {
                emit({ type: "warning", message: "Two or more documents appear to be from the same insurer. Results may be less meaningful." });
            }

            emit({ type: "complete", extracted });
            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
        },
    });
}
