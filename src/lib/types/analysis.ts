export interface RiskSignal {
  label: string;
  severity: "critical" | "high" | "medium" | "low";
  confidence: number;
  jurisdiction_assumptions: string[];
  context_dependence: "High" | "Medium" | "Low";
}

export interface PlainEnglishInterpretation {
  summary: string;
  why_it_matters: string[];
  interpretation_limits: string;
}

export interface PatternMatch {
  pattern_name: string;
  pattern_source: string;
  similarity_score: number;
}

export interface WhyRexiFlagged {
  matched_patterns: string[];
  pattern_source: string;
  similarity_score: number;
}

export interface MarketPracticeInsight {
  common_in: string[];
  less_common_in: string[];
  typical_variations: string[];
}

export interface DiscussionTalkingPoints {
  purpose: string;
  points: string[];
}

export interface ExampleAlternativeLanguage {
  label: string;
  text: string;
  usage_note: string;
}

export interface NextStepsGuidance {
  self_review: string[];
  professional_review_suggested: boolean;
}

export interface IndianLawCompliance {
  applicable_laws: string[];
  compliance_status: "compliant" | "potentially_non_compliant" | "non_compliant" | "needs_review";
  specific_concerns: string[];
  penalties_risk?: string;
  jurisdiction_notes?: string;
}

export interface LiabilitySafeClauseAnalysis {
  clause_id: string;
  clause_text_excerpt: string;
  risk_signal: RiskSignal;
  plain_english_interpretation: PlainEnglishInterpretation;
  why_rexi_flagged_this: WhyRexiFlagged;
  indian_law_compliance: IndianLawCompliance;
  market_practice_insight: MarketPracticeInsight;
  discussion_talking_points: DiscussionTalkingPoints;
  example_alternative_language: ExampleAlternativeLanguage;
  next_steps_guidance: NextStepsGuidance;
}

export interface LegalComplianceSummary {
  overall_compliance: string;
  applicable_central_laws: string[];
  applicable_state_laws: string[];
  applicable_local_laws: string[];
  key_compliance_issues: Array<{
    law: string;
    issue: string;
    risk_level: string;
  }>;
  mandatory_requirements_check: {
    stamp_duty: string;
    registration: string;
    data_protection: string;
    [key: string]: string;
  };
}

export interface ContractSummary {
  parties: string[];
  type: string;
  industry: string;
  duration: string;
  value: string;
  jurisdiction: string;
  overallSummary: string;
  keyTerms: string[];
  mainObligations: string[];
  indian_law_alert?: string;
}

export interface AnalysisResponse {
  clauses: LiabilitySafeClauseAnalysis[];
  summary: ContractSummary;
  legal_compliance_summary?: LegalComplianceSummary;
  analysis_metadata: {
    analysis_date: string;
    disclaimer: string;
    model_version: string;
    laws_checked?: number;
    patterns_checked?: number;
  };
}

export interface LegacyContractPattern {
  id: string;
  name: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low";
  patterns: RegExp[];
  description: string;
  whyItMatters: string;
  plainEnglish: string;
  howItShouldBe: string;
  negotiationScript: string;
  suggestedAlternative: string;
  industry?: string;
}
