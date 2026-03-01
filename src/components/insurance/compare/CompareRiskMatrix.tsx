"use client";

import type { CompareRiskRow, ExtractedInsurer } from "@/lib/insurance/types";
import { ShieldAlert } from "lucide-react";

interface CompareRiskMatrixProps {
    riskMatrix: CompareRiskRow[];
    insurers: ExtractedInsurer[];
}

const severityStyles = {
    HIGH: { badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
    MEDIUM: { badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
    LOW: { badge: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
};

const statusStyle = {
    covered: { bg: "bg-green-100", text: "text-green-700", label: "✓" },
    missing: { bg: "bg-red-100", text: "text-red-600", label: "✗" },
    partial: { bg: "bg-amber-100", text: "text-amber-700", label: "~" },
};

export function CompareRiskMatrix({ riskMatrix, insurers }: CompareRiskMatrixProps) {
    return (
        <div className="glass-panel-heavy rounded-3xl border-white/60 overflow-hidden shadow-dreamy">
            <div className="flex items-center gap-3 p-6 border-b border-slate-100">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                </div>
                <div>
                    <h2 className="font-serif font-bold text-xl text-slate-950">Risk Matrix</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        <span className="inline-flex items-center gap-1 mr-3">
                            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Covered
                        </span>
                        <span className="inline-flex items-center gap-1 mr-3">
                            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Missing
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Partial
                        </span>
                    </p>
                </div>
            </div>

            <div className="p-4 sm:p-6 space-y-3">
                {riskMatrix.map((risk) => {
                    const sev = severityStyles[risk.severity] || severityStyles.LOW;
                    return (
                        <div key={risk.riskId} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                                {/* Risk label + severity */}
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${sev.dot}`} />
                                    <span className="font-bold text-slate-900 text-sm truncate">{risk.title}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${sev.badge}`}>
                                        {risk.severity}
                                    </span>
                                </div>

                                {/* Per-insurer status bubbles */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {risk.values.map((v) => {
                                        const insurer = insurers[v.insurerIndex];
                                        const s = statusStyle[v.status] || statusStyle.missing;
                                        return (
                                            <div key={v.insurerIndex} className="flex items-center gap-1.5">
                                                <div
                                                    className={`w-8 h-8 rounded-xl ${s.bg} ${s.text} flex items-center justify-center text-sm font-bold`}
                                                    title={insurer?.insurerName}
                                                >
                                                    {s.label}
                                                </div>
                                                <span className="text-xs text-slate-500 font-medium hidden sm:block max-w-[80px] truncate">
                                                    {insurer?.insurerName?.split(" ")[0] || `#${v.insurerIndex + 1}`}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
