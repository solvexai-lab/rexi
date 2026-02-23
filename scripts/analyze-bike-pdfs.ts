import { extractTextWithMistral } from "@/lib/mistral-ocr";
import fs from "fs";
import path from "path";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

interface FieldPattern {
    field: string;
    variations: Set<string>;
    sample_values: string[];
    insurers: string[];
}

interface AnalysisResult {
    insurer: string;
    fileName: string;
    extractedText: string;
    patterns: Map<string, FieldPattern>;
    tables: any[];
    confidence: number;
}

/**
 * Analyze a single PDF and extract patterns
 */
async function analyzePDF(pdfPath: string, insurerName: string): Promise<AnalysisResult> {
    console.log(`\n📄 Analyzing: ${insurerName}...`);

    const buffer = fs.readFileSync(pdfPath);
    const fileName = path.basename(pdfPath);

    // Stage 1: Extract with Mistral OCR
    const extractedText = await extractTextWithMistral(buffer);

    // Save extracted text
    const outputDir = "knowledge-base/motor-vehicle-insurance/extracted";
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(path.join(outputDir, `${insurerName}.md`), extractedText);

    // Stage 2: Pattern detection
    const patterns = detectFieldPatterns(extractedText, insurerName);
    const tables = detectTableStructures(extractedText);
    const confidence = calculateExtractionConfidence(extractedText);

    return {
        insurer: insurerName,
        fileName,
        extractedText,
        patterns,
        tables,
        confidence
    };
}

/**
 * Detect field naming patterns
 */
function detectFieldPatterns(text: string, insurer: string): Map<string, FieldPattern> {
    const patterns = new Map<string, FieldPattern>();

    // IDV patterns
    const idvMatches = text.matchAll(/(?:IDV|Insured Declared Value|Sum Insured|Vehicle Value)[:\s]+₹?\s*([\d,]+)/gi);
    const idvVariations = new Set<string>();
    const idvValues: string[] = [];
    for (const match of idvMatches) {
        const label = match[0].split(/[:\s]+/)[0];
        idvVariations.add(label);
        idvValues.push(match[1]);
    }
    if (idvVariations.size > 0) {
        patterns.set("idv", {
            field: "idv",
            variations: idvVariations,
            sample_values: idvValues,
            insurers: [insurer]
        });
    }

    // NCB patterns
    const ncbMatches = text.matchAll(/(?:NCB|No Claim Bonus|Claim Free Discount|NCB %)[:\s]+(\d+)%/gi);
    const ncbVariations = new Set<string>();
    const ncbValues: string[] = [];
    for (const match of ncbMatches) {
        const label = match[0].split(/[:\s]+/)[0];
        ncbVariations.add(label);
        ncbValues.push(match[1] + "%");
    }
    if (ncbVariations.size > 0) {
        patterns.set("ncb", {
            field: "ncb",
            variations: ncbVariations,
            sample_values: ncbValues,
            insurers: [insurer]
        });
    }

    // Policy Number patterns
    const policyMatches = text.matchAll(/(?:Policy No|Policy Number|Certificate No)[:\s]+([A-Z0-9\/\-]+)/gi);
    const policyVariations = new Set<string>();
    const policyValues: string[] = [];
    for (const match of policyMatches) {
        const label = match[0].split(/[:\s]+/)[0];
        policyVariations.add(label);
        policyValues.push(match[1]);
    }
    if (policyVariations.size > 0) {
        patterns.set("policy_number", {
            field: "policy_number",
            variations: policyVariations,
            sample_values: policyValues,
            insurers: [insurer]
        });
    }

    // Premium patterns
    const premiumMatches = text.matchAll(/(?:Net Premium|Total Premium|Gross Premium)[:\s]+₹?\s*([\d,]+)/gi);
    const premiumVariations = new Set<string>();
    const premiumValues: string[] = [];
    for (const match of premiumMatches) {
        const label = match[0].split(/[:\s]+/)[0];
        premiumVariations.add(label);
        premiumValues.push(match[1]);
    }
    if (premiumVariations.size > 0) {
        patterns.set("premium", {
            field: "premium",
            variations: premiumVariations,
            sample_values: premiumValues,
            insurers: [insurer]
        });
    }

    return patterns;
}

/**
 * Detect table structures
 */
function detectTableStructures(text: string): any[] {
    // Look for markdown tables or structured data
    const tables: any[] = [];

    // Pattern: | Header1 | Header2 | Header3 |
    const tableMatches = text.matchAll(/\|(.+)\|[\r\n]+\|[-\s|]+\|[\r\n]+((?:\|.+\|[\r\n]+)+)/g);

    for (const match of tableMatches) {
        const headers = match[1].split('|').map(h => h.trim()).filter(h => h);
        const rows = match[2].split('\n')
            .filter(r => r.includes('|'))
            .map(r => r.split('|').map(c => c.trim()).filter(c => c));

        tables.push({
            headers,
            rows,
            rowCount: rows.length
        });
    }

    return tables;
}

/**
 * Calculate extraction confidence
 */
function calculateExtractionConfidence(text: string): number {
    let score = 0;

    // Check for key fields
    if (text.match(/IDV|Insured Declared Value/i)) score += 20;
    if (text.match(/NCB|No Claim Bonus/i)) score += 15;
    if (text.match(/Policy No|Policy Number/i)) score += 15;
    if (text.match(/Premium/i)) score += 15;
    if (text.match(/Own Damage|Third Party/i)) score += 15;
    if (text.match(/Make|Model|Registration/i)) score += 10;
    if (text.match(/Add[\s-]?on|Zero Dep/i)) score += 10;

    return Math.min(score, 100);
}

/**
 * Aggregate patterns from all insurers
 */
function aggregatePatterns(results: AnalysisResult[]): any {
    const aggregated: any = {
        version: "1.0",
        generated_date: new Date().toISOString(),
        insurers_analyzed: results.map(r => r.insurer),
        field_patterns: {},
        table_structures: {},
        confidence_scores: {}
    };

    // Merge field patterns
    const allPatterns = new Map<string, FieldPattern>();

    for (const result of results) {
        aggregated.confidence_scores[result.insurer] = result.confidence;

        for (const [field, pattern] of result.patterns) {
            if (!allPatterns.has(field)) {
                allPatterns.set(field, {
                    field,
                    variations: new Set<string>(),
                    sample_values: [],
                    insurers: []
                });
            }

            const existing = allPatterns.get(field)!;
            pattern.variations.forEach(v => existing.variations.add(v));
            existing.sample_values.push(...pattern.sample_values);
            if (!existing.insurers.includes(result.insurer)) {
                existing.insurers.push(result.insurer);
            }
        }
    }

    // Convert to JSON-serializable format
    for (const [field, pattern] of allPatterns) {
        aggregated.field_patterns[field] = {
            variations: Array.from(pattern.variations),
            sample_values: pattern.sample_values.slice(0, 5), // Keep first 5 samples
            insurers: pattern.insurers
        };
    }

    return aggregated;
}

/**
 * Main execution
 */
async function buildKnowledgeBase() {
    console.log("🚀 Building Two-Wheeler Insurance Knowledge Base...\n");

    const samplesDir = "knowledge-base/motor-vehicle-insurance/samples/two-wheeler";

    if (!fs.existsSync(samplesDir)) {
        console.error(`❌ Samples directory not found: ${samplesDir}`);
        console.log("\n📁 Please add PDF samples to:");
        console.log("   knowledge-base/motor-vehicle-insurance/samples/two-wheeler/icici-lombard/sample.pdf");
        console.log("   knowledge-base/motor-vehicle-insurance/samples/two-wheeler/bajaj-allianz/sample.pdf");
        console.log("   knowledge-base/motor-vehicle-insurance/samples/two-wheeler/hdfc-ergo/sample.pdf");
        console.log("   etc.");
        return;
    }

    const results: AnalysisResult[] = [];

    // Find all PDFs in subdirectories
    const insurerDirs = fs.readdirSync(samplesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const insurerDir of insurerDirs) {
        const pdfFiles = fs.readdirSync(path.join(samplesDir, insurerDir))
            .filter(f => f.endsWith('.pdf'));

        for (const pdfFile of pdfFiles) {
            const pdfPath = path.join(samplesDir, insurerDir, pdfFile);
            try {
                const result = await analyzePDF(pdfPath, insurerDir);
                results.push(result);
                console.log(`✅ ${insurerDir}: ${result.confidence}% confidence`);
            } catch (error: any) {
                console.error(`❌ ${insurerDir}: ${error.message}`);
            }
        }
    }

    if (results.length === 0) {
        console.log("\n⚠️  No PDFs analyzed. Add sample PDFs to get started.");
        return;
    }

    // Aggregate patterns
    const knowledgeBase = aggregatePatterns(results);

    // Save knowledge base
    const outputPath = "knowledge-base/motor-vehicle-insurance/patterns/field-mappings.json";
    fs.writeFileSync(outputPath, JSON.stringify(knowledgeBase, null, 2));

    console.log(`\n✅ Knowledge base saved to: ${outputPath}`);
    console.log(`\n📊 Summary:`);
    console.log(`   - PDFs analyzed: ${results.length}`);
    console.log(`   - Insurers: ${knowledgeBase.insurers_analyzed.join(", ")}`);
    console.log(`   - Field patterns: ${Object.keys(knowledgeBase.field_patterns).length}`);
}

// Run if executed directly
console.log("Script loaded, starting analysis...");
buildKnowledgeBase().catch(console.error);

export { buildKnowledgeBase, analyzePDF };
