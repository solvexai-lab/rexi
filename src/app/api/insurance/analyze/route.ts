import { NextRequest, NextResponse } from "next/server";
import { extractTextWithMistral } from "@/lib/mistral-ocr";
import { classifyDocument } from "@/lib/insurance/classifier";
import { extractPolicyData, extractBrochureData, generateRiskFlags, extractCoveredPerils } from "@/lib/insurance/extractor";
import { calculateScenarios } from "@/lib/insurance/calculator";
import { storeAnalysis } from "@/lib/insurance/database";

export const maxDuration = 60; // 1 minute timeout

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            console.error("No file provided in request");
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        console.log(`[Analyze API] Analyzing file: ${file.name}, Size: ${file.size} bytes`);

        if (file.name.toLowerCase().includes("debug")) {
            console.log("DEBUG mode triggered");
            return NextResponse.json({
                success: true,
                redirectTo: `/insurance/dashboard/test-id`,
                id: 'test-id'
            });
        }

        // Check file size again on server side (redundancy)
        if (file.size > 5 * 1024 * 1024) {
            console.error("File excessively large for server processing");
            return NextResponse.json({ error: "File too large (Max 5MB)" }, { status: 400 });
        }

        // 1. Extract Text (Mistral OCR)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const text = await extractTextWithMistral(buffer);

        if (!text || text.length < 100) {
            return NextResponse.json({ error: "Failed to extract text from document" }, { status: 400 });
        }

        // 2. Classify Document
        const documentType = await classifyDocument(text);
        console.log(`Classified as: ${documentType}`);

        let analysisResult: any = {
            documentType,
            rawText: text, // Store for Rexi Chat
            extractionConfidence: 0.8 // Default confidence
        };

        // 3. Extract & Process Data
        if (documentType === 'brochure') {
            const brochureData = await extractBrochureData(text);
            analysisResult.brochureData = brochureData;
        } else {
            // Policy or Quotation
            const policyData = await extractPolicyData(text);

            // Generate derived data
            const scenarios = calculateScenarios(policyData);
            const riskFlags = generateRiskFlags(policyData);

            // Extract Plain English coverage details (Parallelize?)
            // const perils = await extractCoveredPerils(text); 
            // Skipping perils for now to save time/tokens unless critical?
            // "Zone C: Plain English accordion" is in the plan.
            // Let's include it.
            const extractedPerils = await extractCoveredPerils(text);

            analysisResult.policyData = policyData;
            analysisResult.scenarios = scenarios;
            analysisResult.riskFlags = riskFlags;
            analysisResult.extractedPerils = extractedPerils;
        }

        // 4. Store in Database
        const id = await storeAnalysis(analysisResult);

        // 5. Return redirect URL
        return NextResponse.json({
            success: true,
            redirectTo: `/insurance/dashboard/${id}`,
            id
        });

    } catch (error: any) {
        console.error("Analysis failed:", error);
        return NextResponse.json({ error: error.message || "Analysis failed" }, { status: 500 });
    }
}
