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
import type { ContractAnalysisResult, ContractClause, LegalCitation } from "@/lib/types/contract-analysis";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DISCLAIMER = "This analysis is for informational purposes only and does not constitute legal advice. Always consult with a qualified attorney before signing any legal document.";
const MAX_TEXT_LENGTH = 200000;
const MIN_TEXT_LENGTH = 100;

async function fetchRelevantLaws(supabase: any, categories: string[]): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("indian_laws")
      .select("id, law_name, key_provisions, contract_relevance, common_violations, penalties")
      .limit(10);

    if (error) {
      console.error("Error fetching laws:", error);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error("Failed to fetch laws:", e);
    return [];
  }
}

export async function POST(req: NextRequest) {
  const clientIP = getClientIP(req);

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

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const relevantLaws = await fetchRelevantLaws(supabase, []);
    const lawsContext = relevantLaws.map(law =>
      `- ${law.law_name}: ${law.contract_relevance}\n  Violations: ${law.common_violations}\n  Penalties: ${law.penalties}`
    ).join("\n\n");

    const prompt = `You are REXI - an expert contract attorney. Analyze this contract and explain findings in VERY SIMPLE language that a 10th grader can understand.

CONTRACT TEXT:
${sanitizedText}

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
      responseText = await unifiedGenerateContent({
        prompt,
        systemPrompt: "You are REXI - an expert Indian contract attorney. Return ONLY valid JSON.",
        temperature: 0.1,
        maxTokens: 16384,
      });
      responseText = responseText.trim();
    } catch (aiError: any) {
      console.error("AI generation failed:", aiError);
      return addSecurityHeaders(
        NextResponse.json(
          { error: aiError.message || "Failed to analyze contract. Please try again." },
          { status: 503 }
        )
      );
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
      console.error("JSON parse failed, attempting repair. Raw response:", responseText.substring(0, 500));

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
          console.error("JSON repair also failed:", repairError);
          parsedResponse = {
            summary: { parties: [], type: "Unknown", keyObligations: [], overallAssessment: "Analysis could not be completed due to response format error." },
            clauses: [],
            overallScore: 0,
            riskSummary: { critical: 0, high: 0, medium: 0, low: 0, safe: 0 },
            strengths: [],
            concerns: ["Analysis incomplete - please try again"],
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
          concerns: ["Analysis failed - please try again"],
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

    return addSecurityHeaders(NextResponse.json(finalResponse));
  } catch (error) {
    console.error("Contract analysis error:", error);
    return addSecurityHeaders(
      NextResponse.json(
        { error: "Failed to analyze contract. Please try again." },
        { status: 500 }
      )
    );
  }
}
