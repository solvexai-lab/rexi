import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import {
  getClientIP,
  checkRateLimit,
  rateLimitedResponse,
  sanitizeText,
  addSecurityHeaders,
  validateRequestOrigin,
  logSecurityEvent,
} from "@/lib/security";
import type { AnalysisResponse } from "@/lib/types/analysis";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DISCLAIMER = "This is not legal advice - think of it as a helpful friend pointing out things you might want to look at. For important contracts, always have a real lawyer review them.";

const MAX_TEXT_LENGTH = 100000;
const MIN_TEXT_LENGTH = 50;

export async function POST(req: NextRequest) {
  const clientIP = getClientIP(req);

  if (!validateRequestOrigin(req)) {
    logSecurityEvent("INVALID_ORIGIN", { ip: clientIP, origin: req.headers.get("origin") });
    return addSecurityHeaders(
      NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
    );
  }

  const rateLimit = checkRateLimit(clientIP);
  if (!rateLimit.allowed) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { ip: clientIP });
    return rateLimitedResponse(rateLimit.resetIn);
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
      );
    }

    const { text } = body;

    if (!text || typeof text !== "string") {
      return addSecurityHeaders(
        NextResponse.json({ error: "No text provided or invalid format" }, { status: 400 })
      );
    }

    if (text.length < MIN_TEXT_LENGTH) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Text too short for meaningful analysis" }, { status: 400 })
      );
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Text exceeds maximum allowed length" }, { status: 400 })
      );
    }

    const sanitizedText = sanitizeText(text);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 })
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const supabase = await createClient();

    // New multi-stage engine integration
    const { analyzeDocumentStageByStage } = await import("@/lib/orchestrator");
    const stageResult = await analyzeDocumentStageByStage(sanitizedText);

    let vectorMatches: { name: string; description: string }[] = [];
    let indianLawMatches: { law_name: string; law_type: string; key_provisions: string; contract_relevance: string; common_violations: string }[] = [];

    try {
      const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
      const embeddingResult = await embedModel.embedContent(sanitizedText.slice(0, 10000));
      const embedding = embeddingResult.embedding.values;

      const [patternsResult, lawsResult] = await Promise.all([
        supabase.rpc("match_patterns", {
          query_embedding: embedding,
          match_threshold: 0.3,
          match_count: 50,
        }),
        supabase.rpc("match_indian_laws", {
          query_embedding: embedding,
          match_threshold: 0.3,
          match_count: 20,
        }),
      ]);

      if (!patternsResult.error && patternsResult.data) {
        vectorMatches = patternsResult.data;
      }

      if (!lawsResult.error && lawsResult.data) {
        indianLawMatches = lawsResult.data;
      }
    } catch (embedError) {
      console.error("Embedding/Vector search failed:", embedError);
    }

    const simplifiedPatterns = vectorMatches.map((m) => ({ n: m.name, d: m.description }));
    const simplifiedLaws = indianLawMatches.map((l) => ({
      l: l.law_name,
      t: l.law_type,
      p: l.key_provisions,
      r: l.contract_relevance,
      v: l.common_violations,
    }));

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.0,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
You are a friendly legal assistant. Analyze the contract for concerns and Indian law compliance.
Return ONLY a JSON object. Keep descriptions very concise to avoid truncation.

CONTEXT (Risk Patterns):
${JSON.stringify(simplifiedPatterns)}

APPLICABLE INDIAN LAWS:
${JSON.stringify(simplifiedLaws)}

RULES:
1. Return EXACT JSON structure provided.
2. Use simple everyday words.
3. CRITICAL: Check against Indian laws (Central, State, Municipal).
4. Limit to top 8 most critical clauses to ensure the response fits within token limits.

JSON STRUCTURE:
{
  "clauses": [
    {
      "clause_id": "id",
      "clause_text_excerpt": "text",
      "risk_signal": { "label": "name", "severity": "critical|high|medium|low", "confidence": 0.9 },
      "plain_english_interpretation": { "summary": "simple explanation", "why_it_matters": ["reason"] },
      "indian_law_compliance": {
        "applicable_laws": ["law"],
        "compliance_status": "compliant|potentially_non_compliant|non_compliant",
        "specific_concerns": ["details"]
      },
      "market_practice_insight": { "common_in": ["types"], "typical_variations": ["alternatives"] },
      "discussion_talking_points": { "points": ["question"] },
      "example_alternative_language": { "text": "fairer wording", "usage_note": "note" }
    }
  ],
  "legal_compliance_summary": {
    "overall_compliance": "status",
    "key_compliance_issues": [{ "law": "name", "issue": "problem", "risk_level": "severity" }],
    "mandatory_requirements_check": { "stamp_duty": "notes", "registration": "notes", "data_protection": "notes" }
  },
  "summary": {
    "type": "type",
    "overallSummary": "overview",
    "indian_law_alert": "warning"
  }
}

CONTRACT TEXT:
${sanitizedText.slice(0, 12000)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text().trim();

    if (responseText.startsWith("```json")) {
      responseText = responseText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      try {
        let repairedText = responseText;
        const openBraces = (repairedText.match(/\{/g) || []).length;
        const closeBraces = (repairedText.match(/\}/g) || []).length;
        const openBrackets = (repairedText.match(/\[/g) || []).length;
        const closeBrackets = (repairedText.match(/\]/g) || []).length;

        if ((repairedText.match(/"/g) || []).length % 2 !== 0) {
          repairedText += '"';
        }

        for (let i = 0; i < openBrackets - closeBrackets; i++) repairedText += "]";
        for (let i = 0; i < openBraces - closeBraces; i++) repairedText += "}";

        parsedResponse = JSON.parse(repairedText);
      } catch {
        throw new Error("Failed to parse AI response");
      }
    }

    const finalResponse: AnalysisResponse = {
      clauses: [
        ...(stageResult.deterministic?.findings || []).map((f, i) => ({
          clause_id: `det-${i}`,
          clause_text_excerpt: stageResult.extractor?.values.find(v => f.ruleId.includes(v.key))?.sourceText || "Relevant Section",
          risk_signal: {
            label: f.message,
            severity: f.severity,
            confidence: 1.0,
            jurisdiction_assumptions: ["Deterministic Rule"],
            context_dependence: "Low",
          },
          plain_english_interpretation: {
            summary: stageResult.voice?.explanations[i] || f.message,
            why_it_matters: [f.impact],
            interpretation_limits: "Validated by deterministic engine.",
          },
          why_rexi_flagged_this: {
            matched_patterns: [f.ruleId],
            pattern_source: "JSON Config",
            similarity_score: 1.0,
          },
          indian_law_compliance: {
            applicable_laws: [],
            compliance_status: "potentially_non_compliant",
            specific_concerns: [f.message],
            penalties_risk: "",
            jurisdiction_notes: "",
          },
          market_practice_insight: {
            common_in: [],
            less_common_in: [],
            typical_variations: [],
          },
          discussion_talking_points: {
            purpose: "Clarification",
            points: [f.suggestion],
          },
          example_alternative_language: {
            label: "Suggested Alternative",
            text: "Negotiate this term based on market standards.",
            usage_note: "Deterministic check.",
          },
          next_steps_guidance: {
            self_review: [],
            professional_review_suggested: true,
          },
        })),
        ...(parsedResponse.clauses || []).map((c: Record<string, unknown>, index: number) => ({
        clause_id: String(c.clause_id || `clause-${index}`),
        clause_text_excerpt: String(c.clause_text_excerpt || ""),
        risk_signal: {
          label: String((c.risk_signal as Record<string, unknown>)?.label || "Issue Detected"),
          severity: String((c.risk_signal as Record<string, unknown>)?.severity || "medium") as "critical" | "high" | "medium" | "low",
          confidence: Number((c.risk_signal as Record<string, unknown>)?.confidence || 0.8),
          jurisdiction_assumptions: ["Indian Law"],
          context_dependence: "Medium",
        },
        plain_english_interpretation: {
          summary: String((c.plain_english_interpretation as Record<string, unknown>)?.summary || "No summary provided."),
          why_it_matters: ((c.plain_english_interpretation as Record<string, unknown>)?.why_it_matters as string[]) || [],
          interpretation_limits: "Analysis depends on full contract context.",
        },
        why_rexi_flagged_this: {
          matched_patterns: [],
          pattern_source: "Market Standard",
          similarity_score: 0.9,
        },
        indian_law_compliance: {
          applicable_laws: ((c.indian_law_compliance as Record<string, unknown>)?.applicable_laws as string[]) || [],
          compliance_status: String((c.indian_law_compliance as Record<string, unknown>)?.compliance_status || "needs_review"),
          specific_concerns: ((c.indian_law_compliance as Record<string, unknown>)?.specific_concerns as string[]) || [],
          penalties_risk: "Review with legal counsel",
          jurisdiction_notes: "",
        },
        market_practice_insight: {
          common_in: ((c.market_practice_insight as Record<string, unknown>)?.common_in as string[]) || ["General Commercial"],
          less_common_in: [],
          typical_variations: ((c.market_practice_insight as Record<string, unknown>)?.typical_variations as string[]) || [],
        },
        discussion_talking_points: {
          purpose: "Discussion points for clarification",
          points: ((c.discussion_talking_points as Record<string, unknown>)?.points as string[]) || [],
        },
        example_alternative_language: {
          label: "Suggested Alternative",
          text: String((c.example_alternative_language as Record<string, unknown>)?.text || "No alternative provided."),
          usage_note: String((c.example_alternative_language as Record<string, unknown>)?.usage_note || "Consult legal counsel before use."),
        },
        next_steps_guidance: {
          self_review: ["Review surrounding clauses for context."],
          professional_review_suggested: true,
        },
        })),
        ],
        legal_compliance_summary: {
        overall_compliance: String(parsedResponse.legal_compliance_summary?.overall_compliance || "needs_review"),
        applicable_central_laws: [],
        applicable_state_laws: [],
        applicable_local_laws: [],
        key_compliance_issues: parsedResponse.legal_compliance_summary?.key_compliance_issues || [],
        mandatory_requirements_check: {
          stamp_duty: String(parsedResponse.legal_compliance_summary?.mandatory_requirements_check?.stamp_duty || "Review required"),
          registration: String(parsedResponse.legal_compliance_summary?.mandatory_requirements_check?.registration || "Review required"),
          statutory_benefits: "See compliance issues",
          data_protection: String(parsedResponse.legal_compliance_summary?.mandatory_requirements_check?.data_protection || "Review required"),
          consumer_protection: "Review required",
        },
      },
        summary: {
          parties: [],
          type: stageResult.router?.type || String(parsedResponse.summary?.type || "Unknown"),
          industry: "General",
        duration: "Not specified",
        value: "Not specified",
        jurisdiction: "India",
        overallSummary: String(parsedResponse.summary?.overallSummary || "Unable to generate summary."),
        keyTerms: [],
        mainObligations: [],
        indian_law_alert: String(parsedResponse.summary?.indian_law_alert || ""),
      },
      analysis_metadata: {
        analysis_date: new Date().toISOString(),
        disclaimer: DISCLAIMER,
          model_version: "rexi-v3-indian-law-optimized",
        laws_checked: indianLawMatches.length,
        patterns_checked: vectorMatches.length,
      },
    };

    return addSecurityHeaders(NextResponse.json(finalResponse));
  } catch (error) {
    console.error("Analysis error:", error);
    return addSecurityHeaders(
      NextResponse.json(
        { error: "Failed to analyze contract. Please try again." },
        { status: 500 }
      )
    );
  }
}
