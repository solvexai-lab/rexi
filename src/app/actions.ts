"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Saves a lead email to the `leads` table.
 * Called from LeadCaptureModal after the user submits their email.
 *
 * @param email - The email address to capture.
 * @param sourceContext - Which studio / page triggered the modal (e.g. 'motor-insurance', 'job-offer').
 */
export async function captureLeadAction(
    email: string,
    sourceContext: string
): Promise<{ success: boolean; error?: string }> {
    // Basic server-side validation
    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
        return { success: false, error: "Invalid email address." };
    }

    try {
        const { error } = await supabase.from("leads").insert({
            email: trimmed,
            source_context: sourceContext,
        });

        if (error) {
            // Ignore duplicate-email conflicts — user already captured
            if (error.code === "23505") return { success: true };
            console.error("[Lead Capture] Supabase error:", error);
            return { success: false, error: "Could not save. Please try again." };
        }

        return { success: true };
    } catch (err: any) {
        console.error("[Lead Capture] Unexpected error:", err);
        return { success: false, error: "Unexpected error." };
    }
}
