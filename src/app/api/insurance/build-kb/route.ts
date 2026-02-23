import { NextRequest, NextResponse } from "next/server";
import { extractTextWithMistral } from "@/lib/mistral-ocr";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export const maxDuration = 300; // 5 minutes for processing multiple PDFs

interface FieldPattern {
    field: string;
    variations: string[];
    sample_values: string[];
    insurers: string[];
}

interface AnalysisResult {
    insurer: string;
    fileName: string;
    confidence: number;
    patterns: Record<string, FieldPattern>;
}

/**
 * Detect field patterns from extracted text
 */
function detectFieldPatterns(text: string, insurer: string): Record<string, FieldPattern> {
    const patterns: Record<string, FieldPattern> = {};

    // IDV patterns
    const idvMatches = Array.from(text.matchAll(/(?:IDV|Insured Declared Value|Sum Insured|Vehicle Value)[\s:]+₹?\s*([\d,]+)/gi));
    if (idvMatches.length > 0) {
        patterns.idv = {
            field: "idv",
            variations: [...new Set(idvMatches.map(m => m[0].split(/[\s:]+/)[0]))],
            sample_values: idvMatches.map(m => m[1]).slice(0, 3),
            insurers: [insurer]
        };
    }

    // NCB patterns
    const ncbMatches = Array.from(text.matchAll(/(?:NCB|No Claim Bonus|Claim Free Discount)[\s:]+(\d+)%/gi));
    if (ncbMatches.length > 0) {
        patterns.ncb = {
            field: "ncb",
            variations: [...new Set(ncbMatches.map(m => m[0].split(/[\s:]+/)[0]))],
            sample_values: ncbMatches.map(m => m[1] + "%").slice(0, 3),
            insurers: [insurer]
        };
    }

    // Policy Number patterns
    const policyMatches = Array.from(text.matchAll(/(?:Policy No|Policy Number|Certificate No)[\s:]+([A-Z0-9\/\-]+)/gi));
    if (policyMatches.length > 0) {
        patterns.policy_number = {
            field: "policy_number",
            variations: [...new Set(policyMatches.map(m => m[0].split(/[\s:]+/)[0]))],
            sample_values: policyMatches.map(m => m[1]).slice(0, 3),
            insurers: [insurer]
        };
    }

    // Premium patterns
    const premiumMatches = Array.from(text.matchAll(/(?:Net Premium|Total Premium|Gross Premium|Basic Premium)[\s:]+₹?\s*([\d,]+)/gi));
    if (premiumMatches.length > 0) {
        patterns.premium = {
            field: "premium",
            variations: [...new Set(premiumMatches.map(m => m[0].split(/[\s:]+/)[0]))],
            sample_values: premiumMatches.map(m => m[1]).slice(0, 3),
            insurers: [insurer]
        };
    }

    // Add-on patterns
    const addonMatches = Array.from(text.matchAll(/(?:Zero Dep|Engine Protection|Roadside Assistance|Consumables|Return to Invoice)/gi));
    if (addonMatches.length > 0) {
        patterns.add_ons = {
            field: "add_ons",
            variations: [...new Set(addonMatches.map(m => m[0]))],
            sample_values: addonMatches.map(m => m[0]).slice(0, 5),
            insurers: [insurer]
        };
    }

    return patterns;
}

/**
 * Calculate extraction confidence
 */
function calculateConfidence(text: string): number {
    let score = 0;
    if (text.match(/IDV|Insured Declared Value/i)) score += 20;
    if (text.match(/NCB|No Claim Bonus/i)) score += 15;
    if (text.match(/Policy No|Policy Number/i)) score += 15;
    if (text.match(/Premium/i)) score += 15;
    if (text.match(/Own Damage|Third Party/i)) score += 15;
    if (text.match(/Make|Model|Registration/i)) score += 10;
    if (text.match(/Zero Dep|Add[\s-]?on/i)) score += 10;
    return Math.min(score, 100);
}

import { Mistral } from "@mistralai/mistralai";

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! });

/**
 * structure discovery using Mistral Large
 */
async function discoverStructure(text: string, fileName: string) {
    try {
        const response = await client.chat.complete({
            model: "mistral-large-latest",
            messages: [
                {
                    role: "user",
                    content: `Analyze this motor vehicle insurance document (File: ${fileName}). 
          
          
          Identify what kind of document this is (Policy Schedule, Brochure, Quote, Terms & Conditions, etc.).
          Extract the "Insurer Name" (e.g., HDFC Ergo, ICICI Lombard, Digit Insurance).
          Then, list ALL data fields, tables, and sections VALIDLY PRESENT in the text. Be comprehensive.
          Do not hallucinate fields. Only list what you see in the text.
          
          Return JSON format:
          {
            "document_type": "string",
            "insurer_name": "string",
            "key_sections": ["string"],
            "available_fields": ["string"],
            "summary": "string"
          }
          
          TEXT PREVIEW (First 8000 chars):
          ${text.substring(0, 8000)}`
                }
            ],
            responseFormat: { type: "json_object" }
        });

        const content = response.choices?.[0]?.message?.content;
        let jsonString = "";

        if (typeof content === 'string') {
            jsonString = content;
        } else if (Array.isArray(content) && content.length > 0) {
            const chunk = content[0] as any;
            if (chunk.type === 'text') {
                jsonString = chunk.text;
            }
        }

        return jsonString ? JSON.parse(jsonString) : null;
    } catch (error) {
        console.error("Discovery error:", error);
        return { document_type: "unknown", insurer_name: "Unknown", key_sections: [], available_fields: [], summary: "Analysis failed" };
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }

        console.log(`\n🚀 Analyzing ${files.length} PDFs...`);

        const results: AnalysisResult[] = [];

        // Create directories if they don't exist
        const baseDir = path.join(process.cwd(), "knowledge-base", "motor-vehicle-insurance");
        fs.mkdirSync(path.join(baseDir, "raw"), { recursive: true });
        fs.mkdirSync(path.join(baseDir, "processed"), { recursive: true });

        // Process each PDF
        for (const file of files) {
            try {
                let insurer = file.name.split('-')[0].toLowerCase(); // Default to filename prefix
                console.log(`\n📄 Processing: ${file.name} (${insurer})`);

                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                // Extract with Mistral OCR
                const extractedText = await extractTextWithMistral(buffer);

                // Save RAW text for later analysis (as requested)
                fs.writeFileSync(
                    path.join(baseDir, "raw", `${file.name}.md`),
                    extractedText
                );

                // Perform AI Structure Discovery
                const discovery = await discoverStructure(extractedText, file.name);

                // Use extracted insurer name if available
                if (discovery.insurer_name && discovery.insurer_name !== "Unknown") {
                    insurer = discovery.insurer_name;
                }

                // Save PROCESSED discovery result
                fs.writeFileSync(
                    path.join(baseDir, "processed", `${file.name}.json`),
                    JSON.stringify(discovery, null, 2)
                );

                // Format as patterns for compatibility with frontend
                const patterns: Record<string, any> = {
                    document_type: {
                        field: "document_type",
                        variations: [discovery.document_type],
                        sample_values: [],
                        insurers: [insurer]
                    },
                    discovered_fields: {
                        field: "available_fields",
                        variations: discovery.available_fields || [],
                        sample_values: discovery.available_fields || [],
                        insurers: [insurer]
                    },
                    sections: {
                        field: "key_sections",
                        variations: discovery.key_sections || [],
                        sample_values: discovery.key_sections || [],
                        insurers: [insurer]
                    },
                    summary: {
                        field: "document_summary",
                        variations: [discovery.summary || ""],
                        sample_values: [discovery.summary || ""],
                        insurers: [insurer]
                    }
                };

                const confidence = discovery.document_type !== "unknown" ? 90 : 0;

                results.push({
                    insurer,
                    fileName: file.name,
                    confidence,
                    patterns
                });

                console.log(`✅ ${insurer} [${discovery.document_type}]: Found ${discovery.available_fields.length} fields`);

            } catch (error: any) {
                console.error(`❌ Error processing ${file.name}:`, error.message);
                results.push({
                    insurer: "error",
                    fileName: file.name,
                    confidence: 0,
                    patterns: {}
                });
            }
        }

        // Aggregate patterns across all insurers
        const aggregated: Record<string, FieldPattern> = {};

        for (const result of results) {
            for (const [field, pattern] of Object.entries(result.patterns)) {
                if (!aggregated[field]) {
                    aggregated[field] = {
                        field,
                        variations: [],
                        sample_values: [],
                        insurers: []
                    };
                }

                // Merge variations
                aggregated[field].variations = [
                    ...new Set([...aggregated[field].variations, ...pattern.variations])
                ];

                // Merge sample values
                aggregated[field].sample_values = [
                    ...new Set([...aggregated[field].sample_values, ...pattern.sample_values])
                ].slice(0, 10); // Keep top 10

                // Add insurer if not already present
                if (!aggregated[field].insurers.includes(result.insurer)) {
                    aggregated[field].insurers.push(result.insurer);
                }
            }
        }

        // Save knowledge base
        const knowledgeBase = {
            version: "1.0",
            generated_date: new Date().toISOString(),
            insurers_analyzed: [...new Set(results.map(r => r.insurer))],
            pdfs_processed: results.length,
            field_patterns: aggregated,
            confidence_scores: Object.fromEntries(
                results.map(r => [r.insurer, r.confidence])
            )
        };

        // Save to file system
        const outputPath = "knowledge-base/motor-vehicle-insurance/patterns/field-mappings.json";
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFileSync(outputPath, JSON.stringify(knowledgeBase, null, 2));

        return NextResponse.json({
            message: "Knowledge base built successfully",
            summary: {
                total_pdfs: results.length,
                insurers: [...new Set(results.map(r => r.insurer))],
                field_patterns: Object.keys(aggregated).length,
                avg_confidence: Math.round(results.reduce((acc, r) => acc + r.confidence, 0) / results.length)
            },
            results
        });
    } catch (error: any) {
        console.error("Error building KB:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

