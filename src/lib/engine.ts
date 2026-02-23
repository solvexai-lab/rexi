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

/**
 * Safely evaluates a condition expression without using eval() or new Function()
 * Supports: <, >, <=, >=, ==, !=, &&, ||
 * Example: "value < 300000" or "value >= 100 && value <= 500"
 */
function evaluateCondition(value: any, condition: string): boolean {
  try {
    // Sanitize the condition string
    const sanitized = condition.trim();
    
    // Parse compound conditions (&&, ||)
    if (sanitized.includes('&&')) {
      const parts = sanitized.split('&&').map(p => p.trim());
      return parts.every(part => evaluateSingleCondition(value, part));
    }
    
    if (sanitized.includes('||')) {
      const parts = sanitized.split('||').map(p => p.trim());
      return parts.some(part => evaluateSingleCondition(value, part));
    }
    
    return evaluateSingleCondition(value, sanitized);
  } catch (e) {
    console.error("Condition evaluation failed:", e);
    return false;
  }
}

/**
 * Evaluates a single comparison expression
 * Only allows whitelisted operators for security
 */
function evaluateSingleCondition(value: any, expression: string): boolean {
  // Match pattern: "value <operator> <literal>"
  const comparisonRegex = /^value\s*(<=|>=|<|>|==|!=)\s*(.+)$/;
  const match = expression.match(comparisonRegex);
  
  if (!match) {
    console.warn(`Invalid condition format: ${expression}`);
    return false;
  }
  
  const operator = match[1];
  const rightSide = match[2].trim();
  
  // Parse the right-hand side value
  let comparisonValue: any;
  if (rightSide === 'true') {
    comparisonValue = true;
  } else if (rightSide === 'false') {
    comparisonValue = false;
  } else if (rightSide === 'null') {
    comparisonValue = null;
  } else if (/^["'].*["']$/.test(rightSide)) {
    // String literal
    comparisonValue = rightSide.slice(1, -1);
  } else if (!isNaN(Number(rightSide))) {
    // Numeric literal
    comparisonValue = Number(rightSide);
  } else {
    console.warn(`Unsupported literal value: ${rightSide}`);
    return false;
  }
  
  // Perform the comparison
  switch (operator) {
    case '<':
      return value < comparisonValue;
    case '>':
      return value > comparisonValue;
    case '<=':
      return value <= comparisonValue;
    case '>=':
      return value >= comparisonValue;
    case '==':
      return value == comparisonValue;
    case '!=':
      return value != comparisonValue;
    default:
      return false;
  }
}

