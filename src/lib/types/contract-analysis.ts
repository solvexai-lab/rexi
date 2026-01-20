export interface ContractClause {
  id: string;
  title: string;
  text: string;
  startIndex: number;
  endIndex: number;
  severity: "critical" | "high" | "medium" | "low" | "safe";
  category: string;
  aiAnalysis: string;
  legalCitations: LegalCitation[];
  suggestion?: string;
  negotiationTip?: string;
}

export interface LegalCitation {
  lawId: string;
  lawName: string;
  section?: string;
  relevance: string;
  implication: "violation" | "concern" | "protection" | "standard";
}

export interface ContractSummary {
  parties: string[];
  type: string;
  effectiveDate?: string;
  duration?: string;
  totalValue?: string;
  industry?: string;
  keyObligations: string[];
  overallAssessment: string;
}

export interface ContractAnalysisResult {
  id: string;
  fileName: string;
  rawText: string;
  summary: ContractSummary;
  clauses: ContractClause[];
  overallScore: number;
  riskSummary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    safe: number;
  };
  strengths: string[];
  concerns: string[];
  negotiationStrategy: string[];
  metadata: {
    analysisDate: string;
    disclaimer: string;
    modelUsed: string;
  };
}

export interface HighlightedSection {
  clauseId: string;
  startIndex: number;
  endIndex: number;
  severity: ContractClause["severity"];
}
