"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mail, ArrowRight, Loader2, Sparkles, X } from "lucide-react";
import { captureLeadAction } from "@/app/actions";

const STORAGE_KEY = "rexi_lead_email";

interface LeadCaptureModalProps {
    /** Which studio triggered the modal — stored with the lead */
    sourceContext: string;
    /** Called when the user has provided an email OR skipped */
    onContinue: () => void;
    /** Called if the user dismisses without continuing */
    onClose: () => void;
}

export const LeadCaptureModal = React.memo(function LeadCaptureModal({
    sourceContext,
    onContinue,
    onClose,
}: LeadCaptureModalProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus the input
    useEffect(() => {
        const timer = setTimeout(() => inputRef.current?.focus(), 150);
        return () => clearTimeout(timer);
    }, []);

    // Pre-fill from localStorage if already captured once
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setEmail(saved);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const result = await captureLeadAction(email.trim(), sourceContext);

        if (!result.success) {
            setError(result.error ?? "Something went wrong.");
            setLoading(false);
            return;
        }

        // Persist so we don't prompt again
        localStorage.setItem(STORAGE_KEY, email.trim().toLowerCase());
        setDone(true);

        // Brief success flash, then proceed
        setTimeout(() => onContinue(), 600);
    };

    const handleSkip = () => {
        // Mark as skipped so we don't re-prompt this session
        sessionStorage.setItem("rexi_lead_skipped", "1");
        onContinue();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/50 backdrop-blur-xl animate-in fade-in duration-500"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md glass-panel-heavy squircle-soft shadow-dreamy border border-white/60 animate-in zoom-in-95 slide-in-from-bottom-6 duration-500 overflow-hidden">
                {/* Decorative mesh */}
                <div className="absolute inset-0 mesh-gradient opacity-30 pointer-events-none" />

                {/* Dismiss button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-950 hover:bg-white/80 rounded-xl transition-all z-10 group"
                >
                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="relative z-10 p-8 md:p-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl transition-all duration-500 ${done ? "bg-emerald-500" : "bg-slate-950"}`}>
                        {done ? (
                            <Sparkles className="w-8 h-8 text-white animate-in zoom-in duration-300" />
                        ) : (
                            <Mail className="w-8 h-8 text-white" />
                        )}
                    </div>

                    {/* Headline */}
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-950 tracking-tight mb-2">
                        {done ? "You're all set!" : "Where should we send your analysis?"}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
                        {done
                            ? "Heading into the studio now…"
                            : "Enter your email to receive a copy of your scan results once Rexi is done."}
                    </p>

                    {!done && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email input */}
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    ref={inputRef}
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError(null);
                                    }}
                                    required
                                    className="w-full h-14 pl-11 pr-4 bg-white/70 border-2 border-slate-100 focus:border-slate-950 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:shadow-[0_0_0_4px_rgba(15,23,42,0.06)]"
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <p className="text-xs text-red-600 font-medium px-1 animate-in fade-in slide-in-from-top-2">
                                    {error}
                                </p>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading || !email.trim()}
                                className="w-full h-14 bg-slate-950 hover:bg-black text-white rounded-2xl font-bold text-sm transition-all duration-200 shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        Continue to Studio
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            {/* Skip */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleSkip}
                                    className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors underline underline-offset-2"
                                >
                                    Skip for now
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer note */}
                {!done && (
                    <div className="relative z-10 px-8 md:px-10 pb-6">
                        <p className="text-[10px] text-slate-400 font-medium text-center tracking-wide">
                            No password. No spam. Unsubscribe anytime.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
});

/**
 * Hook to check if lead capture is needed.
 * Returns true if we should show the modal.
 */
export function shouldShowLeadCapture(): boolean {
    if (typeof window === "undefined") return false;
    // Already captured their email
    if (localStorage.getItem(STORAGE_KEY)) return false;
    // Already skipped this session
    if (sessionStorage.getItem("rexi_lead_skipped")) return false;
    return true;
}
