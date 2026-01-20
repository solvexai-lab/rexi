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

  // Get schema for the type (default to employment offer for now if not found)
  const schema = SCHEMAS[type] || employmentOfferSchema;

  // Stage 2: Extract
  const values = await extractFields(text, schema);
  result.extractor = { values, schema };

  // Stage 3: Deterministic Logic
  const findings = runDeterministicEngine(values, schema);
  result.deterministic = { findings };

  // Stage 4: Voice synthesis
  const explanations = await synthesizeExplanations(findings);
  result.voice = { explanations };

  return result;
}
