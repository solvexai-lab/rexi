import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { nanoid } from "nanoid";

export const dynamic = "force-dynamic";

// Create a PostgreSQL pool for direct database access (bypasses PostgREST schema cache)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Generate a shareable link by storing the report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportType, reportData } = body;

    if (!reportType || !reportData) {
      return NextResponse.json(
        { error: "Missing reportType or reportData" },
        { status: 400 }
      );
    }

    if (!["contract", "offer"].includes(reportType)) {
      return NextResponse.json(
        { error: "Invalid reportType. Must be 'contract' or 'offer'" },
        { status: 400 }
      );
    }

    // Generate a unique short ID
    const id = nanoid(10);

    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Get client IP for tracking (optional)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

    // Use direct PostgreSQL connection
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO shared_reports (id, report_type, report_data, expires_at, created_by_ip)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, reportType, JSON.stringify(reportData), expiresAt.toISOString(), clientIp]
      );
    } finally {
      client.release();
    }

    // Generate the shareable URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      request.headers.get("origin") ||
      "https://rexilegal.com";

    const shareUrl = `${baseUrl}/shared/${id}`;

    return NextResponse.json({
      success: true,
      id,
      url: shareUrl,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Error in share-report API:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
}

// Retrieve a shared report by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing report ID" },
        { status: 400 }
      );
    }

    // Use direct PostgreSQL connection
    const client = await pool.connect();
    try {
      // Fetch the report
      const result = await client.query(
        `SELECT * FROM shared_reports WHERE id = $1 AND expires_at > NOW()`,
        [id]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Report not found or has expired" },
          { status: 404 }
        );
      }

      const data = result.rows[0];

      // Increment view count
      await client.query(
        `UPDATE shared_reports SET view_count = view_count + 1 WHERE id = $1`,
        [id]
      );

      return NextResponse.json({
        success: true,
        reportType: data.report_type,
        reportData: data.report_data,
        createdAt: data.created_at,
        expiresAt: data.expires_at,
        viewCount: (data.view_count || 0) + 1,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching shared report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
