import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5000;

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetIn: number;
}

/**
 * Distributed rate limiting using Supabase
 * Works across multiple serverless instances
 */
export async function checkDistributedRateLimit(clientIP: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;

    try {
        // Get or create rate limit record
        const { data: existing, error: fetchError } = await supabase
            .from("rate_limits")
            .select("*")
            .eq("client_ip", clientIP)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            // PGRST116 = no rows returned, which is fine
            console.error("Rate limit fetch error:", fetchError);
            // Fail open - allow the request if database is down
            return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW, resetIn: RATE_LIMIT_WINDOW_MS };
        }

        if (!existing || existing.window_start < windowStart) {
            // Create new window or reset expired window
            const { error: upsertError } = await supabase
                .from("rate_limits")
                .upsert({
                    client_ip: clientIP,
                    request_count: 1,
                    window_start: now,
                }, {
                    onConflict: "client_ip"
                });

            if (upsertError) {
                console.error("Rate limit upsert error:", upsertError);
                return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetIn: RATE_LIMIT_WINDOW_MS };
            }

            return {
                allowed: true,
                remaining: MAX_REQUESTS_PER_WINDOW - 1,
                resetIn: RATE_LIMIT_WINDOW_MS,
            };
        }

        // Check if limit exceeded
        if (existing.request_count >= MAX_REQUESTS_PER_WINDOW) {
            const resetIn = (existing.window_start + RATE_LIMIT_WINDOW_MS) - now;
            return {
                allowed: false,
                remaining: 0,
                resetIn: Math.max(resetIn, 0),
            };
        }

        // Increment counter
        const newCount = existing.request_count + 1;
        const { error: updateError } = await supabase
            .from("rate_limits")
            .update({ request_count: newCount })
            .eq("client_ip", clientIP);

        if (updateError) {
            console.error("Rate limit update error:", updateError);
        }

        const resetIn = (existing.window_start + RATE_LIMIT_WINDOW_MS) - now;
        return {
            allowed: true,
            remaining: MAX_REQUESTS_PER_WINDOW - newCount,
            resetIn: Math.max(resetIn, 0),
        };
    } catch (error) {
        console.error("Rate limit error:", error);
        // Fail open - allow request if there's an unexpected error
        return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW, resetIn: RATE_LIMIT_WINDOW_MS };
    }
}

/**
 * Clean up old rate limit records (run periodically)
 * Call this from a cron job or scheduled function
 */
export async function cleanupOldRateLimits(): Promise<void> {
    const cutoff = Date.now() - (RATE_LIMIT_WINDOW_MS * 2); // Keep 2x window for safety

    try {
        const { error } = await supabase
            .from("rate_limits")
            .delete()
            .lt("window_start", cutoff);

        if (error) {
            console.error("Rate limit cleanup error:", error);
        }
    } catch (error) {
        console.error("Rate limit cleanup failed:", error);
    }
}
