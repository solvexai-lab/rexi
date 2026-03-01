"use client";

import { ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { HealthRiskFlag } from "@/lib/insurance/types";

interface HealthRiskPanelProps {
    riskFlags: HealthRiskFlag[];
}

export function HealthRiskPanel({ riskFlags }: HealthRiskPanelProps) {
    if (!riskFlags || riskFlags.length === 0) return null;

    const icons = {
        HIGH: <ShieldAlert className="w-4 h-4 text-red-500" />,
        MEDIUM: <AlertTriangle className="w-4 h-4 text-amber-500" />,
        LOW: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
    };

    return (
        <div className="glass-panel-heavy squircle-soft shadow-sm p-6 border border-white/60">
            <h3 className="font-serif font-bold text-lg text-slate-950 mb-4 tracking-tight">Risk Radar</h3>
            <div className="space-y-3">
                {riskFlags.map((flag) => (
                    <div key={flag.id} className="flex items-start gap-3 p-4 bg-white/50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                        <div className="shrink-0 mt-0.5">
                            {icons[flag.severity] ?? icons.LOW}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-950 leading-tight">{flag.title}</p>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{flag.description}</p>
                            {flag.recommendation && (
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Reco: {flag.recommendation}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
