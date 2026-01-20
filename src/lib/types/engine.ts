export type DocumentType = 
  | "EMPLOYMENT_OFFER"
  | "RESIDENTIAL_LEASE"
  | "COMMERCIAL_LEASE"
  | "NDA"
  | "SERVICE_AGREEMENT"
  | "INSURANCE_POLICY"
  | "GENERAL_CONTRACT";

export interface ExtractionField {
  key: string;
  label: string;
  description: string;
  type: "string" | "number" | "date" | "boolean" | "list";
  required: boolean;
  validationRegex?: string;
}

export interface ExtractionSchema {
  docType: DocumentType;
  fields: ExtractionField[];
  logicRules: LogicRule[];
}

export interface LogicRule {
  id: string;
  fieldKeys: string[];
  condition: string; // e.g., "value > 5000"
  severity: "critical" | "high" | "medium" | "low";
  message: string;
}

export interface ExtractedValue {
  key: string;
  value: any;
  context: string; // surrounding text
  confidence: number;
  sourceText: string; // exact text snippet
}

export interface AnalysisStageResult {
  router?: {
    type: DocumentType;
    confidence: number;
  };
  extractor?: {
    values: ExtractedValue[];
    schema: ExtractionSchema;
  };
  deterministic?: {
    findings: Finding[];
  };
  voice?: {
    explanations: string[];
  };
}

export interface Finding {
  ruleId: string;
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  impact: string;
  suggestion: string;
}
