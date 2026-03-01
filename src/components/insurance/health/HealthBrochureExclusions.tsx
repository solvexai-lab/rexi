"use client";

import { XCircle, ShieldAlert } from "lucide-react";

interface HealthBrochureExclusionsProps {
    exclusions: string[];
}

export function HealthBrochureExclusions({ exclusions }: HealthBrochureExclusionsProps) {
    if (!exclusions || exclusions.length === 0) return null;

    return (
        <div className="glass-panel-heavy squircle-soft shadow-sm p-6 md:p-8 border border-white/60 h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-serif font-bold text-lg text-slate-950">Standard Exclusions</h3>
                    <p className="text-xs text-slate-500 font-medium">What this product will not pay for</p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {exclusions.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100 group hover:border-slate-300 transition-colors">
                        <XCircle className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                        <p className="text-sm font-medium text-slate-600 leading-snug">{item}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
