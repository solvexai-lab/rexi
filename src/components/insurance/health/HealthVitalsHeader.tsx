"use client";

import { HeartPulse } from "lucide-react";
import type { HealthPolicyData } from "@/lib/insurance/types";
import { formatCurrencyCompact } from "@/lib/utils/currency";

interface HealthVitalsHeaderProps {
    policyData: HealthPolicyData;
}

export function HealthVitalsHeader({ policyData }: HealthVitalsHeaderProps) {
    const si = policyData.sumInsured;
    const label = formatCurrencyCompact(si);

    return (
        <div className="glass-panel-heavy squircle-soft shadow-dreamy p-8 md:p-12 mb-8 relative overflow-hidden border border-white/60">
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-emerald-100/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full mb-4">
                        <HeartPulse className="w-3.5 h-3.5" />
                        {policyData.documentType === "brochure"
                            ? "Brochure"
                            : policyData.documentType === "certificate"
                                ? "Policy Certificate"
                                : "Health Policy"}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-950 tracking-tight leading-none">
                        {policyData.insurerName}
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 text-lg">{policyData.productName}</p>
                    {policyData.policyNumber && (
                        <p className="text-xs font-mono text-slate-400 mt-1">Policy: {policyData.policyNumber}</p>
                    )}
                </div>
                <div className="flex gap-6 md:gap-10 shrink-0">
                    <div className="text-center">
                        <p className="text-2xl md:text-4xl font-serif font-bold text-slate-950">{label}</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Sum Insured</p>
                    </div>
                    {policyData.premium > 0 && (
                        <div className="text-center">
                            <p className="text-2xl md:text-4xl font-serif font-bold text-slate-950">
                                {formatCurrencyCompact(policyData.premium)}
                            </p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Annual Premium</p>
                        </div>
                    )}
                    {policyData.claimSettlementRatio && (
                        <div className="text-center">
                            <p className="text-2xl md:text-4xl font-serif font-bold text-emerald-600">
                                {policyData.claimSettlementRatio}%
                            </p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Claim Settled</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
