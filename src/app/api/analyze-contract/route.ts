import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { unifiedGenerateContent } from "@/lib/nvidia-client";
import {
  getClientIP,
  checkRateLimit,
  rateLimitedResponse,
  sanitizeText,
  addSecurityHeaders,
  validateRequestOrigin,
  logSecurityEvent,
} from "@/lib/security";
import type { ContractAnalysisResult, ContractClause } from "@/lib/types/contract-analysis";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DISCLAIMER = "This analysis is for informational purposes only and does not constitute legal advice. Always consult with a qualified attorney before signing any legal document.";
const MAX_TEXT_LENGTH = 200000;
const MIN_TEXT_LENGTH = 100;
const PROMPT_TEXT_LIMIT = 120000;

async function fetchRelevantLaws(supabase: any, categories: string[]): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("indian_laws")
      .select("id, law_name, key_provisions, contract_relevance, common_violations, penalties")
      .limit(10);

    if (error) {
      console.error("[analyze-contract] Error fetching laws:", error);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error("[analyze-contract] Failed to fetch laws:", e);
    return [];
  }
}

function buildFallbackAnalysis(text: string, fileName: string, errorMessage?: string): ContractAnalysisResult {
  const lowerText = text.toLowerCase();
  const clauses: ContractClause[] = [];
  let id = 0;

  const checks = [
    { keyword: "termination", title: "Termination Clause", severity: "medium" as const, category: "termination" as const },
    { keyword: "liability", title: "Liability Clause", severity: "high" as const, category: "liability" as const },
    { keyword: "confidential", title: "Confidentiality", severity: "medium" as const, category: "confidentiality" as const },
    { keyword: "intellectual property", title: "IP Clause", severity: "high" as const, category: "ip" as const },
    { keyword: "indemnif", title: "Indemnification", severity: "high" as const, category: "liability" as const },
    { keyword: "non-compete", title: "Non-Compete", severity: "critical" as const, category: "general" as const },
    { keyword: "penalty", title: "Penalty Clause", severity: "high" as const, category: "payment" as const },
    { keyword: "auto-renew", title: "Auto-Renewal", severity: "medium" as const, category: "termination" as const },
    { keyword: "governing law", title: "Governing Law", severity: "low" as const, category: "general" as const },
    { keyword: "arbitration", title: "Arbitration", severity: "medium" as const, category: "general" as const },
    { keyword: "force majeure", title: "Force Majeure", severity: "low" as const, category: "general" as const },
    { keyword: "exclusiv", title: "Exclusivity", severity: "medium" as const, category: "scope" as const },
    { keyword: "warranty", title: "Warranty", severity: "medium" as const, category: "general" as const },
    { keyword: "limitation of liability", title: "Liability Cap", severity: "high" as const, category: "liability" as const },
  ];

  for (const check of checks) {
    const idx = lowerText.indexOf(check.keyword);
    if (idx !== -1) {
      const snippet = text.slice(Math.max(0, idx - 40), idx + check.keyword.length + 100);
      clauses.push({
        id: `clause-${++id}`,
        title: check.title,
        text: snippet,
        startIndex: idx,
        endIndex: idx + snippet.length,
        severity: check.severity,
        category: check.category,
        aiAnalysis: `This clause mentions "${check.title}". Please review it carefully as it may affect your rights or obligations.`,
        legalCitations: [],
        suggestion: "Consider having a lawyer review this clause.",
        negotiationTip: "Ask for clearer language or more balanced terms.",
      });
    }
  }

  const criticalCount = clauses.filter(c => c.severity === "critical").length;
  const highCount = clauses.filter(c => c.severity === "high").length;
  const mediumCount = clauses.filter(c => c.severity === "medium").length;
  const lowCount = clauses.filter(c => c.severity === "low").length;
  const safeCount = Math.max(2, Math.floor(clauses.length / 3));

  const score = Math.max(10, Math.min(90, 70 - criticalCount * 15 - highCount * 10 + safeCount * 5));

  return {
    id: `contract-${Date.now()}`,
    fileName: fileName || "Uploaded Document",
    rawText: text,
    summary: {
      parties: [],
      type: "Unknown Contract Type",
      keyObligations: [],
      overallAssessment: errorMessage 
        ? `AI analysis failed: ${errorMessage}. We performed a basic keyword scan instead.` 
        : "Our AI service experienced an issue, so we performed a basic keyword-based scan instead. For a full AI analysis, please try again in a few minutes.",
    },
    clauses,
    overallScore: score,
    riskSummary: { critical: criticalCount, high: highCount, medium: mediumCount, low: lowCount, safe: safeCount },
    strengths: ["Document was successfully parsed and scanned."],
    concerns: [
      errorMessage ? `AI Error: ${errorMessage}` : "AI service unavailable - basic scan only.",
      ...(criticalCount + highCount > 0 ? [`Found ${criticalCount + highCount} potentially risky clauses.`] : []),
    ],
    negotiationStrategy: ["Request a full AI analysis when the service is available.", "Consult a lawyer for critical contracts."],
    metadata: {
      analysisDate: new Date().toISOString(),
      disclaimer: DISCLAIMER,
      modelUsed: "fallback-deterministic",
    },
  };
}

export async function POST(req: NextRequest) {
  const clientIP = getClientIP(req);
  console.log(`[analyze-contract] Request started from IP: ${clientIP}`);

  if (!validateRequestOrigin(req)) {
    logSecurityEvent("INVALID_ORIGIN", { ip: clientIP, origin: req.headers.get("origin") });
    return addSecurityHeaders(
      NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
    );
  }

  const rateLimit = await checkRateLimit(clientIP);
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

    const { text, fileName } = body;

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
    console.log(`[analyze-contract] Text length: ${sanitizedText.length}, fileName: ${fileName || "unknown"}`);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log("[analyze-contract] Fetching relevant laws...");
    const relevantLaws = await fetchRelevantLaws(supabase, []);
    console.log(`[analyze-contract] Fetched ${relevantLaws.length} laws`);

    const lawsContext = relevantLaws.map(law =>
      `- ${law.law_name}: ${law.contract_relevance}\n  Violations: ${law.common_violations}\n  Penalties: ${law.penalties}`
    ).join("\n\n");

    const promptText = sanitizedText.slice(0, PROMPT_TEXT_LIMIT);
    const prompt = `You are REXI - an expert contract attorney. Analyze this contract and explain findings in VERY SIMPLE language that a 10th grader can understand.

CONTRACT TEXT:
${promptText}${sanitizedText.length > PROMPT_TEXT_LIMIT ? '\n\n[Document truncated for analysis]' : ''}

INDIAN LEGAL FRAMEWORK (for citations):
${lawsContext}

ANALYSIS INSTRUCTIONS:
1. Find ALL important clauses - both risky and good ones
2. For EACH clause, the "aiAnalysis" MUST include:
   - A simple 1-2 line explanation of what this means
   - A REAL-LIFE EXAMPLE starting with "For example:" showing exactly how this could affect the person

EXAMPLE of good aiAnalysis format:
"This says you can't work for any competitor for 2 years after leaving. For example: If you quit this job and try to join a similar company next month, they can take you to court and you might have to pay a penalty."

"The owner can end your stay with just 7 days notice for any reason. For example: Even if you've paid rent on time every month, they can ask you to leave in a week if they want to sell the flat or give it to a relative."

"You must pay Rs. 50,000 if you leave before 11 months. For example: If your job transfers you to another city after 6 months, you still have to pay this full amount even though it's not your fault."

4. Look for these problems:
   - Hidden fees or surprise charges
   - One-sided rules (they can do things, you cannot)
   - Penalties that seem too harsh
   - Automatic renewals without telling you
   - Giving up your legal rights
5. Also find good clauses that protect you
6. CRITICAL: You MUST analyze and return EVERY distinct clause in the document. Do not skip any clauses. Do not merge multiple clauses into one. Each separate clause gets its own object in the "clauses" array.

Return this EXACT JSON structure:
{
  "summary": {
    "parties": ["Party A Name", "Party B Name"],
    "type": "Contract Type (e.g., Rent Agreement, Job Offer, Insurance)",
    "effectiveDate": "Date if found",
    "duration": "How long this lasts",
    "totalValue": "Money involved if mentioned",
    "industry": "Type of business",
    "keyObligations": ["Main thing you must do 1", "Main thing you must do 2"],
    "overallAssessment": "2-3 simple sentences about whether this contract is fair or risky"
  },
  "clauses": [
    {
      "id": "clause-1",
      "title": "Short name for this clause",
      "text": "EXACT words from the contract - copy exactly as written",
      "startIndex": 0,
      "endIndex": 100,
      "severity": "critical|high|medium|low|safe",
      "category": "liability|ip|termination|payment|confidentiality|scope|general",
      "aiAnalysis": "Simple explanation + 'For example:' with a real-life scenario showing what could happen to you",
      "legalCitations": [
        {
          "lawId": "indian-contract-act-1872",
          "lawName": "Indian Contract Act, 1872",
          "section": "Section number",
          "relevance": "How this law applies",
          "implication": "violation|concern|protection|standard"
        }
      ],
      "suggestion": "What to ask them to change",
      "negotiationTip": "Exact words to say when asking for changes"
    }
  ],
  "overallScore": 65,
  "riskSummary": {
    "critical": 1,
    "high": 2,
    "medium": 3,
    "low": 2,
    "safe": 4
  },
  "strengths": ["Good thing about this contract 1", "Good thing 2"],
  "concerns": ["Problem with this contract 1", "Problem 2"],
  "negotiationStrategy": ["What to negotiate first", "What to negotiate second"]
}

CRITICAL REQUIREMENTS:
1. COPY EXACT TEXT: The "text" field must have the EXACT words from the contract
2. SIMPLE ENGLISH: Write like you're explaining to a friend, not a lawyer
3. ALWAYS include "For example:" in aiAnalysis with a specific real situation
4. ANALYZE EVERY CLAUSE: You must return one clause object for EACH distinct clause in the document. Do not skip clauses. Do not merge clauses.
5. GIVE SPECIFIC ADVICE on what to change
6. SCORE: 0-100 (100 = very safe, 0 = very risky)
7. RETURN ONLY VALID JSON. NO MARKDOWN.`;

    let responseText: string;
    try {
      console.log("[analyze-contract] Calling unifiedGenerateContent...");
      responseText = await unifiedGenerateContent({
        prompt,
        systemPrompt: "You are REXI - an expert Indian contract attorney. Return ONLY valid JSON.",
        temperature: 0.1,
        maxTokens: 16384,
      });
      responseText = responseText.trim();
      console.log(`[analyze-contract] AI response received, length: ${responseText.length}`);
    } catch (aiError: any) {
      const errMsg = aiError?.message || String(aiError);
      console.error("[analyze-contract] AI generation failed:", errMsg);
      // Return fallback analysis instead of hard 503
      const fallback = buildFallbackAnalysis(sanitizedText, fileName, errMsg);
      console.log("[analyze-contract] Returning fallback analysis with", fallback.clauses.length, "clauses");
      return addSecurityHeaders(NextResponse.json(fallback));
    }

    if (responseText.startsWith("```json")) {
      responseText = responseText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    }
    if (responseText.startsWith("```")) {
      responseText = responseText.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error("[analyze-contract] JSON parse failed. Raw preview:", responseText.substring(0, 500));

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        let repairedJson = jsonMatch[0];
        try {
          const openBraces = (repairedJson.match(/\{/g) || []).length;
          const closeBraces = (repairedJson.match(/\}/g) || []).length;
          const openBrackets = (repairedJson.match(/\[/g) || []).length;
          const closeBrackets = (repairedJson.match(/\]/g) || []).length;

          if ((repairedJson.match(/"/g) || []).length % 2 !== 0) {
            repairedJson = repairedJson.replace(/,\s*([}\]])/, '$1');
            repairedJson += '"';
          }

          repairedJson = repairedJson.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

          for (let i = 0; i < openBrackets - closeBrackets; i++) repairedJson += "]";
          for (let i = 0; i < openBraces - closeBraces; i++) repairedJson += "}";

          parsedResponse = JSON.parse(repairedJson);
        } catch (repairError) {
          console.error("[analyze-contract] JSON repair also failed:", repairError);
          parsedResponse = {
            summary: { parties: [], type: "Unknown", keyObligations: [], overallAssessment: "Analysis could not be completed due to response format error." },
            clauses: [],
            overallScore: 0,
            riskSummary: { critical: 0, high: 0, medium: 0, low: 0, safe: 0 },
            strengths: [],
            concerns: ["Analysis incomplete - AI response format error"],
            negotiationStrategy: [],
          };
        }
      } else {
        parsedResponse = {
          summary: { parties: [], type: "Unknown", keyObligations: [], overallAssessment: "Analysis could not parse contract." },
          clauses: [],
          overallScore: 0,
          riskSummary: { critical: 0, high: 0, medium: 0, low: 0, safe: 0 },
          strengths: [],
          concerns: ["Analysis failed - AI response unparseable"],
          negotiationStrategy: [],
        };
      }
    }

    const clauses: ContractClause[] = (parsedResponse.clauses || []).map((clause: any, index: number) => ({
      id: clause.id || `clause-${index}`,
      title: clause.title || "Untitled Clause",
      text: clause.text || "",
      startIndex: clause.startIndex || 0,
      endIndex: clause.endIndex || (clause.startIndex || 0) + (clause.text?.length || 0),
      severity: clause.severity || "medium",
      category: clause.category || "general",
      aiAnalysis: clause.aiAnalysis || "",
      legalCitations: (clause.legalCitations || []).map((citation: any) => ({
        lawId: citation.lawId || "unknown",
        lawName: citation.lawName || "Unknown Law",
        section: citation.section || "",
        relevance: citation.relevance || "",
        implication: citation.implication || "concern",
      })),
      suggestion: clause.suggestion || undefined,
      negotiationTip: clause.negotiationTip || undefined,
    }));

    const finalResponse: ContractAnalysisResult = {
      id: `contract-${Date.now()}`,
      fileName: fileName || "Uploaded Document",
      rawText: sanitizedText,
      summary: {
        parties: parsedResponse.summary?.parties || [],
        type: parsedResponse.summary?.type || "Unknown Contract Type",
        effectiveDate: parsedResponse.summary?.effectiveDate,
        duration: parsedResponse.summary?.duration,
        totalValue: parsedResponse.summary?.totalValue,
        industry: parsedResponse.summary?.industry,
        keyObligations: parsedResponse.summary?.keyObligations || [],
        overallAssessment: parsedResponse.summary?.overallAssessment || "Analysis complete.",
      },
      clauses,
      overallScore: parsedResponse.overallScore || 50,
      riskSummary: parsedResponse.riskSummary || {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        safe: 0,
      },
      strengths: parsedResponse.strengths || [],
      concerns: parsedResponse.concerns || [],
      negotiationStrategy: parsedResponse.negotiationStrategy || [],
      metadata: {
        analysisDate: new Date().toISOString(),
        disclaimer: DISCLAIMER,
        modelUsed: "gemini-2.5-flash",
      },
    };

    console.log("[analyze-contract] Success. Returning analysis with", clauses.length, "clauses.");
    return addSecurityHeaders(NextResponse.json(finalResponse));
  } catch (error: any) {
    console.error("[analyze-contract] UNCAUGHT error:", error?.message || error, error?.stack || '');
    return addSecurityHeaders(
      NextResponse.json(
        { error: "Failed to analyze contract. Please try again." },
        { status: 500 }
      )
    );
  }
}
