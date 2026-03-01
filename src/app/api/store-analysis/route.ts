import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import {
  getClientIP,
  checkRateLimit,
  rateLimitedResponse,
  addSecurityHeaders,
  validateRequestOrigin,
  logSecurityEvent,
} from "@/lib/security";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateDocumentHash(text: string): string {
  const normalized = text.trim().toLowerCase().replace(/\s+/g, " ");
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

export async function POST(req: NextRequest) {
  // Bug #1 fix: add origin validation + rate limiting
  const clientIP = getClientIP(req);

  if (!validateRequestOrigin(req)) {
    logSecurityEvent("INVALID_ORIGIN_STORE_ANALYSIS", { ip: clientIP });
    return addSecurityHeaders(
      NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
    );
  }

  const rateLimit = await checkRateLimit(clientIP);
  if (!rateLimit.allowed) {
    logSecurityEvent("RATE_LIMIT_STORE_ANALYSIS", { ip: clientIP });
    return rateLimitedResponse(rateLimit.resetIn);
  }

  try {
    const body = await req.json();
    const { source, rawText, analysisResult, fileName, documentType, metadata } = body;

    if (!source || !rawText || !analysisResult) {
      return NextResponse.json(
        { error: "Missing required fields: source, rawText, analysisResult" },
        { status: 400 }
      );
    }

    if (!["analyze", "offers"].includes(source)) {
      return NextResponse.json(
        { error: "Invalid source. Must be 'analyze' or 'offers'" },
        { status: 400 }
      );
    }

    const documentHash = generateDocumentHash(rawText);

    const { data: existing } = await supabase
      .from("document_analyses")
      .select("id")
      .eq("document_hash", documentHash)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        message: "Document already exists in database",
        id: existing.id,
      });
    }

    const { data, error } = await supabase
      .from("document_analyses")
      .insert({
        document_hash: documentHash,
        source,
        document_type: documentType || analysisResult?.summary?.type || "unknown",
        file_name: fileName || "unnamed",
        // Bug #11 fix: raw_text is NOT stored — zero-retention policy.
        // The document text only exists in memory during analysis and is never persisted.
        analysis_result: analysisResult,
        metadata: metadata || {},
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to store analysis" },
        { status: 500 }
      );
    }

    return addSecurityHeaders(
      NextResponse.json({
        success: true,
        duplicate: false,
        message: "Analysis stored successfully",
        id: data.id,
      })
    );
  } catch (error: any) {
    console.error("Store analysis error:", error);
    return addSecurityHeaders(
      NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      )
    );
  }
}
