import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import { extractTextWithMistral } from "@/lib/mistral-ocr";
import {
  getClientIP,
  checkRateLimit,
  rateLimitedResponse,
  addSecurityHeaders,
  validateRequestOrigin,
  validateFileType,
  validateFileSize,
  sanitizeFileName,
  logSecurityEvent,
} from "@/lib/security";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const MAX_FILE_SIZE_MB = 10;

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request);

  if (!validateRequestOrigin(request)) {
    logSecurityEvent("INVALID_ORIGIN_FILE_UPLOAD", { ip: clientIP });
    return addSecurityHeaders(
      NextResponse.json({ error: "Invalid request origin" }, { status: 403 })
    );
  }

  /* 
   * WARNING: The previous implementation failed to await this asynchronous call.
   * checkRateLimit returns a Promise<RateLimitResult>, but it was being treated as a synchronous value.
   * This caused the 'allowed' property to be undefined on the Promise object,
   * leading to an incorrect truthy/falsy evaluation or runtime error in strict mode.
   *
   * FIX: Added 'await' to properly resolve the Promise and get the actual RateLimitResult.
   */
  const rateLimit = await checkRateLimit(clientIP);
  if (!rateLimit.allowed) {
    logSecurityEvent("RATE_LIMIT_FILE_UPLOAD", { ip: clientIP });
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

    const sanitizedName = sanitizeFileName(file.name);

    if (!validateFileType(sanitizedName, ALLOWED_EXTENSIONS)) {
      logSecurityEvent("INVALID_FILE_TYPE", { ip: clientIP, fileName: sanitizedName });
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Unsupported file format. Please use PDF, DOCX, or TXT." },
          { status: 400 }
        )
      );
    }

    if (!validateFileSize(file.size, MAX_FILE_SIZE_MB)) {
      logSecurityEvent("FILE_TOO_LARGE", { ip: clientIP, fileSize: file.size });
      return addSecurityHeaders(
        NextResponse.json(
          { error: `File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.` },
          { status: 400 }
        )
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      const ext = sanitizedName.toLowerCase().split(".").pop();
      if (!ALLOWED_EXTENSIONS.includes(ext || "")) {
        logSecurityEvent("INVALID_MIME_TYPE", { ip: clientIP, mimeType: file.type });
        return addSecurityHeaders(
          NextResponse.json(
            { error: "Invalid file type detected." },
            { status: 400 }
          )
        );
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return addSecurityHeaders(
        NextResponse.json({ error: "File is empty" }, { status: 400 })
      );
    }

    let text = "";
    const fileName = sanitizedName.toLowerCase();

    if (fileName.endsWith(".pdf")) {
      try {
        // Try Mistral OCR first if API key is available
        if (process.env.MISTRAL_API_KEY) {
          console.log("Using Mistral OCR for PDF parsing...");
          text = await extractTextWithMistral(buffer);
        } else {
          console.log("Mistral API key not found, falling back to basic PDF parsing...");
          const data = await pdf(buffer);
          text = data.text || "";
        }
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError);
        // Fallback to basic pdf-parse if Mistral fails but key was present
        if (process.env.MISTRAL_API_KEY) {
          try {
            const data = await pdf(buffer);
            text = data.text || "";
          } catch (fallbackError) {
            return addSecurityHeaders(
              NextResponse.json(
                { error: "Failed to parse PDF even with fallback. The file may be corrupted." },
                { status: 422 }
              )
            );
          }
        } else {
          return addSecurityHeaders(
            NextResponse.json(
              { error: "Failed to parse PDF. The file may be corrupted or password-protected." },
              { status: 422 }
            )
          );
        }
      }
    } else if (fileName.endsWith(".docx")) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        text = result.value || "";
      } catch (docxError) {
        console.error("DOCX parsing error:", docxError);
        return addSecurityHeaders(
          NextResponse.json(
            { error: "Failed to parse DOCX. The file may be corrupted." },
            { status: 422 }
          )
        );
      }
    } else if (fileName.endsWith(".txt")) {
      text = buffer.toString("utf8");
    } else {
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Unsupported file format. Please use PDF, DOCX, or TXT." },
          { status: 400 }
        )
      );
    }

    text = text.replace(/\s+/g, " ");
    text = text.replace(/\u00AD/g, "");
    text = text.replace(/\uFB01/g, "fi");
    text = text.replace(/\uFB02/g, "fl");
    text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
    text = text.trim();

    if (text.length < 10) {
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Could not extract enough text from this file. It might be empty or image-based." },
          { status: 422 }
        )
      );
    }

    return addSecurityHeaders(NextResponse.json({ text }));
  } catch (error) {
    console.error("File parsing error:", error);
    return addSecurityHeaders(
      NextResponse.json(
        { error: "Failed to parse file. Please try again." },
        { status: 500 }
      )
    );
  }
}
