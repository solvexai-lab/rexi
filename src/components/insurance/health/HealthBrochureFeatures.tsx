"use client";

import { Sparkles, CheckCircle2 } from "lucide-react";

interface HealthBrochureFeaturesProps {
    features: string[];
}

export function HealthBrochureFeatures({ features }: HealthBrochureFeaturesProps) {
    if (!features || features.length === 0) return null;

    return (
        <div className="glass-panel-heavy squircle-soft shadow-sm p-6 md:p-8 border border-white/60 h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-serif font-bold text-lg text-slate-950">Product Highlights</h3>
                    <p className="text-xs text-slate-500 font-medium">Key selling points from the brochure</p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-indigo-50/30 rounded-xl border border-indigo-100/50 group hover:bg-indigo-50 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                        <p className="text-sm font-bold text-slate-900 leading-snug">{feature}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
