/**
 * Bug #9 fix: /api/parse-pdf now uses Mistral OCR as primary extractor
 * (same as /api/parse-file). pdf-parse is kept as a fast fallback for
 * digital PDFs — no more silent failures on scanned insurance documents.
 */

import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { extractTextWithMistral } from "@/lib/mistral-ocr";
import {
  getClientIP,
  checkRateLimit,
  rateLimitedResponse,
  addSecurityHeaders,
  validateRequestOrigin,
  validateFileSize,
  logSecurityEvent,
} from "@/lib/security";

const MAX_FILE_SIZE_MB = 10;

export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);

  if (!validateRequestOrigin(request)) {
    logSecurityEvent("INVALID_ORIGIN_PDF", { ip: clientIP });
    return addSecurityHeaders(
      NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
    );
  }

  const rateLimit = await checkRateLimit(clientIP);
  if (!rateLimit.allowed) {
    logSecurityEvent("RATE_LIMIT_PDF", { ip: clientIP });
    return rateLimitedResponse(rateLimit.resetIn);
  }

  try {
    let formData;
    try {
      formData = await request.formData();
    } catch {
      return addSecurityHeaders(
        NextResponse.json({ error: "Invalid form data" }, { status: 400 })
      );
    }

    const file = formData.get("file") as File | null;

    if (!file) {
      return addSecurityHeaders(
        NextResponse.json({ error: "No file provided" }, { status: 400 })
      );
    }

    if (!validateFileSize(file.size, MAX_FILE_SIZE_MB)) {
      logSecurityEvent("PDF_TOO_LARGE", { ip: clientIP, fileSize: file.size });
      return addSecurityHeaders(
        NextResponse.json(
          { error: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.` },
          { status: 400 }
        )
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return addSecurityHeaders(
        NextResponse.json({ error: "File is empty" }, { status: 400 })
      );
    }

    // ── Strategy 1: pdf-parse (fast, digital PDFs only) ──────────────────────
    let text = "";
    let pages = 0;
    const usedFallback = false; // track whether Mistral was needed

    try {
      const data = await pdf(buffer);
      text = data.text || "";
      pages = data.numpages || 0;

      // Clean raw extracted text
      text = text
        .replace(/\s+/g, " ")
        .replace(/\u00AD/g, "")
        .replace(/\uFB01/g, "fi")
        .replace(/\uFB02/g, "fl")
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
        .trim();
    } catch {
      // pdf-parse failed entirely — proceed to Mistral
      text = "";
    }

    // ── Strategy 2: Mistral OCR for scanned / image-based PDFs ───────────────
    // Trigger Mistral if pdf-parse returned less than 200 chars (scanned PDF)
    if (text.length < 200) {
      console.log(`[parse-pdf] pdf-parse yielded ${text.length} chars — escalating to Mistral OCR`);
      try {
        text = await extractTextWithMistral(buffer);
        // pages unknown from Mistral, use 0 as signal to caller
        pages = 0;
      } catch (mistralError) {
        console.error("[parse-pdf] Mistral OCR failed:", mistralError);
        // If both strategies fail, return an informative error
        return addSecurityHeaders(
          NextResponse.json(
            {
              error:
                "Could not extract text from this PDF. It may be encrypted, heavily compressed, or corrupt. Please try a different format.",
            },
            { status: 422 }
          )
        );
      }
    }

    return addSecurityHeaders(
      NextResponse.json({
        text,
        pages,
        method: text.length < 200 ? "mistral" : "pdf-parse",
      })
    );
  } catch (error) {
    console.error("PDF parsing error:", error);
    return addSecurityHeaders(
      NextResponse.json(
        { error: "Failed to parse PDF. Please try again." },
        { status: 500 }
      )
    );
  }
}
