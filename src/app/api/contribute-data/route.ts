import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const body = await req.json();
    const {
      role,
      role_normalized,
      company,
      company_normalized,
      location,
      location_normalized,
      years_of_experience,
      base_salary,
      total_ctc,
      bonus,
      equity_value,
      currency,
      confidence_score
    } = body;

    const { error } = await supabase
      .from("salary_benchmarks")
      .insert([
        {
          role,
          role_normalized: role_normalized || role.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          company,
          company_normalized: company_normalized || company?.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          location,
          location_normalized: location_normalized || location.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          years_of_experience,
          base_salary,
          total_ctc,
          bonus,
          equity_value,
          currency,
          source: 'user_upload',
          confidence_score
        }
      ]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Data contribution error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
