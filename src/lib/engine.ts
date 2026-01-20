import { ExtractionSchema, ExtractedValue, Finding } from "./types/engine";

export function runDeterministicEngine(
  values: ExtractedValue[],
  schema: ExtractionSchema
): Finding[] {
  const findings: Finding[] = [];

  for (const rule of schema.logicRules) {
    const relevantValues = values.filter(v => rule.fieldKeys.includes(v.key));
    
    for (const val of relevantValues) {
      if (evaluateCondition(val.value, rule.condition)) {
        findings.push({
          ruleId: rule.id,
          severity: rule.severity,
          message: rule.message,
          impact: "This may affect your legal or financial standing as per the document's terms.",
          suggestion: "Consider negotiating this term or seeking clarification on why this threshold was chosen."
        });
      }
    }
  }

  return findings;
}

function evaluateCondition(value: any, condition: string): boolean {
  try {
    // Simple evaluator for "value < 300000" etc.
    // In a real app, use a safer expression evaluator
    const func = new Function("value", `return ${condition}`);
    return !!func(value);
  } catch (e) {
    console.error("Condition evaluation failed:", e);
    return false;
  }
}
