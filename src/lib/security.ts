import { NextRequest, NextResponse } from "next/server";
import { checkDistributedRateLimit, type RateLimitResult } from "./rate-limit";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
export const ANALYSIS_RATE_LIMIT = 30;  // 30 per IP per hour — for expensive AI analysis routes
export const CHAT_RATE_LIMIT = 100;     // 100 per IP per hour — chat is cheaply looped by real users
const MAX_REQUESTS_PER_WINDOW = ANALYSIS_RATE_LIMIT; // default

// Fallback in-memory store for development/testing
const localRateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function getClientIP(req: NextRequest): string {
  // On Vercel, x-real-ip is set by the edge and cannot be spoofed.
  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback: mostly for localdev
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((s) => s.trim());
    return ips[ips.length - 1]; // last entry is added by trusted proxy
  }
  return "unknown";
}

/**
 * Check rate limit using distributed Supabase storage
 * Falls back to local storage in development
 */
export async function checkRateLimit(
  clientIP: string,
  maxRequests: number = MAX_REQUESTS_PER_WINDOW
): Promise<RateLimitResult> {
  // Use distributed rate limiting in production
  if (process.env.NODE_ENV === "production" || process.env.USE_DISTRIBUTED_RATE_LIMIT === "true") {
    return await checkDistributedRateLimit(clientIP, maxRequests);
  }

  // Fallback to local rate limiting for development
  return checkLocalRateLimit(clientIP, maxRequests);
}

/**
 * Local in-memory rate limiting (development only)
 */
function checkLocalRateLimit(clientIP: string, maxRequests: number = MAX_REQUESTS_PER_WINDOW): RateLimitResult {
  const now = Date.now();
  // Use a key that encodes the limit so different limits get separate buckets
  const key = `${clientIP}:${maxRequests}`;
  const record = localRateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    localRateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: maxRequests - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetIn: record.resetTime - now };
}


export function rateLimitedResponse(resetIn: number, limit: number = MAX_REQUESTS_PER_WINDOW): NextResponse {
  return NextResponse.json(
    { error: "You're going too fast! Please wait a moment before trying again." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil(resetIn / 1000)),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Date.now() + resetIn),
      },
    }
  );
}

export function sanitizeText(input: string): string {
  if (typeof input !== "string") {
    return "";
  }
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/eval\s*\(/gi, "")
    .replace(/expression\s*\(/gi, "")
    .slice(0, 500000);
}

export function validateFileType(fileName: string, allowedExtensions: string[]): boolean {
  const ext = fileName.toLowerCase().split(".").pop() || "";
  return allowedExtensions.includes(ext);
}

export function validateFileSize(size: number, maxSizeMB: number): boolean {
  return size <= maxSizeMB * 1024 * 1024;
}

export function validateContentType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some((type) => file.type === type || file.type.startsWith(type.replace("*", "")));
}

export function validateFile(file: File, allowedExtensions: string[], allowedMimeTypes: string[]): boolean {
  const extValid = validateFileType(file.name, allowedExtensions);
  const mimeValid = validateContentType(file, allowedMimeTypes);
  return extValid && mimeValid;
}

export function securityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };
}

export function addSecurityHeaders(response: NextResponse): NextResponse {
  const headers = securityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function validateRequestOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  if (!origin || !host) {
    return true;
  }

  try {
    const originUrl = new URL(origin);

    // Exact match (including port)
    if (originUrl.host === host) {
      return true;
    }

    const allowedHosts = [
      "localhost",
      "127.0.0.1",
      "rexi.pro",
      "www.rexi.pro",
      "rexi-legal.vercel.app", // exact production hostname — no wildcard
    ];

    return allowedHosts.some(
      (allowed) => originUrl.hostname === allowed
    );
  } catch {
    return false;
  }
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".")
    .slice(0, 255);
}

export function logSecurityEvent(event: string, details: Record<string, unknown>): void {
  // Always log security events — critical to catch issues in development too
  console.warn(`[SECURITY] ${event}:`, JSON.stringify(details));
}
