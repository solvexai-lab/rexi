"use client";

import { useState } from "react";
import { GitCompareArrows, Share2, Check, Copy } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function DashboardActions() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <Link
                href="/insurance/health/compare"
                className="h-10 px-4 text-xs font-bold text-slate-700 border-2 border-slate-200 hover:border-slate-950 hover:text-slate-950 rounded-full transition-all flex items-center gap-2 bg-white/50 backdrop-blur-sm"
            >
                <GitCompareArrows className="w-4 h-4" />
                <span className="hidden sm:block">Compare</span>
            </Link>

            <button
                onClick={handleShare}
                className={cn(
                    "h-10 px-6 text-xs font-bold rounded-full transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 uppercase tracking-widest flex items-center gap-2",
                    copied
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-950 text-white hover:bg-black"
                )}
            >
                {copied ? (
                    <>
                        <Check className="w-3.5 h-3.5" />
                        Copied
                    </>
                ) : (
                    <>
                        <Share2 className="w-3.5 h-3.5 mr-1" />
                        Share
                    </>
                )}
            </button>
        </div>
    );
}
