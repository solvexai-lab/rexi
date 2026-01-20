import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse/lib/pdf-parse.js";
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

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);

  if (!validateRequestOrigin(request)) {
    logSecurityEvent("INVALID_ORIGIN_PDF", { ip: clientIP });
    return addSecurityHeaders(
      NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
    );
  }

  const rateLimit = checkRateLimit(clientIP);
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

    let data;
    try {
      data = await pdf(buffer);
    } catch (pdfError) {
      console.error("PDF parsing error:", pdfError);
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Failed to parse PDF. The file may be corrupted or password-protected." },
          { status: 422 }
        )
      );
    }

    let text = data.text || "";

    text = text.replace(/\s+/g, " ");
    text = text.replace(/\u00AD/g, "");
    text = text.replace(/\uFB01/g, "fi");
    text = text.replace(/\uFB02/g, "fl");
    text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
    text = text.trim();

    if (text.length < 50) {
      console.warn("Extracted text is very short. PDF might be scanned or image-based.");
    }

    return addSecurityHeaders(
      NextResponse.json({
        text,
        pages: data.numpages,
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
