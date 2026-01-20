import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateDocumentHash(text: string): string {
  const normalized = text.trim().toLowerCase().replace(/\s+/g, " ");
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

export async function POST(req: NextRequest) {
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
        raw_text: rawText,
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

    return NextResponse.json({
      success: true,
      duplicate: false,
      message: "Analysis stored successfully",
      id: data.id,
    });
  } catch (error: any) {
    console.error("Store analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
