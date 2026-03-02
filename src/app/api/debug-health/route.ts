/**
 * Diagnostic endpoint to test each service in the health analysis pipeline.
 * GET /api/debug-health
 * Returns status of: Mistral OCR, Gemini AI, Supabase DB
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function GET() {
    const results: Record<string, any> = {
        timestamp: new Date().toISOString(),
        region: process.env.VERCEL_REGION || 'unknown',
        services: {},
    };

    // 1. Test Supabase connectivity
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!supabaseUrl) {
            results.services.supabase = { status: 'ERROR', message: 'NEXT_PUBLIC_SUPABASE_URL not set' };
        } else {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);
            const res = await fetch(`${supabaseUrl}/rest/v1/`, {
                method: 'HEAD',
                headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' },
                signal: controller.signal,
            });
            clearTimeout(timeout);
            results.services.supabase = { status: 'OK', httpStatus: res.status };
        }
    } catch (e: any) {
        results.services.supabase = {
            status: 'FAIL',
            message: e.name === 'AbortError' ? 'Timeout (5s) — likely blocked by ISP' : e.message,
        };
    }

    // 2. Test Mistral API key
    try {
        const mistralKey = process.env.MISTRAL_API_KEY;
        if (!mistralKey) {
            results.services.mistral = { status: 'ERROR', message: 'MISTRAL_API_KEY not set' };
        } else {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);
            const res = await fetch('https://api.mistral.ai/v1/models', {
                headers: { Authorization: `Bearer ${mistralKey}` },
                signal: controller.signal,
            });
            clearTimeout(timeout);
            results.services.mistral = { status: res.ok ? 'OK' : 'FAIL', httpStatus: res.status };
        }
    } catch (e: any) {
        results.services.mistral = { status: 'FAIL', message: e.message };
    }

    // 3. Test Gemini API key
    try {
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
            results.services.gemini = { status: 'ERROR', message: 'GEMINI_API_KEY not set' };
        } else {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`,
                { signal: controller.signal }
            );
            clearTimeout(timeout);
            results.services.gemini = { status: res.ok ? 'OK' : 'FAIL', httpStatus: res.status };
        }
    } catch (e: any) {
        results.services.gemini = { status: 'FAIL', message: e.message };
    }

    // 4. Check env vars existence (not values)
    results.envCheck = {
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        MISTRAL_API_KEY: !!process.env.MISTRAL_API_KEY,
        GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    };

    return NextResponse.json(results, { status: 200 });
}
