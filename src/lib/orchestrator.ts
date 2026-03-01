import { classifyDocument } from "./router";
import { extractFields } from "./extractor";
import { runDeterministicEngine } from "./engine";
import { synthesizeExplanations } from "./voice";
import { employmentOfferSchema } from "./configs/employment_offer";
import { ExtractionSchema, AnalysisStageResult } from "./types/engine";

const SCHEMAS: Record<string, ExtractionSchema> = {
  "EMPLOYMENT_OFFER": employmentOfferSchema,
};

export async function analyzeDocumentStageByStage(text: string): Promise<AnalysisStageResult> {
  const result: AnalysisStageResult = {};

  // Stage 1: Route
  const { type, confidence } = await classifyDocument(text);
  result.router = { type, confidence };

  // Get schema for this document type — only run deterministic engine if we have
  // a matching schema. Falling back to employmentOfferSchema for a lease or NDA
  // would produce completely wrong findings, so we skip instead.
  const schema: ExtractionSchema | undefined = SCHEMAS[type];

  if (schema) {
    // Stage 2: Extract
    const values = await extractFields(text, schema);
    result.extractor = { values, schema };

    // Stage 3: Deterministic Logic
    const findings = runDeterministicEngine(values, schema);
    result.deterministic = { findings };

    // Stage 4: Voice synthesis
    const explanations = await synthesizeExplanations(findings);
    result.voice = { explanations };
  } else {
    // No schema for this type — skip deterministic stages, AI-only analysis
    result.extractor = { values: [], schema: undefined as any };
    result.deterministic = { findings: [] };
    result.voice = { explanations: [] };
  }

  return result;
}
