import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;
function getSupabase(): SupabaseClient {
    if (!_supabase) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) throw new Error("Supabase admin missing");
        _supabase = createClient(url, key, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
    }
    return _supabase;
}

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const DEFAULT_MAX_REQUESTS = 30; // fallback — overridden per-route

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetIn: number;
}

/**
 * Distributed rate limiting using Supabase
 * Works across multiple serverless instances
 */
export async function checkDistributedRateLimit(
    clientIP: string,
    maxRequests: number = DEFAULT_MAX_REQUESTS
): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;

    try {
        // --- Atomic upsert: reset window if expired, otherwise increment ---
        // We upsert with count=1 for new records, and for existing ones we
        // reset if the window expired, or increment atomically via update.
        const { data: existing, error: fetchError } = await getSupabase()
            .from("rate_limits")
            .select("*")
            .eq("client_ip", clientIP)
            .single();

        if (fetchError && fetchError.code !== "PGRST116") {
            console.error("Rate limit fetch error:", fetchError);
            return { allowed: true, remaining: maxRequests, resetIn: RATE_LIMIT_WINDOW_MS };
        }

        // No record yet, or window is expired — create/reset
        if (!existing || existing.window_start < windowStart) {
            const { error: upsertError } = await getSupabase()
                .from("rate_limits")
                .upsert(
                    { client_ip: clientIP, request_count: 1, window_start: now },
                    { onConflict: "client_ip" }
                );

            if (upsertError) {
                console.error("Rate limit upsert error:", upsertError);
                return { allowed: true, remaining: maxRequests - 1, resetIn: RATE_LIMIT_WINDOW_MS };
            }

            return { allowed: true, remaining: maxRequests - 1, resetIn: RATE_LIMIT_WINDOW_MS };
        }

        // Window is active — check current count first before incrementing
        if (existing.request_count >= maxRequests) {
            const resetIn = Math.max((existing.window_start + RATE_LIMIT_WINDOW_MS) - now, 0);
            return { allowed: false, remaining: 0, resetIn };
        }

        // Atomic increment using Postgres RPC to avoid race conditions
        const { data, error: rpcError } = await getSupabase()
            .rpc('increment_rate_limit', {
                p_ip: clientIP,
                p_max: maxRequests,
                p_window: RATE_LIMIT_WINDOW_MS
            });

        let resetIn = Math.max((existing.window_start + RATE_LIMIT_WINDOW_MS) - now, 0);

        if (rpcError) {
            console.error("Rate limit RPC update error (SQL function might not exist yet):", rpcError);
            // Fallback to optimistic lock (vulnerable to race conditions but functional)
            const newCount = existing.request_count + 1;
            const { error: updateError } = await getSupabase()
                .from("rate_limits")
                .update({ request_count: newCount })
                .eq("client_ip", clientIP)
                .eq("request_count", existing.request_count);

            if (updateError) {
                console.error("Rate limit update error:", updateError);
            }

            return { allowed: true, remaining: maxRequests - newCount, resetIn };
        }

        if (data && Array.isArray(data) && data.length > 0 && !data[0].allowed) {
            return { allowed: false, remaining: 0, resetIn };
        }

        const newCount = data && Array.isArray(data) && data.length > 0 ? data[0].new_count : existing.request_count + 1;
        return { allowed: true, remaining: maxRequests - newCount, resetIn };

    } catch (error) {
        console.error("Rate limit error:", error);
        return { allowed: true, remaining: maxRequests, resetIn: RATE_LIMIT_WINDOW_MS };
    }
}

/**
 * Clean up old rate limit records (run periodically)
 * Call this from a cron job or scheduled function
 */
export async function cleanupOldRateLimits(): Promise<void> {
    const cutoff = Date.now() - (RATE_LIMIT_WINDOW_MS * 2); // Keep 2x window for safety

    try {
        const { error } = await getSupabase()
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
