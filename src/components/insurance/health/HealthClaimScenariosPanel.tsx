"use client";

import { CircleDollarSign } from "lucide-react";
import type { HealthClaimScenario } from "@/lib/insurance/types";
import { formatCurrencyCompact } from "@/lib/utils/currency";

interface HealthClaimScenariosPanelProps {
    scenarios: HealthClaimScenario[];
}

export function HealthClaimScenariosPanel({ scenarios }: HealthClaimScenariosPanelProps) {
    if (!scenarios || scenarios.length === 0) return null;

    return (
        <div className="glass-panel-heavy squircle-soft shadow-sm p-6 md:p-8 border border-white/60">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <CircleDollarSign className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-serif font-bold text-lg text-slate-950">Claim Scenarios</h3>
                    <p className="text-xs text-slate-500 font-medium">Real ₹ outcomes with your policy terms</p>
                </div>
            </div>
            <div className="space-y-6">
                {scenarios.map((s) => (
                    <div key={s.scenarioName} className="p-5 bg-white/50 rounded-2xl border border-slate-100 group hover:border-slate-300 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-slate-950">{s.emoji} {s.scenarioName}</h4>
                            <span className="text-xs text-slate-400 font-medium group-hover:text-slate-600 transition-colors">
                                Total bill: {formatCurrencyCompact(s.totalCost)}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">{s.description}</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                <p className="text-xl font-serif font-bold text-emerald-700">
                                    {formatCurrencyCompact(s.insurerPays)}
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-1">Insurer Pays</p>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-xl border border-red-100">
                                <p className="text-xl font-serif font-bold text-red-700">
                                    {formatCurrencyCompact(s.youPay)}
                                </p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mt-1">You Pay</p>
                            </div>
                        </div>
                        {s.breakdown && s.breakdown.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 opacity-80">
                                {s.breakdown.map((line, i) => (
                                    <div key={i} className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
                                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                        {line}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
